import { json } from "@remix-run/node";
import { EditorContent } from "~/module/editor/model";
import { connectToDB } from "~/utils/db.server"; // Function to connect to MongoDB

// Connect to the database
connectToDB();

export const action = async ({ request }) => {
  try {
    const body = await request.json();
    const { content,contentId,title } = body;
    console.log(title);

    if (!content) {
      return json({ error: "Content is required" }, { status: 400 });
    }
    
    // const newContent = new EditorContent({ content });
    const savetodb = await EditorContent.findOneAndUpdate({_id:contentId},{content,title},{new:true})


    return json({ success: true, message: "Content saved successfully",data:savetodb });
  } catch (error) {
    console.error("Error saving editor content:", error);
    return json({ error: "Internal Server Error" }, { status: 500 });
  }
};

