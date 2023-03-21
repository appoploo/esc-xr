import clsx from "clsx";
import { GetServerSideProps } from "next";
import { accessLevel, withSessionSsr } from "../lib/withSession";

export default function Menu() {
  const items = Array(40).fill("");

  return (
    <div className="h-full w-full bg-base-100">
      <h1 className="p-4 text-4xl font-bold">Inventory</h1>
      <div className="divider"></div>
      <div className=" container mx-auto   py-4">
        <div className="grid grid-cols-3 gap-4 p-4 sm:grid-cols-2  md:grid-cols-4 xl:grid-cols-8">
          {items.map((item, idx) => (
            <div key={idx} className="border border-white border-opacity-30">
              <picture>
                <img
                  className={clsx(
                    "h-fit w-fit border-b  border-white border-opacity-30",
                    {}
                  )}
                  src="https://raw.githubusercontent.com/mpoapostolis/escape-vr/main/public/images/ee3d0973-0f32-4cf1-87a0-167882430a54.png"
                  alt=""
                />
              </picture>
              <label className="block p-1 text-center">asdasdasdasd</label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = withSessionSsr(
  async function getServerSideProps(ctx) {
    return accessLevel("user", ctx);
  }
);
