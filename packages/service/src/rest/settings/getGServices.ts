import {GoogleAuth} from "google-auth-library/build/src/auth/googleauth";
import moment from "moment/moment";
import {sheets_v4} from "googleapis/build/src/apis/sheets/v4";
import {UnPromisify} from "@sha/utils";
import {google, Auth} from 'googleapis';

export const G_SCOPES = [
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/youtube',
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/gmail.send'
];

export type A1Range<SheetName extends string = string> =
    | SheetName
    | `${SheetName}!${string}`

const colNameAlphabet = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'] as const

export type RangeData = sheets_v4.Schema$ValueRange['values']

export const getGAuth = async (keyFile, scopes = G_SCOPES) =>
    await new Auth.GoogleAuth({
        keyFile,
        scopes,
    }).getClient();


const colNamesByNumber = []

export const colIndexToName = (columnNumber)  => {
    const length = colNameAlphabet.length
    if(!colNamesByNumber[columnNumber]) {
        let columnName = "";
        while (columnNumber > 0) {
            const rem = columnNumber % length;
            columnName += rem === 0 ? "Z" : colNameAlphabet[rem - 1];
            columnNumber = rem === 0 ? columnNumber / length - 1:Math.floor(columnNumber / length);
        }
        colNamesByNumber[columnNumber] = columnName.split("").reverse().join("");
    }
    return colNamesByNumber[columnNumber]
}

export type GSheetValueRange = sheets_v4.Schema$ValueRange

export type GSheetValueRangesResponse = GSheetValueRange[]

export const getGServices = async (keyFile, scopes= G_SCOPES) => {

    const getSheetServices = (auth: GoogleAuth<any>) => {
        const gSheetService = google.sheets({version: 'v4', auth}).spreadsheets
        const duplicateSpreadSheetAndGetId = async (fromSheetId, folderId, newName: string = new Date().toISOString()) => {
            const res = await  google.drive({version: 'v3', auth}).files.copy({
                fileId:fromSheetId,
                requestBody: {
                    name: newName,
                    parents: [folderId],

                }
            });
            return res.data.id
        }

        const withSpreadsheet = <SheetName extends string>(spreadsheetId: string) => ({
            fetchRangesData:  async (ranges: A1Range[] = undefined, rowsToSkip = 0):Promise<sheets_v4.Schema$ValueRange[]> => {
                const res = await gSheetService.values.batchGet({spreadsheetId,auth,ranges})
                return res.data.valueRanges.map(v => ({...v, values: v.values.slice(rowsToSkip)}))
            },
            updateRangesData: async (rangeUpdates: {range: A1Range, values:RangeData }[]) =>
                (await gSheetService.values.batchUpdate({spreadsheetId,auth,requestBody: {
                        data: rangeUpdates, valueInputOption:'USER_ENTERED'}})).data
            ,
        })

        return {
            withSpreadsheet,
            createSpreadSheet: async (title = moment().format()) =>
                (await gSheetService.create({requestBody:{properties:{title}}})).data,
            copySpreadSheetTo: async (sourceSpreadsheetId: string, destinationSpreadsheetId: string) =>
                (await gSheetService.sheets.copyTo({
                    spreadsheetId: sourceSpreadsheetId,
                    requestBody:{destinationSpreadsheetId}})).data
            ,
            duplicateSpreadSheetAndGetId,
            gSheetService,
        }

    }
    const auth = await getGAuth(keyFile,scopes)
    const sheets = getSheetServices(auth)
    const drive = google.drive({version: 'v3', auth})
    return {
        drive,
        auth,
        sheets,
    }
}

export type GServices = UnPromisify<ReturnType<typeof getGServices>>

export default getGServices
