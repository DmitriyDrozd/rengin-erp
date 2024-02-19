import {DigestMaps, selectDigest} from "iso";
import {useSelector} from "react-redux";

export const useDigest = () => {
    const digest: DigestMaps =  useSelector(selectDigest)
    return digest
}
export default useDigest