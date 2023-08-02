import R from 'ramda';
import readXlsxFile, {readSheetNames} from 'read-excel-file/node';

const specialCharsToReplace = {
    [String.fromCharCode(32)]: [String.fromCharCode(160)],
}

export default async (file: string) => {
    const sheetNames = await readSheetNames(file)
    const sheetsList = await Promise.all(sheetNames.map(
        async (sheet) => {
            const obj = {
                name: sheet,
                table: (await readXlsxFile(file, {sheet})).map(row =>
                    row.map(cell => {
                        if (typeof cell === 'string') {
                            let result = cell
                            /*
                               Object.entries(([k,v]) => {

                                 v.forEach( l =>
                                   result = result.replace(l, k)
                                 )
                               })

                             */
                            return result//.replaceAll(/\s/g, String.fromCharCode(32))
                        }
                        return String(cell)
                    })
                )
            }

            return {
                ...obj,
                mapRows: <T>(mapper: (row: Array<string>, index?: number) => T) => {
                    const items = R.tail(obj.table).filter(r => r[0] !== '' && r[0] !== ' ' && r[0] !== undefined).map((row, index) => mapper(row, index))
                    return items
                }
            }
        }
    ))
    type Sheet = typeof sheetsList[number]
    const sheetsMap: Record<string, Sheet> = {}
    sheetsList.forEach(sheet => sheetsMap[sheet.name] = sheet)

    return {
        sheetsList,
        sheetsMap,

    }


}
