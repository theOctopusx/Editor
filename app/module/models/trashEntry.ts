import mongoose from "mongoose";

const PageSchema = new mongoose.Schema({
    pageId: { type: String, required: true, unique: true },
    parentId: { type: String, required: true },
    order: { type: Number, required: true },
    deletedAt: { type: Date, default: null },
    deletedBlock: { type: Object, required: true },
    element : { type: Object, required: true }
  });
  
const TrashEntry =
    mongoose.models.TrashEntry || mongoose.model('TrashEntry', PageSchema);
  
export default TrashEntry;