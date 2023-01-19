import * as tf from "@tensorflow/tfjs";
import { Tensor } from "@tensorflow/tfjs";
import * as tfjsWasm from "@tensorflow/tfjs-backend-webgl";
import { useEffect, useRef } from "react";
import { toast } from "react-toastify";

export default function Page() {
  useEffect(() => {
    loadModel();
  }, []);

  const predict = async (model: tf.LayersModel) => {
    if (!ref.current) return;
    const response = await fetch("/models/metadata.json");
    const metadata = await response.json();
    const labels = metadata.labels;
    const camera = await tf.data.webcam(ref.current, {
      facingMode: "environment",
    });
    let int: NodeJS.Timer;
    int = setInterval(async () => {
      const img = await camera.capture();
      const processedImg = tf.image.resizeBilinear(img, [224, 224]);
      const normalizedImg = tf
        .scalar(255)
        .sub(processedImg)
        .div(tf.scalar(255));
      const prediction = model.predict(normalizedImg.expandDims(0)) as Tensor;

      const topK = await prediction.topk();
      const classes = topK.indices.dataSync();
      const scores = topK.values.dataSync();

      console.log(`Predicted class: ${labels[+classes]} with scores ${scores}`);
      console.log(int);
      if (labels[+classes] === "Door") {
        clearInterval(int);
        toast.success("You found the door!");
      }
      img.dispose();
    }, 1000);
  };
  const loadModel = async () => {
    // tf load model weight and metadata
    const model = await tf.loadLayersModel("/models/model.json");
    if (model) predict(model);
  };
  const ref = useRef<HTMLVideoElement>(null);
  return (
    <video width={224} height={224} ref={ref} className="h-screen w-screen " />
  );
}
