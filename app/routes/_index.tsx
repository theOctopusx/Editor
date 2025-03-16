import { json, type LoaderFunction, type MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import Editor from "~/components/Editor";
import EditorContent from "~/module/models/editorContent";
import { connectToDB } from "~/utils/db.server";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

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

export default function Index() {
  const data  = useLoaderData()
  return (
    <main>
      <Editor data={data?.data}/>
    </main>
  );
}

