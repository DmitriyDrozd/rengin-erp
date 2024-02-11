
import {selectDigest, ENTITIES_MAP, DigestMaps, Digest} from "iso";
import {useSelector} from "react-redux";

export const useDigest = () => {
    const digest: DigestMaps =  useSelector(selectDigest)
    return digest
}
export default useDigest