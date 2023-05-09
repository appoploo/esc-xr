import clsx from "clsx";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { InfoModal } from "../components/infoModal";
import { Menu } from "../components/menu";
import { useQuests } from "../lib/quests/queries";
import { Quest } from "../lib/quests/types";
import { User } from "../lib/users/types";
import { accessLevel, withSessionSsr } from "../lib/withSession";

export function Head1(props: { children: React.ReactNode }) {
  return (
    <h1
      style={{
        textShadow: "-1px -1px 2px #000, 1px 1px 1px #000",
      }}
      className="text-md z-50 mb-2 text-center  font-bold text-white md:text-4xl"
    >
      {props.children}
    </h1>
  );
}

function Action(props: Quest) {
  const router = useRouter();

  return props.type ? (
    <Link
      href={`${router.pathname}/${props?.type ?? "detect"}?quest=${props?.id}`}
      className={clsx(
        "pointer-events-auto mx-auto flex h-14 w-full  items-center justify-center border-none  bg-black  bg-opacity-70 text-lg font-bold text-white "
      )}
    >
      {props?.type}
    </Link>
  ) : (
    <div />
  );
}

export default function Page(props: User) {
  const { data: games } = useQuests();

  const router = useRouter();
  const activeQuest = games?.find((g) => g.id === router.query.quest);

  return (
    <div
      className="relative h-screen w-screen bg-white  "
      style={{
        backgroundImage: `url(/images/ee.jpg)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="pointer-events-none fixed top-0  left-0 z-50 h-screen   w-screen ">
        <div className="absolute top-0 flex  w-screen  ">
          <div className="stroke  container relative  mx-auto   w-full border-dashed border-black bg-black bg-opacity-50 p-2  pb-0  text-4xl font-bold text-white drop-shadow-2xl md:w-96 ">
            {activeQuest ? (
              <Head1>{activeQuest?.name} &nbsp;</Head1>
            ) : (
              <Head1>Select quest from menu </Head1>
            )}
          </div>
        </div>
        <div className=" pointer-events-none fixed    mx-auto grid h-full w-full place-items-center ">
          <div className=" container pointer-events-none mx-auto  grid place-items-center p-4 text-2xl font-bold">
            {activeQuest?.literature}
          </div>
        </div>
        <div className="fixed bottom-0 -z-50  grid h-fit w-screen grid-cols-[1fr_56px_56px] flex-wrap justify-end gap-0 p-4">
          <Action {...(activeQuest as Quest)} />
          {activeQuest ? (
            <label
              role="button"
              htmlFor="my-modal"
              className=" pointer-events-auto grid "
            >
              <picture className="block h-14 w-14 border-l border-white border-opacity-60  bg-black bg-opacity-70 p-3">
                <img
                  className="hf-full w-full"
                  src="https://s2.svgbox.net/octicons.svg?ic=info&color=fff"
                  alt=""
                />
              </picture>
            </label>
          ) : (
            <div />
          )}
          <label
            role="button"
            htmlFor="my-drawer"
            className=" pointer-events-auto "
          >
            <picture className="block h-14 w-14 border-l border-white border-opacity-60  bg-black bg-opacity-70 p-3">
              <img
                src="https://s2.svgbox.net/hero-outline.svg?ic=menu&color=fff"
                alt=""
              />
            </picture>
          </label>
        </div>
        <Menu {...props} />
        <InfoModal inRadius={true} />
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = withSessionSsr(
  async function getServerSideProps(ctx) {
    return accessLevel("user", ctx);
  }
);
