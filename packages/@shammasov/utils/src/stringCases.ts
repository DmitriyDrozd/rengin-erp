import {CamelCase, KebabCase, PascalCase, SnakeCase} from "type-fest";

export type LowerToUpperToLowerCaseMapper = {
    a: 'A'
    b: 'B'
    c: 'C'
    d: 'D'
    e: 'E'
    f: 'F'
    g: 'G'
    h: 'H'
    i: 'I'
    j: 'J'
    k: 'K'
    l: 'L'
    m: 'M'
    n: 'N'
    o: 'O'
    p: 'P'
    q: 'Q'
    r: 'R'
    s: 'S'
    t: 'T'
    u: 'U'
    v: 'V'
    w: 'W'
    x: 'X'
    y: 'Y'
    z: 'Z'
}

export type UpperToLowerCaseMapper = {
    A: 'a'
    B: 'b'
    C: 'c'
    D: 'd'
    E: 'e'
    F: 'f'
    G: 'g'
    H: 'h'
    I: 'i'
    J: 'j'
    K: 'k'
    L: 'l'
    M: 'm'
    N: 'n'
    O: 'o'
    P: 'p'
    Q: 'q'
    R: 'r'
    S: 's'
    T: 't'
    U: 'u'
    V: 'v'
    W: 'w'
    X: 'x'
    Y: 'y'
    Z: 'z'
}


export type HeadLetter<T> = T extends `${infer FirstLetter}${infer _Rest}` ? FirstLetter : never
export type TailLetters<T> = T extends `${infer _FirstLetter}${infer Rest}` ? Rest : never

export type LetterToUpper<T> = T extends `${infer FirstLetter}${infer _Rest}`
    ? FirstLetter extends keyof LowerToUpperToLowerCaseMapper
        ? LowerToUpperToLowerCaseMapper[FirstLetter]
        : FirstLetter
    : T

export type LetterToLower<T> = T extends `${infer FirstLetter}${infer _Rest}`
    ? FirstLetter extends keyof UpperToLowerCaseMapper
        ? UpperToLowerCaseMapper[FirstLetter]
        : FirstLetter
    : T

export type ToLowerCase<T> = T extends ''
    ? T
    : `${LetterToLower<HeadLetter<T>>}${ToLowerCase<TailLetters<T>>}`

// First letter is upper rest is lower
export type ToSentenceCase<T> = `${LetterToUpper<HeadLetter<T>>}${ToLowerCase<TailLetters<T>>}`

export type ToPascalCase<T> = T extends ``
    ? T
    : T extends `${infer FirstWord}_${infer RestLetters}`
        ? `${ToSentenceCase<FirstWord>}${ToPascalCase<RestLetters>}`
        : ToSentenceCase<T>

export type UpperCaseToCamelCase<T extends string> = T extends `${string}_${string}` ? `${ToLowerCase<HeadLetter<T>>}${TailLetters<ToPascalCase<T>>}` : Lowercase<T>


// apply snake case into objects
type Cast<T, U> = T extends U ? T : U
type GetObjValues<T> = T extends Record<any, infer V> ? V : never

type CallRecursiveTransformIfObj<T> = T extends Record<any, any> ? TransformKeysToCamelCase<T> : T

export type SwitchKeyValue<
    T,
    T1 extends Record<string, any> = {
        [K in keyof T]: { key: K; value: T[K] }
    },
    T2 = {
        [K in GetObjValues<T1>['value']]: Extract<GetObjValues<T1>, { value: K }>['key']
    }
> = T2

type TransformKeysToCamelCase<
    T extends Record<string, any>,
    T0 = { [K in keyof T]: UpperCaseToCamelCase<K> },
    T1 = SwitchKeyValue<T0>,
    T2 = { [K in keyof T1]: CallRecursiveTransformIfObj<T[Cast<T1[K], string>]> }
> = T2


type NestedKeyRevert = TransformKeysToCamelCase<{
    FOO_BAR: string
    ANOTHER_FOO_BAR: true | number,
    NESTED_KEY: {
        NEST_FOO: string
        NEST_BAR: boolean
    },
}>
export type StringCase = keyof CasesMap
export type CasesMap<T extends string = string> = {
    camel: CamelCase<T>
    kebab: KebabCase<T>
    pascal: PascalCase<T>
    snake: SnakeCase<T>,
    title: string
    sentence: string
}
export const convertCase = <C extends StringCase>( toCase:C) => <T extends string>(str: T): CasesMap<T>[C] => {
    if (!str) return '';

    const delimiter =
        toCase === 'snake'
            ? '_'
            : toCase === 'kebab'
                ? '-'
                : ['title', 'sentence'].includes(toCase)
                    ? ' '
                    : '';

    const transform = ['camel', 'pascal'].includes(toCase)
        ? x => x.slice(0, 1).toUpperCase() + x.slice(1).toLowerCase()
        : ['snake', 'kebab'].includes(toCase)
            ? x => x.toLowerCase()
            : toCase === 'title'
                ? x => x.slice(0, 1).toUpperCase() + x.slice(1)
                : x => x;

    const finalTransform =
        toCase === 'camel'
            ? x => x.slice(0, 1).toLowerCase() + x.slice(1)
            : toCase === 'sentence'
                ? x => x.slice(0, 1).toUpperCase() + x.slice(1)
                : x => x;

    const words = str.match(
        /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g
    );

    return finalTransform(words.map(transform).join(delimiter));
};


export const toCamelCase =convertCase('camel')

// 'mixedStringWithSpacesUnderscoresAndHyphens'
convertCase( 'pascal')('mixed_string with spaces_underscores-and-hyphens');
// 'MixedStringWithSpacesUnderscoresAndHyphens'
convertCase('kebab')('mixed_string with spaces_underscores-and-hyphens');
// 'mixed-string-with-spaces-underscores-and-hyphens'
convertCase('snake')('mixed_string with spaces_underscores-and-hyphens', );
// 'mixed_string_with_spaces_underscores_and_hyphens'
convertCase('title')('mixed_string with spaces_underscores-and-hyphens', );
// 'Mixed String With Spaces Underscores And Hyphens'
convertCase('sentence')('mixed_string with spaces_underscores-and-hyphens', );