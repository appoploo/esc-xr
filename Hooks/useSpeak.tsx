import { useRouter } from "next/router";

export function useSpeak() {
  const router = useRouter();
  const speak = (msg: string) => {
    const voice = new SpeechSynthesisUtterance();
    // @ts-ignore
    console.log(window["responsiveVoice"]);
    // @ts-ignore
    // window["responsiveVoice"].speak
    // if (
    //   typeof window === "undefined" &&
    //   typeof window["responsiveVoice"] === "undefined"
    // )
    //   return;
    // const locale =
    //   router.locale === "en"
    //     ? "en-US"
    //     : router.locale === "el"
    //     ? "el"
    //     : "en-US";
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
