type Append<X, T extends any[]> =
    T extends [infer A0, infer A1, infer A2, infer A3, infer A4, infer A5, infer A6, infer A7, infer A8, infer A9] ?
        [A0, A1, A2, A3, A4, A5, A6, A7, A8, A9, X] :

        T extends [infer A0, infer A1, infer A2, infer A3, infer A4, infer A5, infer A6, infer A7, infer A8] ?
            [A0, A1, A2, A3, A4, A5, A6, A7, A8, X] :

            T extends [infer A0, infer A1, infer A2, infer A3, infer A4, infer A5, infer A6, infer A7] ?
                [A0, A1, A2, A3, A4, A5, A6, A7, X] :

                T extends [infer A0, infer A1, infer A2, infer A3, infer A4, infer A5, infer A6] ?
                    [A0, A1, A2, A3, A4, A5, A6, X] :

                    T extends [infer A0, infer A1, infer A2, infer A3, infer A4, infer A5] ?
                        [A0, A1, A2, A3, A4, A5, X] :

                        T extends [infer A0, infer A1, infer A2, infer A3, infer A4] ?
                            [A0, A1, A2, A3, A4, X] :

                            T extends [infer A0, infer A1, infer A2, infer A3] ?
                                [A0, A1, A2, A3, X] :

                                T extends [infer A0, infer A1, infer A2] ?
                                    [A0, A1, A2, X] :

                                    T extends [infer A0, infer A1] ?
                                        [A0, A1, X] :

                                        T extends [infer A0] ?
                                            [A0, X] : never;


type TraverseTop<T> =
    T extends object ?
        { [K in keyof T]: [K] | Traverse<[K],T[K]> }
        : never

type Traverse<P extends any[],T> =
    T extends object ?
        keyof T extends never ? P :
            { [K in keyof T]: P | Traverse<Append<K,P>,T[K]> }
        : P


type Flatten10<T> = T extends any[] ? T : T extends object ? Flatten9<T[keyof T]> : T;
type Flatten9<T> = T extends any[] ? T : T extends object ? Flatten8<T[keyof T]> : T;
type Flatten8<T> = T extends any[] ? T : T extends object ? Flatten7<T[keyof T]> : T;
type Flatten7<T> = T extends any[] ? T : T extends object ? Flatten6<T[keyof T]> : T;
type Flatten6<T> = T extends any[] ? T : T extends object ? Flatten5<T[keyof T]> : T;
type Flatten5<T> = T extends any[] ? T : T extends object ? Flatten4<T[keyof T]> : T;
type Flatten4<T> = T extends any[] ? T : T extends object ? Flatten3<T[keyof T]> : T;
type Flatten3<T> = T extends any[] ? T : T extends object ? Flatten2<T[keyof T]> : T;
type Flatten2<T> = T extends any[] ? T : T extends object ? Flatten1<T[keyof T]> : T;
type Flatten1<T> = T extends any[] ? T : T extends object ? Flatten0<T[keyof T]> : T;
type Flatten0<T> = T;
/*
export type PathIn<T> = Flatten10<TraverseTop<T>>

export const pathIn = <T>(ar: PathIn<T>) => {
    return ar
}*/
