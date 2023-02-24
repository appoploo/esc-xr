import { Leva } from "leva";
import { useLeva } from "../../Hooks/useLeva";

export function LevaSettings() {
  useLeva();
  return (
    <Leva
      theme={{
        space: {
          rowGap: "5px",
        },
        sizes: {
          rootWidth: "20vw",
        },
      }}
      // fill // default = false,  true makes the pane fill the parent dom node it's rendered in
      flat // default = false,  true removes border radius and shadow
      oneLineLabels // default = false, alternative layout for labels, with labels and fields on separate rows
    />
  );
}
