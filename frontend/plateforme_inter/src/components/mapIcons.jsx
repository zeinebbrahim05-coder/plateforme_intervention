import L from 'leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import React from 'react';

export const technicienIcon=new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
    iconSize:[25,41], iconAnchor:[12,41], popupAnchor:[1,-34],
});
export const clientIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});
export const MapCluster = ({ children }) => {
    return (
        <MarkerClusterGroup
            chunkedLoading
            maxClusterRadius={50}
            spiderfyOnMaxZoom={true}
            zoomToBoundsOnClick={true}
            iconCreateFunction={(cluster) => {
                const count = cluster.getChildCount();
                const size = count < 10 ? 40 : count < 100 ? 55 : 70;
                return L.divIcon({
                    html: `<div style="
                        background: #007bff;
                        color: white;
                        border-radius: 50%;
                        width: ${size}px;
                        height: ${size}px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-weight: bold;
                        font-size: ${count < 10 ? 16 : count < 100 ? 18 : 22}px;
                        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                        border: 3px solid white;
                    ">
                        ${count}
                    </div>`,
                    className: 'custom-cluster-icon',
                    iconSize: [size, size],
                });
            }}
        >
            {children}
        </MarkerClusterGroup>
    );
};