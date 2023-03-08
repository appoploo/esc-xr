import Link from "next/link";
import { useRouter } from "next/router";
import { useItems } from "../../lib/items/queries";
import { useQuests } from "../../lib/quests/queries";

export default function Main() {
  const router = useRouter();
  const { data: items } = useItems();
  const { data: quests } = useQuests();
  const { id, quest } = router.query;

  return (
    <div className="absolute right-0 z-50 h-screen  w-[20vw] overflow-auto bg-black  p-4">
      <label htmlFor="" className="label-text label">
        Quest
      </label>
      <select
        defaultValue={"-"}
        value={quest}
        onChange={(e) => {
          router.replace({
            query: { ...router.query, quest: e.target.value },
          });
        }}
        name=""
        className="select-bordered select w-full"
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

      <div className="divider"></div>
      <label htmlFor="" className="label-text label">
        Items
      </label>
      {items?.map((item) => (
        <Link
          href={{
            query: {
              ...router.query,
              id: item.id,
            },
          }}
          key={item.id}
        >
          <div key={item.id} tabIndex={0} className={"btn-sm btn  mb-2 w-full"}>
            {item.name}
          </div>
        </Link>
      ))}
    </div>
  );
}
