import Map, { Marker } from "react-map-gl";
import { useGeolocated } from "react-geolocated";
import { toast } from "react-toastify";
import getDistance from "geolib/es/getDistance";
import { useRouter } from "next/router";
import clsx from "clsx";
import Image from "next/image";
import { useRef, useState } from "react";
import { EditModal } from "../components/EditModal";
import { Games, useGames } from "../lib/games";

const pk = `pk.eyJ1IjoiZmFyYW5kb3VyaXNwIiwiYSI6ImNsOTZ3dzhpczBzNHg0MHFxZ211dGN3OGcifQ.wG1mCl8Bl26T-w2zFwYK8g`;

export default function Page() {
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
  const { lng, lat, activeRow } = router.query;
  const ref = useRef<HTMLInputElement>(null);
  const closeModal = () => {
    if (!ref.current) return;
    ref.current.checked = false;
  };

  const { data: games, isLoading } = useGames();

  return (
    <>
      <input
        ref={ref}
        type="checkbox"
        checked={ref.current?.checked}
        className="modal-toggle"
      />

      <EditModal
        onCancel={closeModal}
        onSave={(game: Games) => {
          // setLocations([...locations, game]);
          // closeModal();
        }}
      />
      <div className="w-screen relative h-screen overflow-hidden grid grid-cols-[1fr_1fr]">
        <div className="border p-4 max-h-screen overflow-auto">
          <div className="overflow-y-auto">
            <div className="flex justify-end items-end my-4">
              <button
                onClick={() => {
                  if (!ref.current) return;
                  ref.current.checked = true;
                }}
                className="btn bg-violet-500 hover:bg-violet-500 "
              >
                New location
              </button>
            </div>

            <table className="table w-full">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type of game</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {games.map((location, key) => (
                  <tr
                    role={"button"}
                    key={key}
                    onClick={() => {
                      router.replace(
                        `?activeRow=${key}&name=${location.name}&lat=${location.latitude}&lng=${location.longitude}`
                      );
                    }}
                    className={clsx({
                      active: Number(activeRow) === key,
                    })}
                  >
                    <td className="flex gap-x-2 items-end">
                      <Image
                        width={32}
                        height={32}
                        loader={({ src }) => src}
                        src="/images/female.png"
                        alt="preview"
                      />

                      <div className="font-bold">{location.name}</div>
                    </td>
                    <td>
                      <div className="font-bold">{location.type}</div>
                    </td>

                    <td>
                      <div className="flex gap-x-4">
                        <button
                          onClick={() => {
                            if (!ref.current) return;
                            ref.current.checked = true;
                          }}
                        >
                          ✏️
                        </button>
                        <button onClick={() => {}}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <Map
          onClick={(evt) => {
            router.replace({
              pathname: "/admin",
              query: {
                ...evt.lngLat,
              },
            });
          }}
          viewState={{
            height: 100,
            width: 100,
            bearing: 0,
            pitch: 0,
            padding: {
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
            },
            latitude: Number(lat ?? 37.9956955),
            longitude: Number(lng ?? 23.6746348),
            zoom: 14,
          }}
          initialViewState={{
            latitude: 37.9956955,
            longitude: 23.6746348,
            zoom: 16,
          }}
          mapboxAccessToken={pk}
          mapStyle="mapbox://styles/mapbox/streets-v9"
        >
          {games.map((obj, idx) => (
            <Marker
              key={idx}
              latitude={obj.latitude}
              longitude={obj.longitude}
              anchor="top"
            >
              {/* <img
            className="h-20 border-2  bg-black  border-yellow-400  shadow-xl w-20 rounded-full"
            src="/images/male.png"
            alt=""
          /> */}
            </Marker>
          ))}
        </Map>
      </div>
    </>
  );
}
