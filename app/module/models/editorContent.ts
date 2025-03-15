import mongoose from "mongoose";

const editorContentSchema = new mongoose.Schema(
  {
    content: {
      type: Object, // YooptaEditor stores content as an object
      required: true,
    },
  },
  { timestamps: true }
);

const EditorContent =
  mongoose.models.EditorContent ||
  mongoose.model("EditorContent", editorContentSchema);

export default EditorContent;
