import { GetServerSideProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useT } from "../Hooks/useT";
import { accessLevel, withSessionSsr } from "../lib/withSession";

export default function Login() {
  const router = useRouter();

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
        <div className=" grid h-full w-full p-4">
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
