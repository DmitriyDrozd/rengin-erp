import {UploadOutlined} from "@ant-design/icons";
import React from "react";
import {Button} from "antd";
import type {sheets_v4} from "googleapis/build/src/apis/sheets/v4.js";
import {times} from "ramda";
import processGSheet from "./process-gSheet";
import {useStore} from "react-redux";
import {getRestApi} from "iso";
import {GoogleAuth} from "google-auth-library";
import {google} from "googleapis";
import {A1Range, RangeData} from "service/src/fastify/gapis-token/getGServices";
import {getGAuth} from "service/src/fastify/gapis-token/gapis-token";
import {googleSheetLibPromise} from "iso/src/utils/importGoogleSpreadsheet";

const SHEET_ID ='1OpeniUQU1I_VX0E0_NKygOVVSvPBpBdz6ML8XzVkRNk'


export const G_SCOPES = [
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/youtube',
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/gmail.send'
];


const colNameAlphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'] as const

//export type RangeData = sheets_v4.Schema$ValueRange['values']
const creds ={
    "type": "service_account",
    "project_id": "winlab-377517",
    "private_key_id": "7cc80b9e8d5781dd35bf374e215f71763100769e",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCSJdP/o7sPQXTC\nf9ofZLlpysKShHg9Z1N1mAEPBimJ/tXcugJhdMNrSUPGyc6VdFJ9RpOqeTAK195d\n2SmDMjzNIxZuS8E0JNt5FtKzjLaSduTJFoj+7xxiWDnr4XBc/ot7pjOb8MJWgqcE\nqhZReoARuSoBvhQmbdgnDodatYEXnzPbplCHPc7JRA+eZIo7aVljrp5KuQObPXPX\ncT1KcMiLpMne1KR/+utNCIxxJi9hHQreAYu2c8BT/TjknGIt9FOWzkyLNIhC39ay\n3DQFDaHiIxNcQQiptZP5eVud+jW/fJQZybm+OE6XCOzSX35H6Q5jT4ncLa9WwL5I\nfsohstWNAgMBAAECggEAATPlKLy/igKZ5A01TajV4HRWDD/21VqHqfdpmtFhf3c6\nFKpF4WjFQEQcFgNh0IJijhFfSbncQVqWw+Lzn9bGqqbX778ZL0VWYQq6X9aP8hNJ\nvWCSxAuntM97uos3vNbYwwMSeFK6PAgF49iafRUq/0+syX2M9jv/2WJvOWSLqWwX\nds8Yg8uz3z/U3wBgU+1AkEyWscYWAs1oFLQPzyDv0aNkudYbBmzK2eqpFxDVeA4D\nRtX5JbYSguRkutFNq2OXpUFmy4qNDU4qzfYA63ghC1WvFJp9ZNTxwycQoBGSo16z\nUwyufezuviuKg6sdTjNGVqqdIEXSz6bb1gfqkRsHgQKBgQDCS3PBrH+9bTpHXfRD\nGI5fo9XMhRhFK7R1YZpacVw74KraK0PKVrcDsYS8AcHuzUUw+O93xNctR0iQX3wT\nsuvmcDbfLv5KvYKRdV1b5orq1gMrGKBEx/HzplVkSkM95yH+J6aXcoszd4aQTkvc\n9uquMJ3/m0c9i9bzZB552Zn9HQKBgQDAj+6HJze9DRGi1TTJ/50Jd8jXnMDOeAn/\nrIQNUZs4OMyDNi1lxp9iDLc7hZQY6ssxx11mDTIlGoQbIR2LOZBSKtdS9vHslJuO\nl+4hJo5++b3uI98a6JC2vvhnIAp9QHXJU+oTc4EetqH/OZKxdrDonJC6kIJAXFDg\n7+K4OMh/MQKBgFdqdyRWJgrmD+h4HyPo8nWZUuH3p9nHNiPxy+6RPjw6cuRBvvhU\nV3cz8VJdQBHfDRhhh+xNBbr7bWx3aW27fGNrbWSw0fxyk0I6mcx1R18s9rP3GnSX\nuQY0egrrVqGNUj/1OwC8qmB3kHVwpLU/6oqAmTWdeUn5lrZe/083Vg8JAoGACDuf\nJSQmG+0dHesjsKc/HZKDgcRv8ePr+YR0uOUOT98Nz2ZXloxhcB2/D8psRIx1V5GA\nisZxqGhz0X0e+D7jzr+KKT/ppAXOiNAyHDS7zu36kt3xwgLDfSy5Dh+ukyBYaN0v\nmtlLYfbJAlKB1RiQA8H95hwblYjc5GEdPmcfG2ECgYAO1rPzf2R1g2SwCetYlNFk\ndMkJHKheCj1SRLgL1CcjZNz0g7LnzgNzbqUTfSfkkWvfc9u4R41NE9ylrQwKn18o\nmKViWyFatRSGAOicPb5Gkn49CMfA+hE+JRHg/8o2iouFx6mkwFYJos9wkJ7IbUxL\noh7Jh/bR+MsUlr9vL07Dzw==\n-----END PRIVATE KEY-----\n",
    "client_email": "rendindesk-server@winlab-377517.iam.gserviceaccount.com",
    "client_id": "103368862153382673247",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/rendindesk-server%40winlab-377517.iam.gserviceaccount.com",
    "universe_domain": "googleapis.com"
}

 //const authClient = auth.fromAPIKey(API_KEY)/
/*{
     "type": "service_account",
     "project_id": "winlab-377517",
     "private_key_id": "7cc80b9e8d5781dd35bf374e215f71763100769e",
     "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCSJdP/o7sPQXTC\nf9ofZLlpysKShHg9Z1N1mAEPBimJ/tXcugJhdMNrSUPGyc6VdFJ9RpOqeTAK195d\n2SmDMjzNIxZuS8E0JNt5FtKzjLaSduTJFoj+7xxiWDnr4XBc/ot7pjOb8MJWgqcE\nqhZReoARuSoBvhQmbdgnDodatYEXnzPbplCHPc7JRA+eZIo7aVljrp5KuQObPXPX\ncT1KcMiLpMne1KR/+utNCIxxJi9hHQreAYu2c8BT/TjknGIt9FOWzkyLNIhC39ay\n3DQFDaHiIxNcQQiptZP5eVud+jW/fJQZybm+OE6XCOzSX35H6Q5jT4ncLa9WwL5I\nfsohstWNAgMBAAECggEAATPlKLy/igKZ5A01TajV4HRWDD/21VqHqfdpmtFhf3c6\nFKpF4WjFQEQcFgNh0IJijhFfSbncQVqWw+Lzn9bGqqbX778ZL0VWYQq6X9aP8hNJ\nvWCSxAuntM97uos3vNbYwwMSeFK6PAgF49iafRUq/0+syX2M9jv/2WJvOWSLqWwX\nds8Yg8uz3z/U3wBgU+1AkEyWscYWAs1oFLQPzyDv0aNkudYbBmzK2eqpFxDVeA4D\nRtX5JbYSguRkutFNq2OXpUFmy4qNDU4qzfYA63ghC1WvFJp9ZNTxwycQoBGSo16z\nUwyufezuviuKg6sdTjNGVqqdIEXSz6bb1gfqkRsHgQKBgQDCS3PBrH+9bTpHXfRD\nGI5fo9XMhRhFK7R1YZpacVw74KraK0PKVrcDsYS8AcHuzUUw+O93xNctR0iQX3wT\nsuvmcDbfLv5KvYKRdV1b5orq1gMrGKBEx/HzplVkSkM95yH+J6aXcoszd4aQTkvc\n9uquMJ3/m0c9i9bzZB552Zn9HQKBgQDAj+6HJze9DRGi1TTJ/50Jd8jXnMDOeAn/\nrIQNUZs4OMyDNi1lxp9iDLc7hZQY6ssxx11mDTIlGoQbIR2LOZBSKtdS9vHslJuO\nl+4hJo5++b3uI98a6JC2vvhnIAp9QHXJU+oTc4EetqH/OZKxdrDonJC6kIJAXFDg\n7+K4OMh/MQKBgFdqdyRWJgrmD+h4HyPo8nWZUuH3p9nHNiPxy+6RPjw6cuRBvvhU\nV3cz8VJdQBHfDRhhh+xNBbr7bWx3aW27fGNrbWSw0fxyk0I6mcx1R18s9rP3GnSX\nuQY0egrrVqGNUj/1OwC8qmB3kHVwpLU/6oqAmTWdeUn5lrZe/083Vg8JAoGACDuf\nJSQmG+0dHesjsKc/HZKDgcRv8ePr+YR0uOUOT98Nz2ZXloxhcB2/D8psRIx1V5GA\nisZxqGhz0X0e+D7jzr+KKT/ppAXOiNAyHDS7zu36kt3xwgLDfSy5Dh+ukyBYaN0v\nmtlLYfbJAlKB1RiQA8H95hwblYjc5GEdPmcfG2ECgYAO1rPzf2R1g2SwCetYlNFk\ndMkJHKheCj1SRLgL1CcjZNz0g7LnzgNzbqUTfSfkkWvfc9u4R41NE9ylrQwKn18o\nmKViWyFatRSGAOicPb5Gkn49CMfA+hE+JRHg/8o2iouFx6mkwFYJos9wkJ7IbUxL\noh7Jh/bR+MsUlr9vL07Dzw==\n-----END PRIVATE KEY-----\n",
     "client_email": "rendindesk-server@winlab-377517.iam.gserviceaccount.com",
     "client_id": "103368862153382673247",
     "auth_uri": "https://accounts.google.com/o/oauth2/auth",
     "token_uri": "https://oauth2.googleapis.com/token",
     "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
     "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/rendindesk-server%40winlab-377517.iam.gserviceaccount.com",
     "universe_domain": "googleapis.com"
});
*/
export default () => {

// Or embed it directly
    const store = useStore()
    const onImportClick = async () => {
        const GSLib = await googleSheetLibPromise
        const api = await getRestApi()

        //const auth = authClient
        const doc = new GSLib.GoogleSpreadsheet(SHEET_ID,  {token: await api.getNewGToken()});
        await doc.loadInfo(); // loads document properties and worksheets
        const result = await processGSheet(doc, store)
        console.log(result)
    }

    return (
        <Button icon={<UploadOutlined />} onClick={onImportClick}>
        </Button>
    )
}



export const importIssues = async () => {

    const auth = await getGAuth()

    const ws = getSheetServices(auth).withSpreadsheet(SHEET_ID)
    const range = 'Sheet1!A1:D1'
    const r = await ws.gSheetService.batchUpdate({
        spreadsheetId:SHEET_ID,
        fields:'*',
        auth,
        requestBody: {
            requests:[
                {updateCells:{
                        fields: "*",
                        range:{
                            sheetId: 0,
                            startColumnIndex:0,
                            startRowIndex:0,
                            endRowIndex:1,
                            endColumnIndex:1,
                        },
                        rows: [
                            {
                                values: [
                                    {
                                        note: 'AAAAA'
                                    }
                                ]
                            }
                        ]
                    }}
            ]
        }
    })//fetchRangesValues([range])//updateRangesData([{range:,values:[[{note:'hi']}])
    console.log(r)
}

const getSheetServices = (auth: GoogleAuth) => {
    const gSheetService = google.sheets({version: 'v4', auth,}).spreadsheets
    const duplicateSpreadSheetAndGetId = async (fromSheetId, folderId, newName: string = new Date().toISOString()) => {
        const res = await google.drive({version: 'v3', auth}).files.copy({
            fileId: fromSheetId,
            requestBody: {
                name: newName,
                parents: [folderId],

            }
        });
        return res.data.id
    }


    const withSpreadsheet = <SheetName extends string>(spreadsheetId: string) => {
        const fetchRangesValues = async (a1Ranges: A1Range[], rowsToSkip = 0 as number | number[]): Promise<sheets_v4.Schema$ValueRange[]> => {
            const rowToSkipPerRange = typeof rowsToSkip === 'number' ? times((i) => rowsToSkip, a1Ranges.length) : rowsToSkip
            const res = await gSheetService.values.batchGet({spreadsheetId, auth, ranges: a1Ranges})
            return res.data.valueRanges.map((v, index) => ({
                ...v,
                values: v.values.slice(rowToSkipPerRange[index])
            }))
        }
        return {
            gSheetService,
            getRangesData: async (rangeRequests: { range: A1Range }[], rowsToSkip = 0): Promise<sheets_v4.Schema$ValueRange[]> => {
                const res = await gSheetService.values.batchGet({
                    spreadsheetId,
                    auth,
                    ranges: rangeRequests.map(r => r.range)
                })
                return res.data.valueRanges.map(v => ({...v, values: v.values.slice(rowsToSkip)}))
            },
            clearRanges: async (rangeRequests: { range: A1Range }[]): Promise<sheets_v4.Schema$ValueRange[]> => {
                const res = await gSheetService.values.batchClear({
                    spreadsheetId,
                    auth,
                    ranges: rangeRequests.map(r => r.range)
                })

            },
            fetchRangesValues,

            updateRangesData: async (rangeUpdates: { range: A1Range, values: RangeData }[]) =>
                (await gSheetService.values.batchUpdate({
                    spreadsheetId, auth, requestBody: {
                        data: rangeUpdates, valueInputOption: 'USER_ENTERED'
                    }
                })).data
            ,
        }
    }

    return {
        withSpreadsheet,
        duplicateSpreadSheetAndGetId,
        gSheetService,
    }

}
