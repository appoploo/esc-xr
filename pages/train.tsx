import * as tf from "@tensorflow/tfjs";
import { Tensor } from "@tensorflow/tfjs";
import * as tfjsWasm from "@tensorflow/tfjs-backend-webgl";
import { useEffect, useRef } from "react";

const MOBILE_NET_INPUT_WIDTH = 224;
const MOBILE_NET_INPUT_HEIGHT = 224;
const STOP_DATA_GATHER = -1;
const CLASS_NAMES = ["cat", "dog", "tree"];

export default function Page() {
  useEffect(() => {
    startWebCam();
  }, []);

  const startWebCam = async () => {
    if (!ref.current) return;
    const camera = await tf.data.webcam(ref.current);
  };

  const ref = useRef<HTMLVideoElement>(null);
  return (
    <div>
      <h1>Train</h1>
      <div>
        <div className="h-24 w-fit">
          <video
            width={224}
            height={224}
            ref={ref}
            className="h-screen w-screen "
          />
        </div>
        <div className="grid grid-cols-3 gap-x-4">
          <button className="btn">Collect </button>
        </div>
      </div>
    </div>
  );
}
