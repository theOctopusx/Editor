import mongoose, { Schema } from "mongoose";
import { IEditorContent } from "./interface";

const editorContentSchema = new Schema<IEditorContent>(
    {
        content:{
            type:Object,
            required:true,
            default:{},
        },
        title:{
            type:String,
            default:'Untitled'
        }
    },
    { timestamps: true }
)

export const EditorContent = mongoose.models.EditorContent ||
  mongoose.model("EditorContent", editorContentSchema);
