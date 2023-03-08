import { useRouter } from "next/router";
import { Item } from "./Item";
import Main from "./main";

export function Settings() {
  const router = useRouter();
  const { id } = router.query;

  return id ? <Item /> : <Main />;
}
