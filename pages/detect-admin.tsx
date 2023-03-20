import * as tf from "@tensorflow/tfjs";
import { Tensor } from "@tensorflow/tfjs";
import clsx from "clsx";
import Image from "next/image";
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
      if (activeQuest?.detect?.includes(className)) {
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
  const [searchList, setSearchList] = useState<string[]>([]);

  useEffect(() => {
    if (!quest) return;
    const questData = quests?.find((q) => q.id === quest);
    setSearchList(questData?.detect ?? []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quest]);

  return (
    <div className="relative">
      <video width={224} height={224} ref={ref} className="h-screen w-screen" />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          const quest = e.currentTarget.quest.value;
          const label = e.currentTarget.label.value;
          updateQuest(quest, {
            detect: searchList,
            detect_label: label,
          })
            .then(() => {
              toast.success("Updated quest");
            })
            .catch((e) => {
              toast.error(e.message);
            });
        }}
        className="fixed top-0  w-screen  bg-black bg-opacity-60 p-2 text-4xl font-bold text-white"
      >
        <div
          className={clsx("grid gap-4", {
            "grid-cols-2": quest,
          })}
        >
          <div>
            <label className="label-text">Select quest</label>
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
              <option value="-" disabled />
              {quests?.map((quest) => (
                <option key={quest.id} value={quest?.id}>
                  {quest?.name}
                </option>
              ))}
            </select>
          </div>
          {quest && (
            <div className="w-full">
              <label htmlFor="" className="label-text ">
                Label
              </label>
              <input
                required
                name="label"
                type="text"
                className="input-bordered input input-sm w-full "
              />
            </div>
          )}
        </div>
        <div className="inline-flex  w-screen gap-4 overflow-auto">
          {searchList.map((item, idx) => (
            <div
              onClick={() => {
                setSearchList(searchList.filter((i) => item !== i));
              }}
              key={idx}
              className="m-1 flex w-fit  items-center justify-center rounded-full border border-yellow-700  bg-yellow-700 py-1 px-2 font-medium text-yellow-100 "
            >
              <div className="max-w-full flex-initial truncate text-xs font-normal leading-none">
                {item}
              </div>
              <div className="flex flex-auto flex-row-reverse">
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="100%"
                    height="100%"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="feather feather-x ml-2 h-4 w-4 cursor-pointer rounded-full hover:text-yellow-400"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
        <input className="btn-sm btn mt-2 w-full rounded" type="submit" />
      </form>

      <div className=" fixed bottom-4  w-full ">
        <div className="flex w-full justify-center">
          <button
            onClick={() => {
              if (!searchList.includes(detected))
                setSearchList([detected, ...searchList]);
            }}
            className=" btn  h-20 w-20 rounded-full"
          >
            <Image
              loader={() =>
                "https://s2.svgbox.net/hero-outline.svg?ic=camera&color=888"
              }
              src="https://s2.svgbox.net/hero-outline.svg?ic=camera"
              width={50}
              height={50}
              alt="camera"
            />
          </button>
        </div>
        <div className="flex w-full justify-center text-lg font-bold">
          i see {detected}
        </div>
      </div>
    </div>
  );
}
