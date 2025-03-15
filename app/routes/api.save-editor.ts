import { json } from "@remix-run/node";
import EditorContent from "~/module/models/editorContent";
import { connectToDB } from "~/utils/db.server"; // Function to connect to MongoDB

// Connect to the database
connectToDB();

export const action = async ({ request }) => {
  try {
    const body = await request.json();
    const { content } = body;

    if (!content) {
      return json({ error: "Content is required" }, { status: 400 });
    }
    

    // const newContent = new EditorContent({ content });
    const savetodb = await EditorContent.findOneAndUpdate({},{content:content},{new:true,upsert:true})


    return json({ success: true, message: "Content saved successfully",data:savetodb });
  } catch (error) {
    console.error("Error saving editor content:", error);
    return json({ error: "Internal Server Error" }, { status: 500 });
  }
};

