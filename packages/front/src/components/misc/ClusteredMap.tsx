import { Typography } from 'antd';
import React, {
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
import { createRoot } from 'react-dom/client';
import { ISSUES_LIST_MAP_ID } from '../../env';
import { CellRendererWithCopy } from '../elements/CellRendererWithCopy';

type Point = google.maps.LatLngLiteral & {key: string};

const updateMarkers = async (map, points, clusterer, sourceTitle) => {
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
            const rootEl = document.createElement('div');

            const content = (
                <div>
                    <div>
                        <Typography.Title level={5} style={{ margin: 0 }}>{point.brandName}</Typography.Title>
                    </div>
                    <div>
                        <span>{sourceTitle} № <CellRendererWithCopy value={point.name}/></span>
                    </div>
                    <div>
                        <Typography.Paragraph copyable>{point.address}</Typography.Paragraph>
                    </div>
                </div>
            );

            const root = createRoot(rootEl);
            root.render(content);

            infoWindow.setContent(rootEl);
            infoWindow.open(map, marker);
        });
        return marker;
    });

    clusterer.current.clearMarkers()
    clusterer.current.addMarkers(markers);
}

interface IClusteredMapProps {
    points: Point[];
    sourceTitle: string;
}

export const ClusteredMap: FC<IClusteredMapProps> = ({ points, sourceTitle }) => {
    const map = useMap();
    const clusterer = useRef<MarkerClusterer | null>(null);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        if (!clusterer.current || !isReady) {
            return;
        }

        updateMarkers(map, points, clusterer, sourceTitle);
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
            style={{width: '100%', height: '70vh'}}
            defaultCenter={{lat: 57.94783560310071, lng: 75.93371350345065}}
            defaultZoom={4}
            gestureHandling={'greedy'}
            disableDefaultUI={false}
            mapId={ISSUES_LIST_MAP_ID}
        />
    )
}