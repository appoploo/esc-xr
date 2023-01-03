import Map, { Marker } from "react-map-gl";
import { useGeolocated } from "react-geolocated";
import { ARButton } from "@react-three/xr";
import { toast } from "react-toastify";
import getDistance from "geolib/es/getDistance";
import Link from "next/link";
import { useRouter } from "next/router";
import clsx from "clsx";

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
  const minIGames = [0, 1, 2, 3, 4, 5, 6];
  const router = useRouter();
  const { lng, lat, activeRow } = router.query;
  return (
    <div className="w-screen relative h-screen overflow-hidden grid grid-cols-[1fr_1fr]">
      <div className="border p-4">
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Name</th>
                <th>MiniGame</th>
                <th>Assets</th>
              </tr>
            </thead>
            <tbody>
              {minIGames.map((_, key) => (
                <tr
                  role={"button"}
                  key={key}
                  onClick={() => {
                    router.replace(`?activeRow=${key}`);
                  }}
                  className={clsx({
                    active: Number(activeRow) === key,
                  })}
                >
                  <td>
                    <input type="text" className="input" />
                  </td>
                  <td>
                    <select className="select ">
                      <option disabled selected>
                        Type of miniGame
                      </option>
                      <option>Star Wars</option>
                      <option>Harry Potter</option>
                      <option>Lord of the Rings</option>
                      <option>Planet of the Apes</option>
                      <option>Star Trek</option>
                    </select>
                  </td>
                  <td>
                    <div className="flex gap-4 flex-wrap">
                      <div className="badge">neutral</div>
                      <div className="badge">neutral</div>
                      <div className="badge">neutral</div>
                      <div className="badge">neutral</div>
                      <div className="badge">neutral</div>
                      <div className="badge">neutral</div>
                      <div className="badge">neutral</div>
                      <div className="badge">neutral</div>
                      <div className="badge">neutral</div>
                      <div className="badge">neutral</div>
                      <div className="badge">neutral</div>
                      <div className="badge">neutral</div>
                      <div className="badge">neutral</div>
                      <div className="badge">neutral</div>
                      <div className="badge">neutral</div>
                      <div className="badge">neutral</div>
                      <div className="badge">neutral</div>
                      <div className="badge">neutral</div>
                      <div className="badge">neutral</div>
                      <div className="badge">neutral</div>
                      <div className="badge">neutral</div>
                      <div className="badge">neutral</div>
                      <div className="badge">neutral</div>
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
        attributionControl={false}
        initialViewState={{
          latitude: 37.9956955,
          longitude: 23.6746348,
          zoom: 16,
        }}
        mapboxAccessToken={pk}
        mapStyle="mapbox://styles/mapbox/streets-v9"
      >
        {lat && lng && (
          <Marker
            latitude={parseFloat(lat as string)}
            longitude={parseFloat(lng as string)}
            anchor="top"
          >
            {/* <img
            className="h-20 border-2  bg-black  border-yellow-400  shadow-xl w-20 rounded-full"
            src="/images/male.png"
            alt=""
          /> */}
          </Marker>
        )}
      </Map>
    </div>
  );
}
