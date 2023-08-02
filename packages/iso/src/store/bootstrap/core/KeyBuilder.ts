import {Lens, lensPath, tail} from 'ramda'

type StateWithBiz = { biz: any }
type KeyKind = 'inc' | 'guid' | 'date' | 'path' | 'externalKey'

type Key = {
    path: string
    param?: string
    type: KeyKind
    isTerminal: boolean
    columnName: string
}

const makeKey = (path: string, type: KeyKind, isTerminal: boolean = true, columnName: string = 'id') => ({
    path,
    param: path,
    type,
    isTerminal,
    columnName,
})

type EmptySpec = {}

export type KeyOrSpec<Spec> = string | Spec

type WithKey<Path extends string> = { [P in Path]: string }

export class KeyBuilder<V, Spec = EmptySpec, OwnKey = EmptySpec> {

    // path to parent of the collection
    readonly parentPath: string[]
    // terminal id field
    readonly ownKey: OwnKey
    increment = <Path extends string>(path: Path) =>
        new KeyBuilder<V, Spec & { [P in Path]: string }, { [P in Path]: string }>
        ([...this.keys, makeKey(path, 'inc')], path)
    guid = <Path extends string>(path: Path) =>
        new KeyBuilder<V, Spec & WithKey<Path>, WithKey<Path>>([...this.keys, makeKey(path, 'guid')], path)
    date = <Path extends string>(path: Path) =>
        new KeyBuilder<V, Spec & WithKey<Path>, WithKey<Path>>([...this.keys, makeKey(path, 'date')], path)
    path = <Path extends string>(path: Path) =>
        new KeyBuilder<V, Spec, OwnKey>([...this.keys, makeKey(path, 'path', false)])
    externalkey = <Path extends string>(path: Path, columnName?: string) =>
        new KeyBuilder<V, Spec & WithKey<Path>, OwnKey>([...this.keys, makeKey(path, 'externalKey', false, columnName || path)])
    spec = {} as any as Spec
    terminalKey: Key
    buildKey = (spec: KeyOrSpec<Spec>): string =>
        typeof spec === 'string'
            ? spec
            : this.keys.map(k => spec[k.path]).join('/')
    parseSpec = (key: KeyOrSpec<Spec>): Spec =>
        typeof key === 'string'
            ? key.split('/').reduce(
                (spec, value, index: number) =>
                    Object.assign(spec, {[this.keys[index].path]: value}),
                {} as any as Spec
            )
            : key
    getPath = <S extends Spec>(keyOrSpec: S | string) => {
        const key: string = typeof keyOrSpec === 'string'
            ? keyOrSpec
            : this.buildKey(keyOrSpec)

        const parts = key.split('/')

        const result = []

        for (let i = 0; i < parts.length; i++)
            result.push(this.keys[i].path, parts[i])
        return ['biz']
            .concat(result)
    }
    getLens = <S extends Spec>(keyOrSpec: S | string) =>
        lensPath(this.getPath(keyOrSpec)) as Lens<StateWithBiz, V>

    constructor(readonly keys: Key[] = [], ownKey?: keyof OwnKey) {
        this.parentPath = ['biz'].concat(keys.map(k => k.path))
        this.terminalKey = tail(keys)[0]
    }

}

const builder = new KeyBuilder<number>().increment('rigId').date('date')

