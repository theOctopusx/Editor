import { json } from "@remix-run/react";
import ChildPage from "~/module/models/childPage";
import RootPage from "~/module/models/rootPage";
import TrashEntry from "~/module/models/trashEntry";

export const action = async ({ request }: { request: Request }) => {
  try {
    const { pageId } = await request.json();
    console.log(pageId, "page id");
    const parent = await RootPage.findById(pageId);
    if (parent) {
      const result = await RootPage.findByIdAndUpdate(pageId, {
        isDeleted: false,
        deletedAt: null,
      });
      const updateChildCollection = await ChildPage.find({
        parentId: pageId,
      }).updateMany({ isDeleted: false, deletedAt: null });
      const deleteTrash = await TrashEntry.deleteMany({ parentId: pageId });
      console.log(deleteTrash, "Childe deleted from trash");
      return json({ result });
    } else {
      //* Step 1 - Restore the page
      const result = await ChildPage.findByIdAndUpdate(pageId, {
        isDeleted: false,
        deletedAt: null,
      });
      //* Step 2 - Restore the child pages
      const updateChildCollection = await ChildPage.find({
        parentId: pageId,
      }).updateMany({ isDeleted: false, deletedAt: null });

      // * Step 3 - Get the deleted block from trash and restore it to parent page
      const deletedTrash = await TrashEntry.findOne({ pageId });
      const deletedBlock = deletedTrash?.deletedBlock;
      const parentPageId = deletedTrash?.parentId;
      console.log("Deleted block", deletedBlock);
      console.log("Parent page id", parentPageId);
      const parentPage = await RootPage.findOne({ _id: parentPageId });
      console.log("Parent page", parentPage);
      const updateParentPage = await RootPage.findByIdAndUpdate(parentPageId, {
        content: {
          ...parentPage?.content,
          [deletedBlock?.id]: deletedBlock,
        },
      });
      console.log(updateParentPage, "Parent page updated");

      //* Step 4 - Delete the entry from trash
      const deleteTrash = await TrashEntry.deleteOne({ pageId });
      return json({ message: "Page restored successfully" });
    }
  } catch (error) {
    console.error("Error saving editor content:", error);
    return json({ error: "Internal Server Error" }, { status: 500 });
  }
};
