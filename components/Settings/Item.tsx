import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import useMutation from "../../Hooks/useMutation";
import { updateItem, useItem } from "../../lib/items/queries";
import { useStore } from "../../store";
import Xyz from "../xyz";

export function Item() {
  const router = useRouter();
  const { data: item } = useItem();
  const [save] = useMutation(updateItem, [`/api/items/${router.query.id}`]);
  const store = useStore();

  useEffect(() => {
    if (item) store.setItem(item);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item]);

  return (
    <div className="absolute right-0 z-50 h-screen  w-[20vw] overflow-auto bg-black  p-4">
      <div className="flex items-center">
        <Link
          href={{
            query: {
              quest: router.query.quest,
            },
          }}
        >
          <picture>
            <img
              role="button"
              src="https://s2.svgbox.net/materialui.svg?ic=arrow_back&color=fff"
              alt=""
            />
          </picture>
        </Link>

        <h1 className="ml-4 text-2xl font-bold">{store?.item?.name}</h1>
      </div>
      <div className="divider"></div>
      <label className="label-text">type</label>
      <select
        value={store.item.type}
        onChange={(evt) => {
          store.setItem({
            type: evt.target.value,
          });
        }}
        className="select-bordered select select-sm w-full"
      >
        <option value="default">defalut</option>
        <option value="collectable">collectable</option>
        <option value="box">box</option>
      </select>
      <div className="divider"></div>

      <Xyz
        step={0.01}
        min={-50}
        max={50}
        value={store.item.position}
        label="Position"
        onChange={(arr) =>
          store.setItem({
            position: arr,
          })
        }
      />
      <div className="divider"></div>
      <Xyz
        max={360}
        min={-360}
        value={store.item.rotation}
        label="Rotation"
        onChange={(arr) =>
          store.setItem({
            rotation: arr,
          })
        }
      />
      <div className="divider"></div>
      <div className="text-xl">Scale {store.item.scale} </div>
      <input
        step={0.01}
        min={0}
        max={100}
        value={store.item.scale}
        type="range"
        className="w-full"
        onChange={(evt) => {
          store.setItem({
            scale: +evt.target.value,
          });
        }}
      />
      <div className="divider" />
      <div className="grid grid-cols-2 gap-2">
        <div
          onClick={() => item && store.setItem(item)}
          className=" btn-sm btn ml-2 capitalize"
        >
          Reset
        </div>
        <div
          onClick={() => save(store.item)}
          className=" btn-sm btn ml-2 capitalize"
        >
          Save
        </div>
      </div>
    </div>
  );
}
