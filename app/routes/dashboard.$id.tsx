import { json,LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { EditorContent } from "~/module/editor/model";
import NotionLikePageEditor from "~/page/NotionLikePageEditor";
import { connectToDB } from "~/utils/db.server";

export const loader: LoaderFunction = async ({params}) => {
    try {
      await connectToDB();
      
      // Fetch all documents (modify as needed)
      const editorContents = await EditorContent.findOne({_id:params.id});
  
      return json({ success: true, data: editorContents });
    } catch (error) {
      console.error("Error fetching editor content:", error);
      return json({ success: false, error: "Failed to fetch data" }, { status: 500 });
    }
  };

const DynamicPage = () => {
    const data  = useLoaderData()
    return (
        <div>
            <NotionLikePageEditor data={data?.data} />
        </div>
    );
};

export default DynamicPage;