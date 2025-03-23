import mongoose from "mongoose";

const rootPageSchema = new mongoose.Schema(
  {
    content: {
      type: Object,
      default: {},
    },
    title: {
      type: String,
      default: "New Root Page",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

const RootPage =
  mongoose.models.rootPage || mongoose.model("rootPage", rootPageSchema);

export default RootPage;
