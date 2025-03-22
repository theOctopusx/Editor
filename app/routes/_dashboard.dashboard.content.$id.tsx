import { json, LoaderFunction } from "@remix-run/node";
import ChildPage from "~/module/models/childPage";
import RootPage from "~/module/models/rootPage";
import NotionLikePageEditor from "~/page/NotionLikePageEditor";

export const loader: LoaderFunction = async ({ params }) => {
  try {
    const { id } = params;
    if (!id) {
      return json({ success: false, error: "ID is required" }, { status: 400 });
    }

    // Try to find the document in RootPage first
    let editorContent = await RootPage.findOne({ _id: id });

    // If not found, check in ChildPage
    if (!editorContent) {
      editorContent = await ChildPage.findOne({ _id: id });
    }

    if (!editorContent) {
      return json(
        { success: false, error: "Content not found" },
        { status: 404 }
      );
    }

    return json({ success: true, data: editorContent });
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
  const parentId = formData.get("parentId");
  const parentPageBlockId = formData.get("parentPageBlockId");
  const parentPageElementId = formData.get("parentPageElementId");

  const result = await ChildPage.create({
    title: "Untitled Child Page",
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

const PageContent = () => {
  return (
    <div>
      <NotionLikePageEditor />
    </div>
  );
};

export default PageContent;
