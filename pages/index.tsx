import Map, { Marker } from "react-map-gl";
import { useGeolocated } from "react-geolocated";
import { ARButton } from "@react-three/xr";

const pk = `pk.eyJ1IjoiZmFyYW5kb3VyaXNwIiwiYSI6ImNsOTZ3dzhpczBzNHg0MHFxZ211dGN3OGcifQ.wG1mCl8Bl26T-w2zFwYK8g`;

export default function Page() {
  const { coords, isGeolocationAvailable, isGeolocationEnabled } =
    useGeolocated({
      positionOptions: {
        enableHighAccuracy: false,
      },
      watchPosition: true,
      userDecisionTimeout: 5000,
    });
  return coords ? (
    <div className="w-screen h-screen overflow-hidden">
      <ARButton />
      <Map
        initialViewState={{
          latitude: coords.latitude,
          longitude: coords.longitude,

          zoom: 10,
        }}
        mapboxAccessToken={pk}
        mapStyle="mapbox://styles/mapbox/streets-v9"
      >
        <Marker
          key={`position`}
          longitude={coords.longitude}
          latitude={coords.latitude}
          anchor="bottom"
        />
      </Map>
    </div>
  ) : null;
}
