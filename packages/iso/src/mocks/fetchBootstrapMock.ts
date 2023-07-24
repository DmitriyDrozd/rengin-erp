import {Bootstrap} from "../store/bootstrapDuck";
import stonesJson from '../../../scene/test/models/stones.json'

export default (): Partial<Bootstrap> => {
    return {
        stones: stonesJson
    }
}
