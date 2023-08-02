import {GServices} from './getGServices';

export const SHEET_NAMES = ['Титул', 'Роли','Пользователи','Проекты','Статусы: blocks','Статусы: windows',]
export const RENGIN_SPREADSHEET_ID = process.env.RENGIN_SPREADSHEET_ID || '17bILUbTDEkavwoq7uLdBBbPspwPZq70U6595BNyvlwo'//'1d4DqlIgWEZCaQ5P2C8M8ambosgtNLHw4ml_OOziKarg'//'17bILUbTDEkavwoq7uLdBBbPspwPZq70U6595BNyvlwo'
export default async (
    gServices: GServices,
    spreadsheetId: string = RENGIN_SPREADSHEET_ID,
    ) => {
    const rangeValues = await gServices.sheets.withSpreadsheet(spreadsheetId).fetchRangesData(SHEET_NAMES)
    return rangeValues

}