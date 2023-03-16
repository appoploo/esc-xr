import * as tf from "@tensorflow/tfjs";
import { Tensor } from "@tensorflow/tfjs";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { useQuests } from "../lib/quests/queries";

export default function Page() {
  useEffect(() => {
    loadModel();
  }, []);

  const router = useRouter();
  const { data: games } = useQuests();
  const activeQuest = games?.find((g) => g.id === router.query.quest);

  function preprocess(imageTensor: tf.Tensor3D) {
    const widthToHeight = imageTensor.shape[1] / imageTensor.shape[0];
    let squareCrop;
    if (widthToHeight > 1) {
      const heightToWidth = imageTensor.shape[0] / imageTensor.shape[1];
      const cropTop = (1 - heightToWidth) / 2;
      const cropBottom = 1 - cropTop;
      squareCrop = [[cropTop, 0, cropBottom, 1]];
    } else {
      const cropLeft = (1 - widthToHeight) / 2;
      const cropRight = 1 - cropLeft;
      squareCrop = [[0, cropLeft, 1, cropRight]];
    }
    // Expand image input dimensions to add a batch dimension of size 1.
    const crop = tf.image.cropAndResize(
      tf.expandDims(imageTensor) as Tensor<tf.Rank.R4>,
      squareCrop,
      [0],
      [224, 224]
    );
    return crop.div(255);
  }

  const predict = async (model: tf.GraphModel<tf.io.IOHandler>) => {
    if (!ref.current) return;

    const camera = await tf.data.webcam(ref.current, {
      facingMode: "environment",
    });
    let int: NodeJS.Timer;
    int = setInterval(async () => {
      const img = await camera.capture();
      const preprocessed = preprocess(img);
      const logits = model.predict(preprocessed) as tf.Tensor<tf.Rank.R2>;
      const classIndex = await tf.argMax(tf.squeeze(logits)).data();
      const metaData = model.metadata as {
        classNames: string[];
      };
      const className = metaData.classNames[classIndex[0]];
      if (activeQuest?.detect === className) {
        toast.success(`Μπράβο τα κατάφερες!`);
        clearInterval(int);
        router.push("/");
      }
      img.dispose();
    }, 1000);
  };

  const loadModel = async () => {
    // tf load model weight and metadata
    const model = await tf.loadGraphModel(
      "https://tfhub.dev/google/tfjs-model/imagenet/mobilenet_v3_small_100_224/classification/5/default/1",
      { fromTFHub: true }
    );
    if (model) predict(model);
  };

  const ref = useRef<HTMLVideoElement>(null);
  return (
    <div className="relative">
      <video width={224} height={224} ref={ref} className="h-screen w-screen" />
      <h1 className="fixed top-0 flex w-screen justify-center bg-black bg-opacity-60 p-4 text-4xl font-bold text-white">
        {activeQuest?.description}
      </h1>
    </div>
  );
}
