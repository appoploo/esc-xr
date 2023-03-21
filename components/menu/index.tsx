import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useInventory } from "../../lib/inventory/queries";
import { useQuests } from "../../lib/quests/queries";

export function Menu(props: { userName: string }) {
  const { data: inventory } = useInventory();
  const { data: quests } = useQuests();
  const router = useRouter();

  const [filter, setFilter] = useState("all");
  return (
    <div className="drawer">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        <label
          role="button"
          htmlFor="my-drawer"
          className=" fixed bottom-4 right-4 z-50 "
        >
          <picture className="block h-14 w-14 rounded-md bg-black p-3">
            <img
              src="https://s2.svgbox.net/hero-outline.svg?ic=menu&color=aaa"
              alt=""
            />
          </picture>
        </label>
      </div>
      <div className="drawer-side">
        <label htmlFor="my-drawer" className="drawer-overlay"></label>

        <div className="menu  w-80 gap-4 bg-base-100 p-4 text-base-content">
          <div className=" flex content-between items-center ">
            <h1 className="label-text text-xl font-bold">{props.userName}</h1>
            <form
              action="/api/auth?type=logout"
              className="ml-auto"
              method="POST"
            >
              <button className="btn-sm btn ">Logout</button>
            </form>
          </div>
          <div className="divider "></div>

          <label className="label-text text-xl font-bold">Quest</label>
          <div className="tabs">
            <button
              onClick={() => {
                setFilter("all");
              }}
              className={clsx(" tab-bordered tab w-1/3", {
                "tab-active": filter === "all",
              })}
            >
              All
            </button>
            <button
              onClick={() => {
                setFilter("active");
              }}
              className={clsx(" tab-bordered tab w-1/3", {
                "tab-active": filter === "active",
              })}
            >
              Active
            </button>
            <button
              onClick={() => {
                setFilter("done");
              }}
              className={clsx(" tab-bordered tab w-1/3", {
                "tab-active": filter === "done",
              })}
            >
              Done
            </button>
          </div>
          {quests.map((obj) => (
            <div
              className={clsx("btn h-fit", {
                "border border-yellow-400 hover:border hover:border-yellow-400":
                  obj.id === router.query.quest,
              })}
              key={obj.id}
            >
              <Link
                className=" flex w-full items-center"
                href={`?quest=${obj.id}`}
              >
                <div className="mr-auto">{obj.name}</div>
                <picture>
                  <img
                    alt="item"
                    src="https://s2.svgbox.net/materialui.svg?ic=done"
                  ></img>
                </picture>
              </Link>
            </div>
          ))}

          <div className="divider"></div>
          <label className="label-text mb-4 text-xl font-bold">Inventory</label>
          <div className="grid w-full grid-cols-3 gap-4 ">
            {inventory?.map((obj) => (
              <div
                key={obj.id}
                className="border border-white border-opacity-30"
              >
                <picture>
                  <img
                    src="https://raw.githubusercontent.com/mpoapostolis/escape-vr/main/public/images/ee3d0973-0f32-4cf1-87a0-167882430a54.png"
                    alt=""
                  />
                </picture>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
