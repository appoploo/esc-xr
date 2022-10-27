import * as tf from "@tensorflow/tfjs";
import { Tensor } from "@tensorflow/tfjs";
import { useEffect, useRef } from "react";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs-backend-webgl";
import { useRouter } from "next/router";

const URL = "/models/";
const modelURL = URL + "model.json";
const metadataURL = URL + "metadata.json";

export default function Detect() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const getVideo = () => {
    if (!videoRef.current) return;
    navigator.mediaDevices
      .getUserMedia({
        video: {
          facingMode: "environment",
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
    console.log(videoRef.current?.width);
    const model = await cocoSsd.load();
    canvasRef.current!.width = 1920;
    canvasRef.current!.height = 1080;

    const interval = setInterval(async () => {
      if (!videoRef.current || !canvasRef.current) return;
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const ctx = canvas?.getContext("2d");
      ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
      const preds = await model.detect(canvasRef.current);
      preds.forEach((p) => {
        if (!ctx) return;
        if (p.class === "bottle") {
          clearInterval(interval);
          router.push("/ar");
        }
        ctx.strokeRect(...p.bbox);
        ctx.font = "bold 48px serif";
        ctx.strokeStyle = "red";
        ctx.fillText(p.class, p.bbox[0], p.bbox[1]);
        ctx.stroke();
      });
    }, 30);
  };

  useEffect(() => {
    getVideo();
    init();
  }, []);

  return (
    <div>
      <video
        autoPlay
        ref={videoRef}
        className="w-screen h-screen bg-black"
        src=""
      ></video>
      <canvas
        width={100}
        height={100}
        ref={canvasRef}
        className=" absolute left-0 top-0  border-4 border-red-500"
      ></canvas>
    </div>
  );
}
