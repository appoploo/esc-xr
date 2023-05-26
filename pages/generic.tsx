import { startSession, stopSession } from "@react-three/xr";
import clsx from "clsx";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { Actions } from "../components/actions";
import { BoxGame } from "../components/boxGame";
import { CollectGame } from "../components/collectGame";
import { InfoModal } from "../components/infoModal";
import { Menu } from "../components/menu";
import { useQuests } from "../lib/quests/queries";
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

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function Page(props: User) {
  const { data: games } = useQuests();
  const router = useRouter();
  const [xr, setXr] = useState(false);
  const activeQuest = games?.find((g) => g.id === router.query.quest);

  return (
    <div className="relative overflow-hidden">
      <Head>
        <title>Quests</title>
      </Head>

      {!xr ? (
        <div
          className={"relative h-screen w-screen bg-white"}
          style={{
            backgroundImage: `url(/images/ee.jpg)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className=" sticky  top-0 flex w-screen  ">
            <div className="stroke mx-auto w-full bg-black bg-opacity-50 p-2  pb-0  text-xl font-bold text-white drop-shadow-2xl">
              {activeQuest ? (
                <Head1>{activeQuest?.name} &nbsp;</Head1>
              ) : (
                <Head1>Select quest from menu </Head1>
              )}
            </div>
          </div>
        </div>
      ) : activeQuest?.type === "collect" ? (
        <CollectGame />
      ) : activeQuest?.type === "box" ? (
        <BoxGame />
      ) : null}
      <div className="pointer-events-none fixed top-0 z-50 h-screen w-screen">
        <Actions inRadius>
          {activeQuest && (
            <button
              onClick={() => {
                Promise.resolve()
                  .then(() => {
                    if (xr) router.replace("/generic");
                    setXr(!xr);
                  })
                  .then(() => sleep(500))

                  .then(() => {
                    if (xr) stopSession();
                    else
                      startSession("immersive-ar", {
                        domOverlay:
                          typeof document !== "undefined"
                            ? { root: document.body }
                            : undefined,
                        optionalFeatures: [
                          "dom-overlay",
                          "dom-overlay-for-handheld-ar",
                        ],
                      });
                  });
              }}
              className={clsx(
                "flex h-14  w-full items-center justify-center  border border-gray-700  bg-black  bg-opacity-70 text-lg font-bold text-white"
              )}
            >
              {!xr ? "Play" : "Exit"}
            </button>
          )}
        </Actions>
        <Menu {...props} />
      </div>

      <InfoModal inRadius={true} />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = withSessionSsr(
  async function getServerSideProps(ctx) {
    return accessLevel("user", ctx);
  }
);
