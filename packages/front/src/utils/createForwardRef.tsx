import React from 'react'

type PolymorphicRef<C extends React.ElementType> =
    React.ComponentPropsWithRef<C>["ref"];

type AsProp<C extends React.ElementType> = {
    as?: C;
};

type PropsToOmit<C extends React.ElementType, P> = keyof (AsProp<C> & P);

type PolymorphicComponentProp<C extends React.ElementType,
    Props = {}> = React.PropsWithChildren<Props & AsProp<C>> &
    Omit<React.ComponentPropsWithoutRef<C>, PropsToOmit<C, Props>>;

type PolymorphicComponentPropWithRef<C extends React.ElementType,
    Props = {}> = PolymorphicComponentProp<C, Props> & { ref?: PolymorphicRef<C> };
export const createForwardRef = <Props, ElementType>(
    ReactComponent: React.ComponentType<Props>,
    displayName?: string
) => {
    const forwardRef = (
        props: Props,
        ref: React.ForwardedRef<ElementType>
    ) => {
        return <ReactComponent {...props} forwardedRef={ref}/>;
    };
    forwardRef.displayName = (displayName || ReactComponent.displayName) + 'ForwarderRef';

    return React.forwardRef(forwardRef);
};

export default createForwardRef
