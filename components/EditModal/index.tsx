import { useRef, useState } from "react";

const images = [
  {
    src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQt7XrlOYGCxY4_ESPW5stFkD_pHLunqVVYbQ&usqp=CAU",
  },
  {
    src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxXnC3fwMwkbIt3ejGRIw3NmbDyUtgS5g2jA&usqp=CAU",
  },
];

export function EditModal(props: { onCancel: () => void; onSave: () => void }) {
  const [selectedImage, setSelectedImage] = useState();
  return (
    <>
      <div className="modal border ">
        <div className="modal-box relative">
          <label className="label">
            <span className="label-text">Name</span>
          </label>
          <input
            type="text"
            placeholder="Type here"
            className="input input-bordered w-full"
          />
          <label className="label">
            <span className="label-text">Latitude</span>
          </label>
          <input
            type="text"
            placeholder="Type here"
            className="input input-bordered w-full"
          />
          <label className="label">
            <span className="label-text">Longtitude</span>
          </label>
          <input
            type="text"
            placeholder="Type here"
            className="input input-bordered w-full"
          />
          <br /> <br />
          <select className="select select-bordered w-full ">
            <option disabled selected>
              Type of game
            </option>
            <option>Detect</option>
            <option>Collect</option>
          </select>
          <div className="divider"></div>
          <div className="grid grid-cols-4 gap-2 ">
            {images.map((image, idx) => (
              <img
                onClick={() => setSelectedImage(image.src)}
                key={idx}
                src={image.src}
              ></img>
            ))}
          </div>
          <div className="divider"></div>
          <div className="modal-action">
            <button onClick={props.onCancel} className="btn btn-sm">
              Cancel
            </button>
            <button onClick={props.onSave} className="btn btn-sm">
              Save
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
