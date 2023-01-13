import { Game } from "../../lib/games/types";

export function QuestCard(props: Game) {
  return (
    <div className=" w-fit border rounded-lg overflow-hidden bg-base-100 shadow-xl">
      <div className="relative">
        <div className="grid grid-cols-[200px_1fr] gap-4">
          <picture>
            <img
              className="h-full"
              src="https://developers.google.com/static/maps/images/landing/hero_directions_api.png"
              alt="google map image"
            ></img>
          </picture>

          <div className="p-4">
            <h2 className="font-bold ">{props.name}</h2>
            <h2 className="w-60 h-20 ">{props.description}</h2>
          </div>
        </div>
      </div>
    </div>
  );
}
