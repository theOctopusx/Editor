import { redirect } from "@remix-run/node";
import RootPage from "~/module/models/rootPage";

export const action = async () => {
  const result = await RootPage.create({ title: "Untitled", content: {} });
  return redirect(`/dashboard/content/${result._id}`);
};
