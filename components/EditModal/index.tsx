import { useRef } from "react";

export function EditModal(props: { onCancel: () => void; onSave: () => void }) {
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
