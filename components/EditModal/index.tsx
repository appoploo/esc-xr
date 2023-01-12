import { useState } from "react";
import { clsx } from "clsx";
import { createGame } from "../../lib/games/queries";
import useMutation from "../../Hooks/useMutation";
import { toast } from "react-toastify";

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

export function EditModal(props: { onClose: () => void }) {
  const [name, setName] = useState<string>("");
  const [latitude, setLatitude] = useState<number>(0);
  const [longitude, setLongitude] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<
    "detect" | "collect" | undefined
  >(undefined);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  const [newGame, { loading }] = useMutation(createGame, ["/api/games"], {
    onSuccess: () => {
      toast.success("created game");
      props.onClose();
    },
  });

  return (
    <>
      <div className="modal border ">
        <div className="modal-box relative">
          <label className="label">
            <span className="label-text">Name</span>
          </label>
          <input
            onChange={(evt) => setName(evt.currentTarget.value)}
            type="text"
            placeholder="Type here"
            className="input input-bordered w-full"
          />
          <label className="label">
            <span className="label-text">Latitude</span>
          </label>
          <input
            onChange={(evt) => setLatitude(Number(evt.currentTarget.value))}
            type="text"
            placeholder="Type here"
            className="input input-bordered w-full"
          />
          <label className="label">
            <span className="label-text">Longitude</span>
          </label>
          <input
            onChange={(evt) => setLongitude(Number(evt.currentTarget.value))}
            type="text"
            placeholder="Type here"
            className="input input-bordered w-full"
          />
          <br /> <br />
          <select
            className="select select-bordered w-full "
            value={selectedOption}
            onChange={(evt) =>
              setSelectedOption(
                evt.currentTarget.value as "detect" | "collect" | undefined
              )
            }
          >
            <option disabled selected>
              Type of game
            </option>
            <option value="detect">Detect</option>
            <option value="collect">Collect</option>
          </select>
          <div className="divider"></div>
          <div className="grid grid-cols-4 gap-2 ">
            {images.map((image, idx) => (
              <picture key={idx}>
                <img
                  onClick={() => {
                    if (selectedImages.includes(image.src)) {
                      setSelectedImages(
                        selectedImages.filter((img) => img !== image.src)
                      );
                    } else {
                      setSelectedImages([...selectedImages, image.src]);
                    }
                  }}
                  src={image.src}
                  className={clsx({
                    "border-4 border-green-700 border-dashed":
                      selectedImages.includes(image.src),
                  })}
                  alt="image"
                />
              </picture>
            ))}
          </div>
          <div className="divider"></div>
          <div className="modal-action">
            <button onClick={props.onClose} className="btn btn-sm">
              Cancel
            </button>
            <button
              onClick={() => {
                newGame({
                  name,
                  latitude,
                  longitude,
                  type: selectedOption,
                  assets: selectedImages,
                });
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
