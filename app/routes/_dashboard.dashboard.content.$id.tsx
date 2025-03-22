import { json, LoaderFunction } from "@remix-run/node";
import { EditorContent } from "~/module/editor/model";
import RootPage from "~/module/models/rootPage";
import NotionLikePageEditor from "~/page/NotionLikePageEditor";

export const loader: LoaderFunction = async ({ params }) => {
  try {
    // Fetch all documents (modify as needed)
    const editorContents = await EditorContent.findOne({ _id: params.id });

    return json({ success: true, data: editorContents });
  } catch (error) {
    console.error("Error fetching editor content:", error);
    return json(
      { success: false, error: "Failed to fetch data" },
      { status: 500 }
    );
  }
};

export const action = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const title = formData.get("title");
  const result = await RootPage.create({
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

const PageContent = () => {
  return (
    <div>
      <NotionLikePageEditor />
    </div>
  );
};

export default PageContent;
