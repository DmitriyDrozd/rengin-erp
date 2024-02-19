declare const tag: unique symbol;
export type Tagged<Tag extends PropertyKey, BaseType = string,  Metadata = void> =
    BaseType & { readonly [tag]: { [K in Tag]: Metadata } };

type MultiTagContainer<Token extends PropertyKey> = {
    readonly [tag]: {[K in Token]: void};
};


export type UnwrapTagged<TaggedType extends MultiTagContainer<PropertyKey>> =
    RemoveAllTags<TaggedType>;

type RemoveAllTags<T> = T extends MultiTagContainer<infer ExistingTags>
    ? {
        [ThisTag in ExistingTags]:
        T extends Tagged<ThisTag,infer Type>
            ? RemoveAllTags<Type>
            : never
    }[ExistingTags]
    : T;