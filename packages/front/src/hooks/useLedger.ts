import {useSelector} from 'react-redux'
import {selectLedger} from 'iso/src/store/bootstrapDuck'

export default () => {
    const ledger = useSelector(selectLedger)

    return ledger
}