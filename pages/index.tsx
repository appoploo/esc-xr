import Map, { Marker } from "react-map-gl";
import { useGeolocated } from "react-geolocated";
import { toast } from "react-toastify";
import getDistance from "geolib/es/getDistance";
import Link from "next/link";
import { useGames } from "../lib/games/queries";
import { formatDistance } from "../lib/utils";
import { useT } from "../Hooks/useT";
import clsx from "clsx";
import { useRouter } from "next/router";
import { QuestCard } from "../components/QuestCard";

const pk = `pk.eyJ1IjoiZmFyYW5kb3VyaXNwIiwiYSI6ImNsOTZ3dzhpczBzNHg0MHFxZ211dGN3OGcifQ.wG1mCl8Bl26T-w2zFwYK8g`;

export default function Page() {
  const { data: games } = useGames();
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
  const activeQuest = games?.find((g) => g._id === router.query.quest);
  const distance = getDistance(
    { latitude, longitude },
    {
      latitude: activeQuest?.latitude ?? 0,
      longitude: activeQuest?.longitude ?? 0,
    },
    0.1
  );
  console.log(activeQuest?.radius, distance);

  return (
    <div className="w-screen relative h-screen ">
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
          latitude: activeQuest?.latitude ?? 0,
          longitude: activeQuest?.longitude ?? 0,
        }}
        mapboxAccessToken={pk}
        mapStyle="mapbox://styles/mapbox/streets-v9"
      >
        <Marker
          anchor="top"
          longitude={activeQuest?.longitude ?? 0}
          latitude={activeQuest?.latitude ?? 0}
        ></Marker>
      </Map>
      <div className="fixed top-0 left-0  md:px-8 py-2   w-screen h-screen   z-50 ">
        <div className="absolute top-2 w-screen  flex flex-col md:items-start items-center  ">
          <div
            style={{ transform: "skewX(-20deg)" }}
            className="stroke bg-black pb-0 w-11/12 p-4 bg-opacity-30 text-white relative  drop-shadow-2xl text-4xl font-bold m-4 md:w-96 "
          >
            <h1
              style={{
                textShadow: "-1px -1px 2px #000, 1px 1px 1px #000",
              }}
              className="z-50 text-white mb-2 font-bold  text-md md:text-4xl text-center"
            >
              {activeQuest?.name} &nbsp;
              <br />
              {formatDistance(distance)} away
            </h1>

            <div className="border-b mt-2 border-black w-full border-dashed"></div>
            <Link
              href={`/${activeQuest?.type ?? "detect"}?quest=${
                activeQuest?._id
              }`}
              className={clsx(
                "btn rounded-none  btn-square left-0 bottom-0 w-full",
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
        <div className="absolute bottom-2 left-4  flex gap-x-4  w-screen pr-10 overflow-auto ">
          {games.map((obj) => (
            <Link key={obj._id} href={`?quest=${obj._id}`}>
              <QuestCard distance={distance} {...obj} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
