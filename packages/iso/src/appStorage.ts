export const appStorage = {
    setItem: <T = any>(key: string, value: T) =>
        typeof value === 'undefined'
            ? localStorage.removeItem(key)
            : localStorage.setItem(key, JSON.stringify(value)),

    removeItem: (key: string) =>
        localStorage.removeItem(key),

    getItem: <T = any>(key: string, defaultValue?: T): T | undefined => {
        let result: T
        try {
            const item = localStorage.getItem(key)
            if (item) {
                result = JSON.parse(item)
            }

        } catch (e) {
            console.error('Error while access localStorage with key', key, e)
        }

        return (typeof result !== 'undefined') ? result : defaultValue
    }
}
