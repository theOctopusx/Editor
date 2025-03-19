import { EditorContent } from "~/module/editor/model";

export const action = async () => {
  const result = await EditorContent.create({ title: "Untitled", content: {} });
  return new Response(JSON.stringify({ title: result.title, id: result._id }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
