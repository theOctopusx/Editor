import ChildPage from "~/module/models/childPage";

export const action = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const parentId = formData.get("parentId");
  const parentPageBlockId = formData.get("parentPageBlockId");
  const parentPageElementId = formData.get("parentPageElementId");

  const result = await ChildPage.create({
    title: "Untitled Page",
    content: {},
    parentId,
    parentPageBlockId,
    parentPageElementId,
  });

  return new Response(
    JSON.stringify({ title: result.title, id: result._id, ...result.toJSON() }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};
