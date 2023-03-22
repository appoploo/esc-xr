import axios from "axios";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import useMutation from "../../Hooks/useMutation";
import { useInventory } from "../../lib/inventory/queries";
import { useQuests } from "../../lib/quests/queries";
import { User } from "../../lib/users/types";

export function Menu(props: User) {
  const { data: inventory } = useInventory();
  const { data: quests } = useQuests();
  const router = useRouter();

  const [reset] = useMutation(
    () => axios.post("/api/auth?type=reset"),
    ["/api/inventory"]
  );

  const [filter, setFilter] = useState("all");
  const [item, setItem] = useState<"item" | "achievement">("item");
  const [drawer, setDrawer] = useState(false);
  const itemLength = inventory?.filter((obj) => obj.type === "item").length;
  const achievementLength = inventory?.filter(
    (obj) => obj.type === "achievement"
  ).length;

  const isQuestDone = (id: string) =>
    inventory.find((obj) => obj.expand?.quest_id?.id === id);
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div
      className={clsx("drawer z-50", {
        "pointer-events-none": !drawer,
        "pointer-events-auto": drawer,
      })}
    >
      <input
        ref={ref}
        id="my-drawer"
        type="checkbox"
        onChange={(evt) => {
          setDrawer(evt.target.checked);
        }}
        className="drawer-toggle"
      />

      <div className="drawer-side">
        <label htmlFor="my-drawer" className="drawer-overlay"></label>

        <div className="menu  w-80 gap-4 bg-base-100 p-4 text-base-content">
          <div className=" grid grid-cols-2 content-between items-start gap-2 ">
            <h1 className="label-text text-xl font-bold">{props.userName}</h1>

            <form
              action="/api/auth?type=logout"
              className="ml-auto"
              method="POST"
            >
              <button className="btn-sm btn w-full ">Logout</button>
            </form>

            {props.admin && (
              <button onClick={() => reset()} className="btn-sm btn w-full ">
                Reset
              </button>
            )}

            {!props.test && (
              <Link href="/detect-admin">
                <button className="btn-sm btn w-full ">detect-admin</button>
              </Link>
            )}
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
          {quests
            ?.filter((obj) => {
              if (filter === "all") return true;
              if (filter === "active") return !isQuestDone(obj.id ?? "-");
              if (filter === "done") return isQuestDone(obj.id ?? "-");
            })
            .sort((a, b) => {
              if (isQuestDone(a.id ?? "-") && !isQuestDone(b.id ?? "-")) {
                return 1;
              }
              if (!isQuestDone(a.id ?? "-") && isQuestDone(b.id ?? "-")) {
                return -1;
              }
              return 0;
            })
            .map((obj) => (
              <div
                className={clsx("btn h-fit", {
                  "disabled opacity-60": isQuestDone(obj.id ?? "-"),
                  "border border-yellow-400 hover:border hover:border-yellow-400":
                    obj.id === router.query.quest,
                })}
                key={obj.id}
              >
                <Link
                  onClick={() => {
                    ref.current?.click();
                  }}
                  className=" flex w-full items-center"
                  href={`?quest=${obj.id}`}
                >
                  <div className="mr-auto">{obj.name}</div>
                  {isQuestDone(obj.id ?? "-") && (
                    <picture>
                      <img
                        alt="item"
                        src="https://s2.svgbox.net/materialui.svg?ic=done&color=8f0"
                      ></img>
                    </picture>
                  )}
                </Link>
              </div>
            ))}

          <div className="divider"></div>
          <label className="label-text mb-4 text-xl font-bold">Inventory</label>
          <div className="tabs mb-4">
            <button
              onClick={() => {
                setItem("item");
              }}
              className={clsx(" tab-bordered tab w-1/2 ", {
                "tab-active": item === "item",
              })}
            >
              Items ({itemLength})
            </button>
            <button
              onClick={() => {
                setItem("achievement");
              }}
              className={clsx(" tab-bordered tab w-1/2", {
                "tab-active": item === "achievement",
              })}
            >
              Achievements ({achievementLength})
            </button>
          </div>
          <div className="grid w-full grid-cols-4 gap-2 ">
            {inventory
              ?.filter((obj) => obj.type === item)
              ?.map((obj) => (
                <div
                  key={obj.id}
                  className=" w-fit border border-white border-opacity-30 "
                >
                  <picture>
                    <img
                      className="h-full w-full bg-cover"
                      src={obj.src + "?thumb=200x200"}
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
