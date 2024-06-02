import { ErrorBoundary } from '@ant-design/pro-components';
import {
    FC,
    useEffect,
    useRef,
} from 'react';
import {
    Map,
    useMap,
    AdvancedMarker,
} from '@vis.gl/react-google-maps';
import {MarkerClusterer} from '@googlemaps/markerclusterer';
import { ISSUES_LIST_MAP_ID } from '../../env';

type Point = google.maps.LatLngLiteral & {key: string};
type Props = {points: Point[]};

const updateMarkers = (map, points, clusterer) => {
    if (!google?.maps?.marker?.AdvancedMarkerElement || !google?.maps?.marker?.PinElement) {
        return;
    }

    const infoWindow = new google.maps.InfoWindow({
        content: "",
        disableAutoPan: true,
    });

    const markers = points.map((point) => {
        const marker = new google.maps.marker.AdvancedMarkerElement({
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

    clusterer.current?.clearMarkers();
    clusterer.current?.addMarkers(Object.values(markers));

    return markers;
}

const Markers = ({points}: Props) => {
    const map = useMap();
    const clusterer = useRef<MarkerClusterer | null>(null);

    useEffect(() => {
        updateMarkers(map, points, clusterer);
    }, [points, clusterer.current]);

    useEffect(() => {
        if (!map) return;
        if (!clusterer.current) {
            clusterer.current = new MarkerClusterer({map});
        }
    }, [map]);

    return (
        <ErrorBoundary>
            {points.map(point => (
                <AdvancedMarker
                    clickable
                    position={point}
                    key={point.key}
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