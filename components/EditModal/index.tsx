import { useEffect, useState } from "react";
import { clsx } from "clsx";
import { createGame, useGames, updateGame } from "../../lib/games/queries";
import useMutation from "../../Hooks/useMutation";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { classes } from "../../lib/classes";

const images = [
  {
    src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQt7XrlOYGCxY4_ESPW5stFkD_pHLunqVVYbQ&usqp=CAU",
  },
  {
    src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxXnC3fwMwkbIt3ejGRIw3NmbDyUtgS5g2jA&usqp=CAU",
  },
];
const y = [1, 2];
const [first, second] = y;

//

export function EditModal(props: { onClose: () => void }) {
  const [name, setName] = useState<string>("");
  const [latitude, setLatitude] = useState<number>(0);
  const [longitude, setLongitude] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<
    "detect" | "collect" | "none"
  >("none");
  const [textArea, setTextArea] = useState<string>("");
  const [radius, setRadius] = useState<number>(100);
  const [detected, setDetected] = useState<string | undefined>(undefined);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  const [newGame] = useMutation(createGame, ["/api/games"], {
    onSuccess: () => {
      toast.success("created game");
      props.onClose();
    },
  });
  const [editGame] = useMutation(updateGame, ["/api/games"], {
    onSuccess: () => {
      toast.success("changed game");
      props.onClose();
    },
  });

  const { data: games } = useGames();
  const router = useRouter();
  const activeRow = router.query.activeRow;
  const selectedGame = games.find((g) => g._id === activeRow);

  useEffect(() => {
    const selectedGame = games.find((g) => g._id === activeRow);
    if (selectedGame) {
      setName(selectedGame?.name ?? "");
      setLatitude(selectedGame?.latitude ?? 0);
      setLongitude(selectedGame?.longitude ?? 0);
      setTextArea(selectedGame?.description ?? "");
      setSelectedOption(selectedGame?.type ?? "none");
      setSelectedImages(selectedGame?.assets ?? []);
      setDetected(selectedGame?.detected);
      setRadius(selectedGame?.radius ?? 100);
    } else {
      setName("");
      setLatitude(0);
      setLongitude(0);
      setTextArea("");
      setSelectedOption("none");
      setSelectedImages([]);
      setDetected(undefined);
      setRadius(100);
    }
  }, [activeRow, games]);

  return (
    <>
      <div className="modal border ">
        <div className="modal-box relative">
          <label className="label">
            <span className="label-text">Name</span>
          </label>
          <input
            value={name}
            onChange={(evt) => setName(evt.currentTarget.value)}
            type="text"
            placeholder="Type here"
            className="input input-bordered w-full"
          />
          <label className="label">
            <span className="label-text">Latitude</span>
          </label>
          <input
            value={+latitude}
            onChange={(evt) => setLatitude(Number(evt.currentTarget.value))}
            type="text"
            placeholder="Type here"
            className="input input-bordered w-full"
          />
          <label className="label">
            <span className="label-text">Longitude</span>
          </label>
          <input
            value={+longitude}
            onChange={(evt) => setLongitude(Number(evt.currentTarget.value))}
            type="text"
            placeholder="Type here"
            className="input input-bordered w-full"
          />
          <br />
          <br />
          <label className="label-text" htmlFor="radius">
            Radius {radius} meters
          </label>
          <input
            min={0}
            max={1300}
            value={radius}
            type="range"
            name=""
            className="range"
            onChange={(evt) => {
              setRadius(Number(evt.currentTarget.value));
            }}
            id=""
          />
          <br /> <br />
          <select
            className="select select-bordered w-full "
            value={selectedOption}
            onChange={(evt) => {
              const type = evt.currentTarget.value as
                | "detect"
                | "collect"
                | "none";
              setSelectedOption(type);
              if (type === "collect") setDetected(undefined);
            }}
          >
            <option value="none" disabled selected>
              Type of game
            </option>
            <option value="detect">Detect</option>
            <option value="collect">Collect</option>
          </select>
          {selectedOption === "detect" && (
            <>
              <br />
              <br />
              <input
                onChange={(evt) => setDetected(evt.currentTarget.value)}
                value={detected ?? ""}
                list="data"
                className="input input-bordered w-full "
                type="text"
              />
              <datalist id="data">
                {classes.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </datalist>
            </>
          )}
          <label className="label">
            <span className="label-text">Description</span>
          </label>
          <textarea
            value={textArea}
            onChange={(evt) => setTextArea(evt.currentTarget.value)}
            className="textarea w-full border border-gray-500"
          ></textarea>
          <div className="divider"></div>
          <div className="modal-action">
            <button onClick={props.onClose} className="btn btn-sm">
              Cancel
            </button>
            <button
              onClick={() => {
                if (selectedGame) {
                  editGame({
                    _id: selectedGame._id,
                    name,
                    latitude,
                    longitude,
                    type: selectedOption,
                    description: textArea,
                    assets: selectedImages,
                    detected,
                    radius,
                  });
                } else {
                  newGame({
                    name,
                    latitude,
                    longitude,
                    type: selectedOption,
                    description: textArea,
                    assets: selectedImages,
                    detected,
                    radius,
                  });
                }
              }}
              className="btn btn-sm"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
