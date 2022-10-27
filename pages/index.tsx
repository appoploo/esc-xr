import Map, { Marker } from "react-map-gl";
import { useGeolocated } from "react-geolocated";
import { ARButton } from "@react-three/xr";
import { toast } from "react-toastify";
import getDistance from "geolib/es/getDistance";
import Link from "next/link";

const pk = `pk.eyJ1IjoiZmFyYW5kb3VyaXNwIiwiYSI6ImNsOTZ3dzhpczBzNHg0MHFxZ211dGN3OGcifQ.wG1mCl8Bl26T-w2zFwYK8g`;

export default function Page() {
  const { coords } = useGeolocated({
    positionOptions: {
      enableHighAccuracy: false,
    },

    // onSuccess: (coords) =>
    //   toast.success(
    //     `${coords.coords.latitude},    ${coords.coords.longitude}`,
    //     {
    //       position: "bottom-center",
    //     }
    //   ),

    onError: (error) =>
      toast.error("please activate GPS  in order to continue", {
        position: "bottom-center",
      }),
    watchPosition: true,
    userDecisionTimeout: 5000,
  });
  const { latitude, longitude } = coords ?? {
    latitude: 0,
    longitude: 0,
  };
  const distance = getDistance(
    { latitude, longitude },
    {
      latitude: 37.9956955,
      longitude: 23.6746348,
    }
  );

  return coords ? (
    <div className="w-screen relative h-screen overflow-hidden">
      <Map
        attributionControl={false}
        initialViewState={{
          latitude: coords.latitude,
          longitude: coords.longitude,
          zoom: 16,
        }}
        mapboxAccessToken={pk}
        mapStyle="mapbox://styles/mapbox/streets-v9"
      >
        <Marker
          anchor="top"
          longitude={coords.longitude}
          latitude={coords.latitude}
        >
          {/* <img
            className="h-20 border-2  bg-black  border-yellow-400  shadow-xl w-20 rounded-full"
            src="/images/male.png"
            alt=""
          /> */}
        </Marker>
      </Map>
      <div className="absolute px-8 py-2 h-16 items-center md:bottom-0 bottom-14   w-screen flex justify-end">
        <Link href={"/detect"}>
          <div className=" p-2 w-full flex items-center justify-center rounded bg-black bg-opacity-70  container mx-auto h-full ">
            {distance} meters away
            {/* <img
            className="h-full"
            src="https://s2.svgbox.net/hero-outline.svg?ic=camera&color=aaa"
          /> */}
          </div>
        </Link>
      </div>
    </div>
  ) : null;
}
