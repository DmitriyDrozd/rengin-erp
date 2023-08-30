import InnerPageBase from './InnerPageBase'

export default (children: string | React.ReactNode): React.FunctionComponent =>
    ( () => {
    return  <InnerPageBase>
            {children}
    </InnerPageBase>

})