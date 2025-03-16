
import { EditorContent } from "~/module/editor/model"
import { redirect } from "@remix-run/node";

// Connect to the database

export const action =async () => {
    const result = await EditorContent.create({title:'Untitled',content:{}});
    return redirect(`/dashboard/${result._id}`)
}