import mongoose from "mongoose";

const ElementSchema = new mongoose.Schema({
    id: { type: String, required: true },
    type: { type: String, required: true, enum: ['page'] },
    props: {
      title: { type: String, default: 'Untitled Child Page' },
      pageId: { type: String, required: true },
      parentId: { type: String, required: true },
      nodeType: { type: String, default: 'void' }
    },
    children: { type: Array, default: [] }
  });

const PageSchema = new mongoose.Schema({
    pageId: { type: String, required: true, unique: true },
    parentId: { type: String, required: true },
    order: { type: Number, required: true },
    deletedAt: { type: Date, default: null },
    element: { type: ElementSchema, required: true }
  });
  
const TrashEntry =
    mongoose.models.TrashEntry || mongoose.model('TrashEntry', PageSchema);
  
export default TrashEntry;