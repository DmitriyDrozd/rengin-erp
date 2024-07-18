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

const getPointData = (sites, brands) => issue => {
    const brand = brands.find(b => b.brandId === issue.brandId);
    const site = sites.find(s => s.siteId === issue.siteId);

    const geo = site?.geoPosition;
    if (!geo) {
        return null;
    }

    const [lat, lng] = geo.split(',');
    return {
        name: String(issue.clientsIssueNumber),
        brandName: brand? brand.brandName : '',
        address: site ? `${site.city}, ${site.address}` : '',
        lat: +lat,
        lng: +lng,
        key: issue.issueId
    };
}

export const IssuesMap: FC<IIssuesMapProps> = ({ issues }) => {
    const ledger = useLedger();
    const sites = ledger.sites.list;
    const brands = ledger.brands.list;
    const [points, setPoints] = useState([]);

    useEffect(() => {
        const points = issues
            .map(getPointData(sites, brands))
            .filter(p => p !== null);

        setPoints(points);
    }, [issues]);

    return (
        <ClusteredMap points={points} sourceTitle='Заявка'/>
    )
}