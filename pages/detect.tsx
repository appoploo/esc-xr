import * as tf from "@tensorflow/tfjs";
import { Tensor } from "@tensorflow/tfjs";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useCounter, useInterval } from "usehooks-ts";
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

  const { count, setCount, increment, decrement, reset } = useCounter(-1);
  useInterval(decrement, count > 0 ? 1000 : null);
  const predict = async (model: tf.GraphModel<tf.io.IOHandler>) => {
    if (!ref.current) return;

    const camera = await tf.data.webcam(ref.current, {
      facingMode: "environment",
    });
    let int: NodeJS.Timer;
    setCount(30);
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
        clearInterval(int);
        router.push("/");
        toast.success(`Μπράβο τα κατάφερες!`);
      }
      img.dispose();
    }, 1000);
  };

  const loadModel = async () => {
    // tf load model weight and metadata
    const model = await tf.loadGraphModel(
      "https://tfhub.dev/google/tfjs-model/imagenet/mobilenet_v3_small_100_224/classification/5/default/1",
      {
        fromTFHub: true,
      }
    );
    if (model) predict(model);
  };

  useEffect(() => {
    if (count === 0) setModal(true);
  }, [count]);

  const ref = useRef<HTMLVideoElement>(null);
  const [modal, setModal] = useState(false);

  return (
    <div className="relative">
      <input type="checkbox" id="my-modal" className="modal-toggle" />
      <div
        className={clsx("modal", {
          "modal-open": modal,
        })}
      >
        <div className="modal-box">
          <h3 className="text-lg font-bold">Ο χρόνος σου έληξε</h3>
          <p className="py-4">
            Ο χρόνος σου έληξε, Προσπάθησε ξανά! η Επεστρέψε στο κυρίως μενού
          </p>
          <div className="modal-action">
            <Link href="/">
              <label className="btn">Επεστρέψε!</label>
            </Link>
            <label
              onClick={() => {
                setCount(30);
                setModal(false);
              }}
              className="btn"
            >
              Προσπάθησε ξανά!
            </label>
          </div>
        </div>
      </div>
      <video
        width={224}
        height={224}
        ref={ref}
        className={clsx("h-screen w-screen", {
          "opacity-0": count === 0,
        })}
      />

      <div
        style={{ transform: "skewX(-20deg)" }}
        className="stroke fixed z-50 m-4 mx-auto w-11/12  bg-black bg-opacity-30 p-4 pb-0  text-4xl font-bold text-white drop-shadow-2xl  "
      >
        <h1
          style={{
            textShadow: "-1px -1px 2px #000, 1px 1px 1px #000",
          }}
          className="text-md z-50 mb-2 text-center  text-2xl font-bold text-white"
        >
          {activeQuest?.description} &nbsp;
          <br />
          <progress
            value={count}
            className="progress progress-success w-full"
            max="30"
          ></progress>
        </h1>

        <div className="mt-2 w-full border-b border-dashed border-black"></div>
      </div>
      {count < 0 ? (
        <div className="fixed top-0 flex h-screen  w-screen items-center justify-center bg-black bg-opacity-60 p-4 text-4xl font-bold text-white">
          <div>
            <div className="text text-center">loading...</div>
            <progress className="progress  w-96  "></progress>
          </div>
        </div>
      ) : (
        <h1 className="fixed top-0 grid w-screen  justify-center  bg-black bg-opacity-60 p-4 text-4xl font-bold text-white">
          <span>{activeQuest?.description}</span>
          <span className=" mt-2 text-sm">
            χρόνος που απομένει: {count} δευτερόλεπτα
          </span>
        </h1>
      )}
    </div>
  );
}
