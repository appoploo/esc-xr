import clsx from "clsx";
import Image from "next/image";
import { useRouter } from "next/router";
import { useRef } from "react";
import { useGeolocated } from "react-geolocated";
import Map, { Marker } from "react-map-gl";
import { toast } from "react-toastify";
import { EditModal } from "../components/EditModal";
import useMutation from "../Hooks/useMutation";
import { deleteGame, useGames } from "../lib/games/queries";
import { Game } from "../lib/games/types";

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
  const [removeGame, { loading }] = useMutation(deleteGame, ["/api/games"], {
    onSuccess: () => {
      toast.success("deleted game");
    },
  });

  return (
    <>
      <input
        ref={ref}
        type="checkbox"
        checked={ref.current?.checked}
        className="modal-toggle"
      />

      <EditModal onClose={closeModal} />
      <div className="relative grid h-screen w-screen grid-cols-[1fr_1fr] overflow-hidden">
        <div className="max-h-screen overflow-auto p-4">
          <div className="overflow-y-auto">
            <div className="my-4 flex items-end justify-end">
              <button
                onClick={() => {
                  if (!ref.current) return;
                  router.replace("/admin");
                  ref.current.checked = true;
                }}
                className="btn "
              >
                New Game
              </button>
            </div>

            <table className="table-zebra table w-full">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type of game</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {games.map((game: Game, key) => (
                  <tr
                    role={"button"}
                    key={key}
                    onClick={() => {
                      router.replace(
                        `?activeRow=${game._id}&name=${game.name}&lat=${game.latitude}&lng=${game.longitude}`
                      );
                    }}
                    className={clsx({
                      active: game._id === router.query.activeRow,
                    })}
                  >
                    <td className="flex items-end gap-x-2">
                      <Image
                        width={32}
                        height={32}
                        loader={({ src }) => src}
                        src="/images/female.png"
                        alt="preview"
                      />

                      <div className="font-bold">{game.name}</div>
                    </td>
                    <td>
                      <div className="font-bold">{game.type}</div>
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
                        <button
                          onClick={() => {
                            removeGame(`${game._id}`);
                          }}
                        >
                          🗑️
                        </button>
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
            ></Marker>
          ))}
        </Map>
      </div>
    </>
  );
}
