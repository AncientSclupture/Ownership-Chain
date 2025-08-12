import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import React from 'react';
import { useIsMobile } from '../../hook/useMobile';

export function AccessInfoMaps() {
    const isMobile = useIsMobile();

    React.useEffect(() => {
        const map = new maplibregl.Map({
            container: "access-info-map",
            style: 'https://api.maptiler.com/maps/streets/style.json?key=rJesvYzd1J4oIcT9N4sA',
            center: [106.8456, -6.2088],
            zoom: 11,
            interactive: false
        });

        return () => map.remove();
    }, []);

    return (
        <div
            id="access-info-map"
            style={{
                width: "100%",
                height: `${isMobile ? '500px' : '400px'}`,
                borderRadius: "8px",
                overflow: "hidden"
            }}
        />
    );
}