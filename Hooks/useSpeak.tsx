import { useRouter } from "next/router";

export function useSpeak() {
  const router = useRouter();
  const speak = (msg?: string) => {
    if (!msg) return;
    const locale =
      router.locale === "en"
        ? "UK English Female"
        : router.locale === "el"
        ? "Greek Female"
        : "UK English Female";
    // @ts-ignore
    // console.log(window["responsiveVoice"]);
    // @ts-ignore
    window["responsiveVoice"]?.speak?.(msg, locale);
    // if (
    //   typeof window === "undefined" &&
    //   typeof window["responsiveVoice"] === "undefined"
    // )
    //   return;
    // const v = speechSynthesis.getVoices()?.find((v) => v.lang === "el-GR");
    // if (!v) return;
    // voice.text = msg;
    // voice.lang = locale;
    // voice.voice = v;
    // voice.volume = 1;
    // voice.rate = 1;
    // voice.pitch = 1;
    // speechSynthesis.speak(voice);
  };

  return speak;
}
