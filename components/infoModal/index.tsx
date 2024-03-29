import { useRouter } from "next/router";
import { useQuests } from "../../lib/quests/queries";

export function InfoModal(props: { inRadius: boolean }) {
  const { data: games } = useQuests();
  const router = useRouter();
  const activeQuest = games?.find((g) => g.id === router.query.quest);
  const text = props.inRadius ? activeQuest?.info_wr : activeQuest?.info_or;

  return (
    <div>
      <input type="checkbox" id="my-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <h3 className="text-lg font-bold">{activeQuest?.name}</h3>
          <div className="divider"></div>
          <p className="py-4">{text}</p>
          <div className="modal-action">
            <label htmlFor="my-modal" className="btn">
              close
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
