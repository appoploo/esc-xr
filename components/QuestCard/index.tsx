import clsx from "clsx";
import { useRouter } from "next/router";
import { useState } from "react";
import { Quest } from "../../lib/quests/types";

export function QuestCard(props: Quest & { distance?: number }) {
  const router = useRouter();
  const enabled =
    router.query?.quest === props.id &&
    Number(props?.distance ?? Infinity) < 50;
  const [modal, setModal] = useState(false);
  return (
    <>
      <div
        onClick={() => setModal(true)}
        className={clsx(
          "h-full w-fit overflow-hidden rounded-lg border  bg-white shadow-xl",
          {
            "animate-bounce": enabled,
          }
        )}
      >
        <div className="grid  grid-cols-[200px_1fr] gap-4 border">
          <picture>
            <img
              className="border"
              src="https://developers.google.com/static/maps/images/landing/hero_directions_api.png"
              alt="google map image"
            ></img>
          </picture>

          <div className="p-2 text-base-content">
            <h2 className="font-bold ">{props.name}</h2>
            <div className="my-2 w-full border-b" />
            <h2 className="w-60  ">{props.description}</h2>
          </div>
        </div>
      </div>
      {/* Put this part before </body> tag */}
      <div
        className={clsx("modal ", {
          "modal-open": modal,
        })}
      >
        <div className="modal-box">
          <h3 className="text-lg font-bold">Info about {props.name} &nbsp;</h3>
          <p className="py-4">{props.description}</p>
          <div className="modal-action">
            <label
              onClick={() => setModal(false)}
              htmlFor="my-modal"
              className="btn"
            >
              ok
            </label>
          </div>
        </div>
      </div>
    </>
  );
}
