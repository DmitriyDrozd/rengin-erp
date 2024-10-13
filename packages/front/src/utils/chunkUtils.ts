const CHUNK_SIZE = 500;

/**
 * Модификатор фукнции экшена для обработки запросов со слишком большим количеством записей
 * Решает проблему ошибки 413 (Request Entity Too Large) от xhr.js
 * 
 * Используется при массовом добавлении \ удалении из списков в модалке субъекта
 * @param updated 
 * @param updateFn 
 */
export const chunkHandler = (updated: any[], updateFn: (updatedItems: any[]) => void) => {
    if (updated.length > CHUNK_SIZE) {
        const chunkCount = Math.ceil(updated.length / CHUNK_SIZE);

        const chunks: Array<Array<any>> = updated.reduce((acc, item, index) => {
            const chunkNumber = Math.floor(index / CHUNK_SIZE);
            acc[chunkNumber].push(item);
            return acc;
        }, [ ...Array(chunkCount).keys() ].map(() => []));

        chunks.forEach(updateFn);
    } else {
        updateFn(updated);
    }
}
