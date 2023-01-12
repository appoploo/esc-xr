import Link from "next/link";
import { useRouter } from "next/router";
import { useT } from "../Hooks/useT";

export default function Login() {
  const router = useRouter();
  const { locale } = router;
  const t = useT();

  return (
    <div className="bg-black w-screen h-screen">
      <img
        src="/images/start_map.png"
        className="z-0 absolute w-screen h-screen object-contain"
        alt=""
      />
      <section className="h-screen z-50 absolute flex items-center  justify-center  w-screen overflow-hidden">
        <select
          value={locale}
          onChange={(evt) => {
            const locale = evt.currentTarget.value;
            router.push("/register", "/register", { locale });
          }}
          className="cursor-pointer bg-opacity-70 absolute top-0 right-0  bg-black text-center text-2xl appearance-none block px-3 py-4 w-fit   text-yellow-500 font-bold   border border-opacity-25 border-white outline-none"
        >
          <option
            className=" text-yellow-500 uppercase  bg-black text-2xl "
            value="en"
          >
            🇬🇧 &nbsp; {(locale === "el" ? "ΑΓΓΛΙΚΑ" : `English`).toUpperCase()}
          </option>
          <option
            className="text-yellow-500 uppercase  bg-black text-2xl "
            value="el"
          >
            🇬🇷 &nbsp;{(locale === "el" ? "ΕΛΛΗΝΙΚΑ" : `Greek`).toUpperCase()}
          </option>
        </select>
        <form
          method="post"
          action="/api/auth?type=register"
          className="max-w-xl  w-full grid gap-y-8  bg-black bg-opacity-80 border border-white border-opacity-30 p-8 rounded"
        >
          <h1 className="text-3xl font-bold h-12 text-yellow-500">
            {t("register_title")}
          </h1>
          <input
            name="userName"
            placeholder={t("register_username")}
            type="text"
            className="input placeholder-yellow-800  input-bordered bg-black bg-opacity-60  w-full bordered text-yellow-500  outline-none focus:outline-none text-2xl  "
          />

          <input
            name="password"
            minLength={6}
            placeholder={t("register_password")}
            autoComplete="off"
            type="password"
            className="input placeholder-yellow-800  input-bordered bg-black bg-opacity-60  w-full bordered text-yellow-500  outline-none focus:outline-none text-2xl  "
          />

          <input
            minLength={6}
            autoComplete="off"
            name="passwordConfirmation"
            placeholder={t("register_password_confirm")}
            type="password"
            className="input placeholder-yellow-800  input-bordered bg-black bg-opacity-70  w-full bordered text-yellow-500  outline-none focus:outline-none text-2xl  "
          />

          <input
            name="submit"
            role="button"
            value={t("register_button")}
            type="submit"
            className="input hover:bg-white hover:scale-95 hover:bg-opacity-5 placeholder-yellow-800  input-bordered bg-black bg-opacity-70  w-full bordered text-yellow-500  outline-none focus:outline-none text-2xl  "
          />

          <Link
            href="/login"
            className="text-right text-sm text-yellow-300 w-full"
          >
            {t("register_login")}
          </Link>
        </form>
      </section>
    </div>
  );
}
