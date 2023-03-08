export default function Xyz(props: {
  label?: string;
  onChange?: ([x, y, z]: [number, number, number]) => void;
  defaultValue?: [number, number, number];
}) {
  const [v1, v2, v3] = props.defaultValue ?? [0, 0, 0];
  return (
    <div>
      <div className="grid grid-cols-3 gap-2">
        <div className="w-full">
          <label className="label-text-alt">{props.label} x</label>
          <input
            defaultValue={v1}
            type="number"
            className="input-bordered  input input-sm w-full"
          />
        </div>
        <div className="w-full">
          <label className="label-text-alt">{props.label} y</label>
          <input
            defaultValue={v2}
            type="number"
            className="input-bordered  input input-sm w-full"
          />
        </div>
        <div className="w-full">
          <label className="label-text-alt">{props.label} z</label>
          <input
            defaultValue={v3}
            type="number"
            className="input-bordered  input input-sm w-full"
          />
        </div>
      </div>
    </div>
  );
}
