import RenField from "./RenField";
import {AnyMeta} from "iso/src/store/bootstrap/core/valueTypes";

export default ({list}:{list: AnyMeta[]}) => {

    return <>{list.map( f =>
        <RenField meta={f}/>
    )}</>
}