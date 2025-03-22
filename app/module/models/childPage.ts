import mongoose from "mongoose";

const childPageSchema = new mongoose.Schema(
  {
    content: {
      type: Object,
      default: {},
    },
    title: {
      type: String,
      default: "Untitled Child Page",
    },
    parentId: {
      type: String,
      required: true,
    },
    parentPageBlockId: {
      type: String,
      required: true,
    },
    parentPageElementId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const ChildPage =
  mongoose.models.childPage || mongoose.model("childPage", childPageSchema);

export default ChildPage;
