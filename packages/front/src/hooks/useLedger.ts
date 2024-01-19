import {useSelector} from 'react-redux'
import {selectLedger} from 'iso/src/store/bootstrapDuck'
import useFrontSelector from "./common/useFrontSelector.js";

export default () => {
    return  useFrontSelector(selectLedger)

}