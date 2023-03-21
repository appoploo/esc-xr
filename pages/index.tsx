import getDistance from "geolib/es/getDistance";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import { useGeolocated } from "react-geolocated";
import Map, { Layer, MapRef, Marker, Source } from "react-map-gl";
import { toast } from "react-toastify";
import { Menu } from "../components/menu";
import { useQuests } from "../lib/quests/queries";
import { User } from "../lib/users/types";
import { formatDistance } from "../lib/utils";
import { accessLevel, withSessionSsr } from "../lib/withSession";

const pk = `pk.eyJ1IjoiZmFyYW5kb3VyaXNwIiwiYSI6ImNsOTZ3dzhpczBzNHg0MHFxZ211dGN3OGcifQ.wG1mCl8Bl26T-w2zFwYK8g`;

export function Head1(props: { children: React.ReactNode }) {
  return (
    <h1
      style={{
        textShadow: "-1px -1px 2px #000, 1px 1px 1px #000",
      }}
      className="text-md z-50 mb-2 text-center  font-bold text-white md:text-4xl"
    >
      {props.children}
    </h1>
  );
}

export default function Page(props: User) {
  const { data: games } = useQuests();
  const { coords } = useGeolocated({
    positionOptions: {
      enableHighAccuracy: false,
    },
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
  const router = useRouter();
  const activeQuest = games?.find((g) => g.id === router.query.quest);
  const distance = getDistance(
    { latitude, longitude },
    {
      latitude: activeQuest?.lat ?? 0,
      longitude: activeQuest?.lng ?? 0,
    },
    0.1
  );

  const geojson = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [activeQuest?.lng ?? 0, activeQuest?.lat ?? 0],
        },
      },
    ],
  };

  const layerStyle = {
    id: "point",
    type: "circle",
    paint: {
      "circle-radius": 50,
      "circle-color": "#007cbf",
      "circle-opacity": 0.5,
    },
  };
  // ref for Map
  const mapRef = useRef<MapRef>(null);

  useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.getMap().flyTo({
      center: [activeQuest?.lng ?? 0, activeQuest?.lat ?? 0],
      zoom: 15,
      essential: true,
    });
  }, [activeQuest]);

  return (
    <div className="relative h-screen w-screen  ">
      <Map
        ref={mapRef}
        mapboxAccessToken={pk}
        mapStyle="mapbox://styles/mapbox/streets-v9"
      >
        {activeQuest && (
          <Source id="my-data" type="geojson" data={geojson as any}>
            {/* @ts-ignore */}
            <Layer {...layerStyle} />
          </Source>
        )}

        <Marker
          anchor="top"
          latitude={coords?.latitude ?? 0}
          longitude={coords?.longitude ?? 0}
        ></Marker>
      </Map>
      <div className="pointer-events-none fixed top-0  left-0 z-50 h-screen   w-screen ">
        <div className="absolute top-0 flex  w-screen  ">
          <div className="stroke  container relative  mx-auto   w-full border-dashed border-black bg-black bg-opacity-50 p-2  pb-0  text-4xl font-bold text-white drop-shadow-2xl md:w-96 ">
            {activeQuest ? (
              <>
                <Head1>{activeQuest?.name} &nbsp;</Head1>
                <Head1>{formatDistance(distance)} away</Head1>
              </>
            ) : (
              <Head1>Select quest from menu </Head1>
            )}
          </div>
        </div>
        <Menu userName={props.userName} />

        {/* <Link
          href={`/${activeQuest?.type ?? "detect"}?quest=${activeQuest?.id}`}
          className={clsx(
            "btn-square btn  left-0 bottom-0 w-full rounded-none",
            {
              "animate-bounce ": distance < Number(activeQuest?.radius ?? 25),
              hidden: distance > Number(activeQuest?.radius ?? 25),
            }
          )}
        >
          {activeQuest?.type}
        </Link> */}
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = withSessionSsr(
  async function getServerSideProps(ctx) {
    return accessLevel("user", ctx);
  }
);
