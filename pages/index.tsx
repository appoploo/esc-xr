import { GetServerSideProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useT } from "../Hooks/useT";
import { accessLevel, withSessionSsr } from "../lib/withSession";

export default function Login() {
  const router = useRouter();

  const [step, setStep] = useState(0);
  const t = useT();
  return (
    <>
      <section
        style={{
          backgroundImage: `url(/images/xorafi_low.jpg)`,
          backgroundSize: "100% 100%",
        }}
        className="flex h-screen w-screen flex-col justify-around overflow-hidden"
      >
        <div className=" w-full bg-black bg-opacity-50 py-4 pl-4">
          <h1 className=" text-3xl font-bold text-white">{t("ready_title")}</h1>
        </div>
        <div className=" grid h-full w-full grid-cols-[300px_1fr] p-4">
          <div className="  my-auto  ml-auto grid w-full grid-cols-1 justify-end gap-2 py-4 ">
            <Link
              href="/generic"
              className="w-full rounded-xl border border-dashed border-white bg-black bg-opacity-70 px-8 py-4  text-center text-xl font-bold text-white drop-shadow hover:scale-105 "
            >
              {t("generic")}
            </Link>
            <Link href="/insitu">
              <button className=" w-full rounded-xl border border-dashed border-white bg-black bg-opacity-70 px-8 py-4  text-center text-xl font-bold text-white drop-shadow hover:scale-105 ">
                {t("insitu")}
              </button>
            </Link>
          </div>

          <div className=" mx-auto my-auto  h-fit w-3/5 rounded-xl bg-black bg-opacity-70 p-8  py-4 text-justify">
            <h1 className=" text-xl font-bold  leading-10 text-white drop-shadow ">
              {t("ready_text")
                .split("nl")
                .map((item, key) => {
                  return <div key={key}>{item}</div>;
                })}
            </h1>
          </div>
        </div>
      </section>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = withSessionSsr(
  async function getServerSideProps(ctx) {
    return accessLevel("user", ctx);
  }
);
