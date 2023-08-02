type StringOrNumKeys<TObj> = keyof TObj & (string | number);
type NestedPath<TValue, Prefix extends string, TValueNestedChild> = TValue extends object ? `${NestedFieldPaths<TValue, TValueNestedChild>}` : never;
/**
 * Returns a union of all possible paths to nested fields in `TData`.
 */
type TerminalColDefField<TData = any, TValue = any> = TData extends any ? NestedFieldPaths<TData, TValue> : never;
/**
 * Returns a union of all possible paths to nested fields in `TData`.
 */
 type NestedFieldPaths<TData = any, TValue = any> = {
    [TKey in StringOrNumKeys<TData>]: (TData[TKey] extends TValue ? `${TKey}` : never) | NestedPath<TData[TKey], `${TKey}`, TValue>;
}[StringOrNumKeys<TData>];
export type ColumnNamer<T> = {
    propertyName: TerminalColDefField<T>
    headerName: string
}

type A = {
    a: string
    b: {
        d: string
        c: {
            d: number
        }
    }
}

const n: ColumnNamer<A> = {
    propertyName: '',
    headerName:'s'
}