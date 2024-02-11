import {
    ActionReducerMapBuilder,
    createAction,
    createEntityAdapter,
    createSlice,
    EntityState as EntityStateRaw,
    PayloadAction,
    Update
} from "@reduxjs/toolkit";
import {clone, compose, equals, map, mergeRight} from "ramda";
import {isArray, isFunction} from "@shammasov/utils";
import {AnyAttributes, ItemByAttrs} from "./AttrFactories_ex"
import {bootstrapAction} from "../../connection";


export type EntityState<Attrs extends AnyAttributes  = AnyAttributes> =
    EntityStateRaw<ItemByAttrs<Attrs>, string>
export  const preparePersistent = <A>() => (payload: A) =>
    ({payload, meta:{persistent: true}})

export const createAdvancedEntityAdapter = <Attrs extends AnyAttributes, N extends string,Item extends ItemByAttrs<Attrs> =  ItemByAttrs<Attrs> >(
    {name, attributes, extraEntityReducers}: {name: N, attributes: Attrs, extraEntityReducers: (builder: ActionReducerMapBuilder<EntityState<Attrs>>) => void}
) => {
    const defaults: Partial<Item> = {} as any
    Object.values(attributes).forEach(
        f => defaults[f.name as any as keyof typeof defaults] = f.default as any
    )

    const entityAdapter = createEntityAdapter<Item, string>({
        selectId: item =>
            item.id
        ,
        sortComparer: (a,b) => b.addedAtTS - a.addedAtTS,
    });

    const entitySelectors = entityAdapter.getSelectors((state: any) => state[name as any] as EntityState<Attrs>)

    const withDefaults = mergeRight(defaults)
    const initialState = entityAdapter.getInitialState();
   // const {selectId,sortComparer,getInitialState,getSelectors,...restAdapter} = entityAdapter

    const prepareAddedWithDefaults = <Item>(item: Item) => {
        const defaultObject:Partial<Item> = {}
        for (const [k, v] of Object.entries(defaults)) {
            if(isFunction(v)) {
                defaultObject[k]= v(item)
            } else {
                defaultObject[k] = clone(v)
            }
        }

        return {...defaultObject,...item}

    }
    const prepareManyAddedWithDefaults = <Item>(items: Item[] | Record<string, Item>): Item[] | Record<string, Item> =>
        (isArray(items)
            ? items.map( item => withDefaults(item as any))
            : map(withDefaults, items)) as any
    const prepareSimple = <A>() => (payload: A) =>
        ({payload})
    const patchedCreator = createAction(name+'/patched', preparePersistent<Update<Item, string>>())
    const acts = {
       // addOne2: createAction<Readonly<Item>>(name+'/addOne'),
        added: createAction(name+'/added',compose(preparePersistent<Item>(),prepareAddedWithDefaults)),
        manyAdded: createAction(
            name+'/manyAdded',
            compose(preparePersistent< Item[]>(),prepareManyAddedWithDefaults)),
        patched: Object.assign((patch: {id: string} & Partial<Item>, original: Partial<Item> = {}) => {
                const changes: Partial<Item> = {

                }

                let diffFlag = false
                for (const [key, value] of Object.entries(patch)) {
                    if (!equals(patch[key], original[key])) {
                        changes[key] = patch[key]
                        diffFlag = true
                    }
                }

                return diffFlag
                    // @ts-ignore
                    ? patchCreator({id, changes})
                    : undefined
            },
                patchedCreator

        ),
        updated: createAction(name+'/updated',
            preparePersistent<Update<Item, string>>()),
        allSet: createAction(name+'/allSet', prepareSimple<Item[] | Record<string, Item>>()),
        removed: createAction(name+'/removed', preparePersistent<string>()),
        removedMany: createAction(name+'/removedMany', preparePersistent<string[]>())
    }

    const entitySlice = createSlice({
        name,
        initialState,
        reducers: {
        },

        extraReducers: builder => {
                builder
                    .addCase(bootstrapAction, (state, action)=> {
                        const map = action.payload[name]
                        const result =  entityAdapter.setAll(state, map.entities)
                    })
                    .addCase(acts.added, (state, action: PayloadAction<Readonly<Item>>) => {
                       const result = entityAdapter.addOne(state, action.payload)
                    })
                    .addCase(acts.manyAdded,(state, action: PayloadAction<Readonly<Item[]>>) => {
                       const result = entityAdapter.addMany(state, action.payload)
                    })
                    .addCase(acts.allSet,(state, action: PayloadAction<Readonly<Item[] | Record<string, Item>>>) => {
                        const result =  entityAdapter.setAll(state, action.payload)
                    })
                    .addCase(acts.removed,(state, action: PayloadAction<string>) => {
                       const result = entityAdapter.removeOne(state, action.payload)
                    })
                    .addCase(acts.removedMany,(state, action: PayloadAction<string[]>) => {
                        const result = entityAdapter.removeMany(state, action.payload)
                    })
                    .addCase(acts.updated,(state, action: PayloadAction<Update<Item, string>>) => {
                        const result = entityAdapter.updateOne(state, action.payload)
                    })
                    .addCase(acts.patched,(state, action: PayloadAction<Update<Item, string>>) => {
                        const result = entityAdapter.updateOne(state, action.payload)
                    })
            if(extraEntityReducers)
                extraEntityReducers(builder)
        },

    });


    const {actions, ...restSlice} = entitySlice

    return {

        ...restSlice,

        entitySelectors,
        actions: acts,
    }
};
