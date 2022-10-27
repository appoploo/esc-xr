import * as tf from "@tensorflow/tfjs";
import { Tensor } from "@tensorflow/tfjs";
import { useEffect, useRef, useState } from "react";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs-backend-webgl";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

const URL = "/models/";
const modelURL = URL + "model.json";
const metadataURL = URL + "metadata.json";

export default function Detect() {
  const videoRef = useRef<HTMLVideoElement>(null);

  const getVideo = () => {
    if (!videoRef.current) return;
    navigator.mediaDevices
      .getUserMedia({
        video: {
          facingMode: "environment",
          height: { ideal: 720, max: 1080, min: 480 },
          width: { ideal: 1280, max: 1920, min: 720 },
        },
      })
      .then((stream) => {
        if (!videoRef.current) return;
        const video = videoRef.current;
        video.srcObject = stream;
      })
      .catch((err) => {
        console.error("error:", err);
      });
  };

  const router = useRouter();
  const init = async () => {
    await tf.setBackend("webgl");
    const model = await cocoSsd.load();
    const video = videoRef.current;
    const interval = setInterval(async () => {
      if (!video || video.readyState < 3) return;
      const preds = await (
        await model.detect(video)
      ).filter((e) => e.class === "bottle");
      if (preds.length > 0) {
        clearInterval(interval);
        router.push("/ar").then(() => {
          toast.success(
            "ouuu fantastika mpravo OUUUUUUUUUUUUUUUUUUUUUUUUUUUUU"
          );
        });
      }
    }, 10);
  };
  const [preds, setPreds] = useState<cocoSsd.DetectedObject[]>([]);
  useEffect(() => {
    getVideo();
    init();
  }, []);
  return (
    <div className="relative w-screen h-screen">
      <video
        autoPlay
        ref={videoRef}
        className="top-0 left-0 w-screen h-screen bg-black"
        src=""
      ></video>
    </div>
  );
}
