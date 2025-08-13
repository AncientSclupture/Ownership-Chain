import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import React from 'react';
import { useIsMobile } from '../../hook/useMobile';

export function AccessInfoMaps({ lat, long }: { lat: number; long: number }) {
    const isMobile = useIsMobile();

    React.useEffect(() => {
        const map = new maplibregl.Map({
            container: "access-info-map",
            style: 'https://api.maptiler.com/maps/streets/style.json?key=rJesvYzd1J4oIcT9N4sA',
            center: [long, lat],
            zoom: 11,
            interactive: false
        });

        new maplibregl.Marker()
            .setLngLat([long, lat])
            .addTo(map);

        return () => map.remove();
    }, [lat, long]);

    return (
        <div
            id="access-info-map"
            style={{
                width: "100%",
                height: isMobile ? "500px" : "400px",
                borderRadius: "8px",
                overflow: "hidden"
            }}
        />
    );
}
