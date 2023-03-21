import clsx from "clsx";
import getDistance from "geolib/es/getDistance";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useGeolocated } from "react-geolocated";
import Map, { Marker } from "react-map-gl";
import { toast } from "react-toastify";
import { Menu } from "../components/menu";
import { useQuests } from "../lib/quests/queries";
import { User } from "../lib/users/types";
import { formatDistance } from "../lib/utils";
import { accessLevel, withSessionSsr } from "../lib/withSession";

const pk = `pk.eyJ1IjoiZmFyYW5kb3VyaXNwIiwiYSI6ImNsOTZ3dzhpczBzNHg0MHFxZ211dGN3OGcifQ.wG1mCl8Bl26T-w2zFwYK8g`;

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

  return (
    <div className="relative h-screen w-screen ">
      <Map
        viewState={{
          pitch: 0,
          bearing: 0,
          padding: {
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
          },
          width: 100,
          height: 100,
          zoom: 16,
          latitude: activeQuest?.lat ?? 0,
          longitude: activeQuest?.lng ?? 0,
        }}
        mapboxAccessToken={pk}
        mapStyle="mapbox://styles/mapbox/streets-v9"
      >
        <Marker
          anchor="top"
          longitude={activeQuest?.lat ?? 0}
          latitude={activeQuest?.lng ?? 0}
        ></Marker>
      </Map>
      <div className="fixed top-0 left-0  z-50 h-screen   w-screen ">
        <div className="absolute top-2 flex  w-screen flex-col items-center md:items-start  ">
          <div
            style={{ transform: "skewX(-20deg)" }}
            className="stroke relative m-4 w-11/12 bg-black bg-opacity-30 p-4 pb-0  text-4xl font-bold text-white drop-shadow-2xl md:w-96 "
          >
            <h1
              style={{
                textShadow: "-1px -1px 2px #000, 1px 1px 1px #000",
              }}
              className="text-md z-50 mb-2 text-center  font-bold text-white md:text-4xl"
            >
              {activeQuest?.name} &nbsp;
              <br />
              {formatDistance(distance)} away
            </h1>

            <div className="mt-2 w-full border-b border-dashed border-black"></div>
            <Link
              href={`/${activeQuest?.type ?? "detect"}?quest=${
                activeQuest?.id
              }`}
              className={clsx(
                "btn-square btn  left-0 bottom-0 w-full rounded-none",
                {
                  "animate-bounce ":
                    distance < Number(activeQuest?.radius ?? 25),
                  hidden: distance > Number(activeQuest?.radius ?? 25),
                }
              )}
            >
              {activeQuest?.type}
            </Link>
          </div>
        </div>
        <Menu userName={props.userName} />
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = withSessionSsr(
  async function getServerSideProps(ctx) {
    return accessLevel("user", ctx);
  }
);
