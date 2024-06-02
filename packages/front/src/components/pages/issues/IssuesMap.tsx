import { IssueVO } from 'iso/src/store/bootstrap/repos/issues';
import {
    FC,
    useEffect,
    useState
} from 'react';
import useLedger from '../../../hooks/useLedger';
import { ClusteredMap } from '../../misc/ClusteredMap';

interface IIssuesMapProps {
    issues: IssueVO[],
}

const getPointData = sites => issue => {
    const geo = sites.find(s => s.siteId === issue.siteId)?.geoPosition;
    if (!geo) {
        return null;
    }

    const [lat, lng] = geo.split(',');
    return {
        name: String(issue.clientsIssueNumber),
        lat: +lat,
        lng: +lng,
        key: issue.issueId
    };
}

export const IssuesMap: FC<IIssuesMapProps> = ({ issues }) => {
    const ledger = useLedger();
    const sites = ledger.sites.list;
    const [points, setPoints] = useState([]);

    useEffect(() => {
        const points = issues
            .map(getPointData(sites))
            .filter(p => p !== null);

        setPoints(points);
    }, [issues]);

    return (
        <ClusteredMap points={points} />
    )
}