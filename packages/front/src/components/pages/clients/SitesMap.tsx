import {
    FC,
    useEffect,
    useState
} from 'react';
import { ClusteredMap } from '../../misc/ClusteredMap';
import { SiteVO } from 'iso/src/store/bootstrap/repos/sites';
import { useSelector } from 'react-redux/es/hooks/useSelector';
import BRANDS, { BrandVO } from 'iso/src/store/bootstrap/repos/brands';

interface ISitesMapProps {
    sites: SiteVO[],
}

const getPointData = (brands: BrandVO[]) => (site: SiteVO) => {
    const brand = brands.find(b => b.brandId === site.brandId);

    const geo = site?.geoPosition;
    if (!geo) {
        return null;
    }

    const [lat, lng] = geo.split(',');
    return {
        name: String(site.clientsSiteNumber),
        brandName: brand? brand.brandName : '',
        address: site ? `${site.city}, ${site.address}` : '',
        lat: +lat,
        lng: +lng,
        key: site.siteId,
    };
}

export const SitesMap: FC<ISitesMapProps> = ({ sites }) => {
    const brands = useSelector(BRANDS.selectAll);
    const [points, setPoints] = useState([]);

    useEffect(() => {
        const points = sites
            .map(getPointData(brands))
            .filter(p => p !== null);

        setPoints(points);
    }, [sites]);

    return (
        <ClusteredMap points={points} sourceTitle='Объект'/>
    )
}