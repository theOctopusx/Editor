import { json } from "@remix-run/node";
import { EditorContent } from "~/module/editor/model";



export const action = async ({ request }:{request:Request}) => {
  try {
    const body = await request.json();
    const { content,contentId,title } = body;
    console.log(title);

    // if (!content) {
    //   return json({ error: "Content is required" }, { status: 400 });
    // }
    if(!contentId){
      const saveToDb = await EditorContent.create({title,content})
      return json({ success: true, message: "Content saved successfully",data:saveToDb });
    }
    // const newContent = new EditorContent({ content });
    const savetodb = await EditorContent.findOneAndUpdate({_id:contentId},{content,title},{new:true})


    return json({ success: true, message: "Content saved successfully",data:savetodb });
  } catch (error) {
    console.error("Error saving editor content:", error);
    return json({ error: "Internal Server Error" }, { status: 500 });
  }
};

