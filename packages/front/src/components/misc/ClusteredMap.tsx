import { ErrorBoundary } from '@ant-design/pro-components';
import {
    FC,
    useEffect,
    useRef,
    useState
} from 'react';
import {
    Map,
    useMap,
    AdvancedMarker,
} from '@vis.gl/react-google-maps';
import {MarkerClusterer} from '@googlemaps/markerclusterer';
import type {Marker} from '@googlemaps/markerclusterer';
import { ISSUES_LIST_MAP_ID } from '../../env';

type Point = google.maps.LatLngLiteral & {key: string};
type Props = {points: Point[]};

const Markers = ({points}: Props) => {
    const map = useMap();
    const [markers, setMarkers] = useState<{[key: string]: Marker}>({});
    const clusterer = useRef<MarkerClusterer | null>(null);

    // Initialize MarkerClusterer
    useEffect(() => {
        if (!map) return;
        if (!clusterer.current) {
            clusterer.current = new MarkerClusterer({map});
        }
    }, [map]);

    // Update markers
    useEffect(() => {
        clusterer.current?.clearMarkers();
        clusterer.current?.addMarkers(Object.values(markers));
    }, [markers]);

    const setMarkerRef = (marker: Marker | null, key: string) => {
        if (marker && markers[key]) return;
        if (!marker && !markers[key]) return;

        setMarkers(prev => {
            if (marker) {
                return {...prev, [key]: marker};
            } else {
                const newMarkers = {...prev};
                delete newMarkers[key];
                return newMarkers;
            }
        });
    };

    return (
        <ErrorBoundary>
            {points.map(point => (
                <AdvancedMarker
                    clickable
                    position={point}
                    key={point.key}
                    ref={marker => setMarkerRef(marker, point.key)}
                >
                </AdvancedMarker>
            ))}
        </ErrorBoundary>
    );
};


interface IClusteredMapProps {
    points: Point[];
}

export const ClusteredMap: FC<IClusteredMapProps> = ({ points }) => {
    return (
        <Map
            style={{width: '100vw', height: '70vh'}}
            defaultCenter={{lat: 57.94783560310071, lng: 75.93371350345065}}
            defaultZoom={4}
            gestureHandling={'greedy'}
            disableDefaultUI={false}
            mapId={ISSUES_LIST_MAP_ID}
        >
            <Markers points={points} />
        </Map>
    )
}