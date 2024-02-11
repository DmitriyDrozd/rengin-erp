
export type PluralEngindEng<S extends string = string> = `${S}s`

export const pluralEngindEnd = <S extends string = string>(singular: S):PluralEngindEng<S> =>
    (singular.slice(-1) === 's' ? singular+'es' : singular+'s') as any as PluralEngindEng<S>
