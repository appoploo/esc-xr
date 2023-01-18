import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";
import { Game } from "../../lib/games/types";
import { formatDistance } from "../../lib/utils";

export function QuestCard(props: Game & { distance?: number }) {
  const router = useRouter();
  const enabled =
    router.query?.quest === props._id &&
    Number(props?.distance ?? Infinity) < 50;

  return (
    <div
      className={clsx(
        "w-fit bg-white border rounded-lg overflow-hidden  shadow-xl h-full",
        {
          "animate-bounce": enabled,
        }
      )}
    >
      <div className="grid  border grid-cols-[200px_1fr] gap-4">
        <picture>
          <img
            className="border"
            src="https://developers.google.com/static/maps/images/landing/hero_directions_api.png"
            alt="google map image"
          ></img>
        </picture>

        <div className="p-2 text-base-content">
          <h2 className="font-bold ">{props.name}</h2>
          <div className="w-full border-b my-2" />
          <h2 className="w-60  ">{props.description}</h2>
        </div>
      </div>
    </div>
  );
}
