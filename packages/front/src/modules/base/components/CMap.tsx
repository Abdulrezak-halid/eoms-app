import { Icon } from "leaflet";
import iconMarkerUrl from "leaflet/dist/images/marker-icon.png";
import iconMarkerShadowUrl from "leaflet/dist/images/marker-shadow.png";
import "leaflet/dist/leaflet.css";
import { useEffect, useMemo } from "react";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";

import { CCard } from "@m/core/components/CCard";

import { IMapLocation } from "../interfaces/IMapLocation";
import "./CMap.css";

interface IProps {
  value?: IMapLocation;
  onChange?: (pos: IMapLocation) => void;
}

export function CMap({ value, onChange }: IProps) {
  const centerPosition: [number, number] = useMemo(
    () =>
      value
        ? [value.lat, value.long]
        : // Turkey lat long
          [39.01065, 35.15625],
    [value],
  );

  return (
    <CCard className="overflow-hidden relative z-0">
      <MapContainer
        center={centerPosition}
        zoom={5}
        className="h-96"
        // Dark mode
        // style={{
        //   filter: "invert(1) hue-rotate(180deg)",
        // }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='Map data from <a target="_blank" href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        <CMapController value={value} onChange={onChange} />
      </MapContainer>
    </CCard>
  );
}

function CMapController({
  value,
  onChange,
}: {
  value?: IMapLocation;
  onChange?: (pos: IMapLocation) => void;
}) {
  const map = useMap();

  useEffect(() => {
    if (value) {
      map.setView([value.lat, value.long], map.getZoom());
    }
  }, [value, map]);

  useMapEvents({
    click(e) {
      onChange?.({ lat: e.latlng.lat, long: e.latlng.lng });
    },
  });

  const position = useMemo<[number, number] | undefined>(
    () => value && [value.lat, value.long],
    [value],
  );

  const markerIcon = useMemo(
    () =>
      new Icon({
        iconUrl: iconMarkerUrl,
        shadowUrl: iconMarkerShadowUrl,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
      }),
    [],
  );

  return position ? <Marker position={position} icon={markerIcon} /> : null;
}
