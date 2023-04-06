import axios from "axios";
import clsx from "clsx";
import { getDistance } from "geolib";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useMemo, useRef, useState } from "react";
import useMutation from "../../Hooks/useMutation";
import { useInventory } from "../../lib/inventory/queries";
import { useQuests } from "../../lib/quests/queries";
import { User } from "../../lib/users/types";
import { formatDistance } from "../../lib/utils";

export function Menu(
  props: User & {
    coords?: GeolocationCoordinates;
  }
) {
  const { data: inventory } = useInventory();
  const { data: quests } = useQuests();
  const router = useRouter();
  const groups = quests
    ?.map((obj) => obj.group)
    .filter((v, i, a) => a.indexOf(v) === i);

  const [reset] = useMutation(
    () => axios.post("/api/auth?type=reset"),
    ["/api/inventory"]
  );

  const [filter, setFilter] = useState<string | undefined>(undefined);
  const [item, setItem] = useState<"item" | "achievement">("item");
  const [drawer, setDrawer] = useState(false);
  const itemLength = inventory?.filter((obj) => obj.type === "item").length;
  const achievementLength = inventory?.filter(
    (obj) => obj.type === "achievement"
  ).length;

  useEffect(() => {
    if (!filter) setFilter(groups?.[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groups]);

  const isQuestDone = (id: string) =>
    inventory.find((obj) => obj.expand?.quest_id?.id === id);
  const ref = useRef<HTMLInputElement>(null);
  const { latitude, longitude } = props.coords ?? {
    latitude: 0,
    longitude: 0,
  };

  const distances = useMemo(
    () =>
      quests?.map((obj) => {
        const distance = getDistance(
          { latitude, longitude },
          {
            latitude: obj?.lat ?? 0,
            longitude: obj?.lng ?? 0,
          },
          0.1
        );
        return { ...obj, distance };
      }),
    [latitude, longitude, quests]
  );
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
          <div className="  w-full overflow-auto  whitespace-nowrap  p-2">
            {groups.map((obj) => (
              <button
                key={obj}
                onClick={() => {
                  setFilter(obj);
                }}
                className={clsx(" tab inline-block   w-fit", {
                  "tab-active border-b border-white": filter === obj,
                })}
              >
                {obj}
                <span className="ml-2 text-xs text-gray-400">
                  (
                  {
                    quests.filter(
                      (obj2) =>
                        obj2.group === obj && isQuestDone(obj2.id ?? "-")
                    ).length
                  }
                  /{quests.filter((obj2) => obj2.group === obj).length})
                </span>
              </button>
            ))}
          </div>
          {distances
            ?.filter((obj) => {
              if (filter) {
                return obj.group === filter;
              }
              return true;
            })

            .sort((a, b) => {
              if (isQuestDone(a.id ?? "-") && !isQuestDone(b.id ?? "-")) {
                return 1;
              }
              if (!isQuestDone(a.id ?? "-") && isQuestDone(b.id ?? "-")) {
                return -1;
              }
              return a.distance - b.distance;
            })
            .map((obj) => (
              <div
                className={clsx("btn relative  h-fit ", {
                  "disabled opacity-60": isQuestDone(obj.id ?? "-"),
                  "border border-yellow-400 hover:border hover:border-yellow-400":
                    obj.id === router.query.quest,
                })}
                key={obj.id}
              >
                <Link
                  onClick={() => {
                    if (isQuestDone(obj.id ?? "-")) return;
                    ref.current?.click();
                  }}
                  className={clsx(
                    "grid w-full grid-cols-[1fr_15px] items-center ",
                    {
                      "cursor-not-allowed": isQuestDone(obj.id ?? "-"),
                    }
                  )}
                  href={
                    isQuestDone(obj.id ?? "-")
                      ? "#"
                      : `${router.pathname}?quest=${obj.id}`
                  }
                >
                  <div className="h-full w-full text-left">
                    {obj.name} &nbsp;
                    <span className="text-xs text-gray-500">
                      {!isNaN(obj.distance)
                        ? formatDistance(obj.distance)
                        : "-"}
                    </span>
                  </div>

                  <picture
                    className={clsx({
                      "opacity-0": !isQuestDone(obj.id ?? "-"),
                    })}
                  >
                    <img
                      alt="item"
                      src="https://s2.svgbox.net/materialui.svg?ic=done&color=8f0"
                    ></img>
                  </picture>
                </Link>
              </div>
            ))}

          <div className="divider"></div>
          <label className="label-text mb-4 text-xl font-bold">Inventory</label>
          <div className="tabs mb-4 inline">
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
