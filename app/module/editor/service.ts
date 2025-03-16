import { json } from "@remix-run/node";
import { connectToDB } from "~/utils/db.server";
import { EditorContent } from "./model";

// Connect to the database
connectToDB();

export const action = async ({ request }:{request:Request}) => {
  try {
    const body = await request.json();
    const { content,contentId,title } = body;

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