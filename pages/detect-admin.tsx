import * as tf from "@tensorflow/tfjs";
import { Tensor } from "@tensorflow/tfjs";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { updateQuest, useQuests } from "../lib/quests/queries";

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
  const [detected, setDetected] = useState("Loading...");

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
      setDetected(className);
      if (activeQuest?.detect === className) {
        toast.success(`You found ${className}!`);
        clearInterval(int);
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

  const { data: quests } = useQuests();

  const ref = useRef<HTMLVideoElement>(null);
  const [quest, setQuest] = useState<string | null>(null);
  return (
    <div className="relative">
      <video width={224} height={224} ref={ref} className="h-screen w-screen" />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          const quest = e.currentTarget.quest.value;
          const label = e.currentTarget.label.value;
          updateQuest(quest, {
            detect: detected,
            detect_label: label,
          });
        }}
        className="fixed bottom-0  w-screen  bg-black bg-opacity-60 p-4 text-4xl font-bold text-white"
      >
        <div className="grid gap-4   lg:grid-cols-3">
          <div>
            <label htmlFor="" className="label-text label">
              Quest
            </label>

            <select
              required
              defaultValue={"-"}
              onChange={(e) => {
                setQuest(e.target.value);
              }}
              name="quest"
              className="select-bordered  select select-sm w-full"
              id=""
            >
              <option value={"-"} disabled>
                select quest
              </option>
              {quests?.map((quest) => (
                <option key={quest.id} value={quest?.id}>
                  {quest?.name}
                </option>
              ))}
            </select>
          </div>
          {quest && (
            <>
              <div className="w-full">
                <label htmlFor="" className="label-text label">
                  Label for {detected}
                </label>
                <input
                  required
                  name="label"
                  type="text"
                  className="input-bordered input input-sm w-full "
                />
              </div>
              <div className="flex items-end">
                <button type="submit" className="btn-sm btn w-full">
                  {" "}
                  save
                </button>
              </div>
            </>
          )}
        </div>
      </form>
    </div>
  );
}
