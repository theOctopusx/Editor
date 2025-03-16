import { json,LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { EditorContent } from "~/module/editor/model";
import NotionLikePageEditor from "~/page/NotionLikePageEditor";

export const loader: LoaderFunction = async ({params}) => {
    try {
      
      // Fetch all documents (modify as needed)
      const editorContents = await EditorContent.findOne({_id:params.id});
  
      return json({ success: true, data: editorContents });
    } catch (error) {
      console.error("Error fetching editor content:", error);
      return json({ success: false, error: "Failed to fetch data" }, { status: 500 });
    }
  };

const DynamicPage = () => {
    const {data } = useLoaderData<typeof loader>()
    return (
        <div>
            <NotionLikePageEditor data={data} />
        </div>
    );
};

export default DynamicPage;