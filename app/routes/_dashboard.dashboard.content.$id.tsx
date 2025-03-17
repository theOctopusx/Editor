import { json, LoaderFunction } from "@remix-run/node";
import { EditorContent } from "~/module/editor/model";
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
const PageContent = () => {
  return (
    <div>
      <NotionLikePageEditor />
    </div>
  );
};

export default PageContent;
