import { useRouter } from "next/router";
import { useItem } from "../../lib/items/queries";
import { useStore } from "../../store";
import Xyz from "../xyz";

export function Item() {
  const router = useRouter();
  const { data: item } = useItem();
  const store = useStore();

  return (
    <div className="absolute right-0 z-50 h-screen  w-[20vw] overflow-auto bg-black  p-4">
      <div className="flex items-center">
        <picture>
          <img
            role="button"
            onClick={router.back}
            src="https://s2.svgbox.net/materialui.svg?ic=arrow_back&color=fff"
            alt=""
          />
        </picture>

        <h1 className="ml-4 text-2xl font-bold">{item?.name}</h1>
        <div className=" btn-sm btn ml-auto ">delete</div>
        <div className=" btn-sm btn ml-2 ">save</div>
      </div>
      <div className="divider"></div>

      {item && (
        <Xyz
          defaultValue={item?.position}
          label="Position"
          onChange={console.log}
        />
      )}
      {item && (
        <Xyz
          defaultValue={item?.rotation}
          label="Rotation"
          onChange={console.log}
        />
      )}

      <div className="divider"></div>
      <label className="label-text">type</label>
      <select className="select-bordered select select-sm w-full">
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
      </select>
    </div>
  );
}
