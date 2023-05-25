import clsx from "clsx";
import { useRouter } from "next/router";
import { useQuests } from "../../lib/quests/queries";

export function Actions(props: {
  children?: React.ReactNode;
  className?: string;
}) {
  const router = useRouter();

  const { data: games } = useQuests();

  const activeQuest = games?.find((g) => g.id === router.query.quest);

  return (
    <>
      <div
        className={clsx(
          "pointer-events-auto fixed bottom-0  -z-50  flex h-fit w-screen justify-end gap-2 p-4",
          props.className
        )}
      >
        <div className="w-full ">{props?.children}</div>
        {activeQuest && (
          <label
            role="button"
            htmlFor="my-modal"
            className="pointer-events-auto w-fit border border-gray-700 bg-black"
          >
            <picture className="block h-14 w-14    bg-opacity-70 p-3">
              <img
                className="h-full w-full"
                src="https://s2.svgbox.net/octicons.svg?ic=info&color=fff"
                alt=""
              />
            </picture>
          </label>
        )}
        {activeQuest && (
          <label
            role="button"
            htmlFor="my-modal"
            className="pointer-events-auto w-fit border border-gray-700 bg-black"
          >
            <picture className="grid h-14  w-14 place-items-center  bg-opacity-70">
              <img
                src="https://s2.svgbox.net/octicons.svg?ic=book&color=fff"
                alt=""
              />
            </picture>
          </label>
        )}
        <label
          role="button"
          htmlFor="my-drawer"
          className="pointer-events-auto w-fit border border-gray-700 bg-black"
        >
          <picture className="block h-14 w-14  bg-opacity-70 p-3">
            <img
              src="https://s2.svgbox.net/hero-outline.svg?ic=menu&color=fff"
              alt=""
            />
          </picture>
        </label>
      </div>
    </>
  );
}
