import { useRouter } from "next/router";
import { useQuests } from "../../lib/quests/queries";

export function InfoModal() {
  const { data: games } = useQuests();
  const router = useRouter();
  const activeQuest = games?.find((g) => g.id === router.query.quest);
  return (
    <div>
      <input type="checkbox" id="my-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <h3 className="text-lg font-bold">{activeQuest?.name}</h3>
          <div className="divider"></div>
          <p className="py-4">{activeQuest?.description}</p>
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
