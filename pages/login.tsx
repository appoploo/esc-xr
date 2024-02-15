import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useT } from "../Hooks/useT";

export default function Login() {
  const router = useRouter();
  const { locale } = router;
  const t = useT();
  const setLang = (e: string) => {
    if (typeof window !== "undefined") localStorage.setItem("lang", e);
  };
  const [error, setError] = useState<"error" | null>(null);

  return (
    <div className="h-screen w-screen bg-black">
      <img className="fixed right-4 bottom-4 z-50 w-80" src="/espa-logo.jpg" />
      <img
        src="/images/start_map.png"
        className="absolute z-0 h-screen w-screen object-contain"
        alt=""
      />
      <section className="absolute z-50 flex h-screen w-screen  items-center  justify-center overflow-hidden">
        <select
          value={locale}
          onChange={(evt) => {
            const locale = evt.currentTarget.value;
            setLang(locale);
            router.push("/login", "/login", { locale });
          }}
          className="absolute top-0 right-0 block w-fit  cursor-pointer appearance-none border border-white border-opacity-25 bg-black bg-opacity-70 px-3   py-4 text-center   text-2xl font-bold text-yellow-500 outline-none"
        >
          <option
            className=" bg-black text-2xl  uppercase text-yellow-500 "
            value="en"
          >
            🇬🇧 &nbsp; {(locale === "el" ? "ΑΓΓΛΙΚΑ" : `English`).toUpperCase()}
          </option>
          <option
            className="bg-black text-2xl  uppercase text-yellow-500 "
            value="el"
          >
            🇬🇷 &nbsp;{(locale === "el" ? "ΕΛΛΗΝΙΚΑ" : `Greek`).toUpperCase()}
          </option>
        </select>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const form = e.currentTarget;
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            const res = await fetch(form.action, {
              method: form.method,
              body: JSON.stringify(data),
              headers: {
                "Content-Type": "application/json",
              },
            });
            const d = await res.json();
            if (res.status > 299) {
              setError(d.msg);
            } else {
              router.push("/");
            }
          }}
          method="post"
          action="/api/auth?type=login"
          className="grid  w-full max-w-xl gap-y-8  rounded border border-white border-opacity-30 bg-black bg-opacity-80 p-8"
        >
          <h1 className="h-12 text-3xl font-bold text-yellow-500">
            {t("login_title")}
          </h1>
          <input
            name="userName"
            required
            placeholder={t("login_username")}
            type="text"
            className="input-bordered input  bordered w-full bg-black  bg-opacity-60 text-2xl text-yellow-500  placeholder-yellow-800 outline-none focus:outline-none  "
          />

          <input
            autoComplete=""
            name="password"
            required
            placeholder={t("login_password")}
            minLength={6}
            type="password"
            className="input-bordered input  bordered w-full bg-black  bg-opacity-60 text-2xl text-yellow-500  placeholder-yellow-800 outline-none focus:outline-none  "
          />

          <input
            required
            role="button"
            type="submit"
            value={t("login_button")}
            className="input-bordered input bordered w-full bg-black  bg-opacity-70 text-2xl text-yellow-500  placeholder-yellow-800 outline-none hover:scale-95  hover:bg-white hover:bg-opacity-5 focus:outline-none  "
          />
          {error && (
            <div className="text-center text-sm text-red-500">{error}</div>
          )}
          <Link
            href="/register"
            role="button"
            className="w-full text-right text-sm text-yellow-300"
          >
            {t("login_signup")}
          </Link>
        </form>
      </section>
    </div>
  );
}
