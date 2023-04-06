import { useRouter } from "next/router";
import { useQuests } from "../../lib/quests/queries";

export function LiteratureModal() {
  const { data: games } = useQuests();
  const router = useRouter();
  const activeQuest = games?.find((g) => g.id === router.query.quest);
  return (
    <div>
      <input type="checkbox" id="my-modal-2" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <h3 className="text-lg font-bold">{activeQuest?.name}</h3>
          <div className="divider"></div>
          <p className="py-4">{activeQuest?.literature}</p>
          <div className="modal-action">
            <label htmlFor="my-modal-2" className="btn">
              close
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
