import { redirect } from "next/navigation";
// /assets-en is no longer publicly shown; it forwards to the hidden /manage entry.
export default function AssetsRedirect() {
  redirect("/manage");
}
