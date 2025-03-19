import { EditorContent } from "~/module/editor/model";

export const action = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const title = formData.get("title");
  const result = await EditorContent.create({
    title: title ?? "Untitled Page",
    content: {},
  });
  return new Response(JSON.stringify({ title: result.title, id: result._id }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
