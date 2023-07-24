import {Breadcrumb, Layout} from 'antd'
import {Content} from 'antd/es/layout/layout'
import InnerPageBase from './InnerPageBase'

export default (children: string | React.ReactNode): React.FunctionComponent =>
    ( () => {
    return  <InnerPageBase>
            {children}
    </InnerPageBase>

})