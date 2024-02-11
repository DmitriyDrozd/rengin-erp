import RenField from "./RenField";
import {AnyAttr} from "@shammasov/mydux";


export default ({list}:{list: AnyAttr[]}) => {

    return <>{list.map( f =>
        <RenField meta={f}/>
    )}</>
}