import {
    FC,
    useEffect,
    useRef,
    useState,
} from 'react';
import {
    Map,
    useMap,
} from '@vis.gl/react-google-maps';
import {MarkerClusterer} from '@googlemaps/markerclusterer';
import { ISSUES_LIST_MAP_ID } from '../../env';

type Point = google.maps.LatLngLiteral & {key: string};

const updateMarkers = async (map, points, clusterer) => {
    const {InfoWindow} = await google.maps.importLibrary("maps");
    const {AdvancedMarkerElement} = await google.maps.importLibrary("marker");

    const infoWindow = new InfoWindow({
        content: "",
        disableAutoPan: true,
    });

    const markers = points.map((point) => {
        const marker = new AdvancedMarkerElement({
            position: { lat: point.lat, lng: point.lng },
        });

        // markers can only be keyboard focusable when they have click listeners
        // open info window when marker is clicked
        marker.addListener("click", () => {
            infoWindow.setContent('Заявка №' + point.name);
            infoWindow.open(map, marker);
        });
        return marker;
    });

    clusterer.current.clearMarkers()
    clusterer.current.addMarkers(markers);
}

interface IClusteredMapProps {
    points: Point[];
}

export const ClusteredMap: FC<IClusteredMapProps> = ({ points }) => {
    const map = useMap();
    const clusterer = useRef<MarkerClusterer | null>(null);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        if (!clusterer.current || !isReady) {
            return;
        }

        updateMarkers(map, points, clusterer);
    }, [points, isReady]);

    useEffect(() => {
        if (!map) {
            return;
        }

        if (!clusterer.current) {
            clusterer.current = new MarkerClusterer({map});
            setIsReady(true);
        }
    }, [map]);

    return (
        <Map
            style={{width: '100vw', height: '70vh'}}
            defaultCenter={{lat: 57.94783560310071, lng: 75.93371350345065}}
            defaultZoom={4}
            gestureHandling={'greedy'}
            disableDefaultUI={false}
            mapId={ISSUES_LIST_MAP_ID}
        />
    )
}