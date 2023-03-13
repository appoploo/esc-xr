import { Arr3 } from "../../lib/leva";

export default function Xyz(props: {
  label?: string;
  onChange?: ([x, y, z]: Arr3) => void;
  value?: Arr3;
  min: number;
  max: number;
  step?: number;
}) {
  const [v1, v2, v3] = props.value ?? [0, 0, 0];
  return (
    <div>
      <div className="text-xl">{props.label}</div>
      <div className="grid grid-cols-1  p-2">
        <div className="w-full  ">
          <label className="label-text-alt">
            {props.label} x <span className="">{v1.toFixed(2)}</span>
          </label>
          <input
            step={props.step ?? 1}
            min={props.min}
            max={props.max}
            value={v1?.toFixed(2)}
            onChange={(evt) => {
              const value = parseFloat(evt.target.value);
              props.onChange?.([value, v2, v3]);
            }}
            type="range"
            className=" input-bordered input   input-sm w-full focus:outline-none"
          />
        </div>
        <div className="w-full">
          <label className="label-text-alt">
            {props.label} y <span className="">{v2.toFixed(2)}</span>
          </label>
          <input
            step={props.step ?? 1}
            min={props.min}
            max={props.max}
            value={v2?.toFixed(2)}
            onChange={(evt) => {
              const value = parseFloat(evt.target.value);
              props.onChange?.([v1, value, v3]);
            }}
            type="range"
            className=" input-bordered input  input-sm w-full focus:outline-none"
          />
        </div>
        <div className="w-full">
          <label className="label-text-alt">
            {props.label} z <span className="">{v3.toFixed(2)}</span>
          </label>
          <input
            step={props.step ?? 1}
            min={props.min}
            max={props.max}
            value={v3?.toFixed(2)}
            onChange={(evt) => {
              const value = parseFloat(evt.target.value);
              props.onChange?.([v1, v2, value]);
            }}
            type="range"
            className=" input-bordered input  input-sm w-full focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}
