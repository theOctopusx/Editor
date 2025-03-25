import { json } from "@remix-run/react";
import ChildPage from "~/module/models/childPage";
import RootPage from "~/module/models/rootPage";
import TrashEntry from "~/module/models/trashEntry";

// Recursive helper to restore nested child pages
const restoreChildren = async (parentId: string) => {
  const children = await ChildPage.find({ parentId });
  if (!children.length) return;
  for (const child of children) {
    // Restore this child page
    await ChildPage.findByIdAndUpdate(child._id, {
      isDeleted: false,
      deletedAt: null,
    });
    // Recursively restore any nested children
    await restoreChildren(child._id);
  }
};

export const action = async ({ request }: { request: Request }) => {
  try {
    const { pageId } = await request.json();
    console.log(pageId, "page id");

    // Check if the page is a RootPage
    const parent = await RootPage.findById(pageId);
    if (parent) {
      // Restore the parent/root page
      const result = await RootPage.findByIdAndUpdate(pageId, {
        isDeleted: false,
        deletedAt: null,
      });
      // Restore immediate child pages
      await ChildPage.updateMany(
        { parentId: pageId },
        { isDeleted: false, deletedAt: null }
      );
      // Recursively restore any nested child pages
      await restoreChildren(pageId);
      // Remove all trash entries related to this parent page
      await TrashEntry.deleteMany({ parentId: pageId });
      return json({ result });
    } else {
      // Restore a ChildPage
      const result = await ChildPage.findByIdAndUpdate(pageId, {
        isDeleted: false,
        deletedAt: null,
      });
      // Restore immediate child pages
      await ChildPage.updateMany(
        { parentId: pageId },
        { isDeleted: false, deletedAt: null }
      );
      // Recursively restore any nested child pages
      await restoreChildren(pageId);

      // Restore the deleted block into the parent page content
      const deletedTrash = await TrashEntry.findOne({ pageId });
      const deletedBlock = deletedTrash?.deletedBlock;
      const parentPageId = deletedTrash?.parentId;
      console.log("Deleted block", deletedBlock);
      console.log("Parent page id", parentPageId);

      let parentPage = await RootPage.findOne({ _id: parentPageId });
      if (!parentPage) {
        parentPage = await ChildPage.findOne({ _id: parentPageId });
      }
      console.log("Parent page", parentPage);

      let updateParentPage = await RootPage.findByIdAndUpdate(parentPageId, {
        content: {
          ...parentPage?.content,
          [deletedBlock?.id]: deletedBlock,
        },
      });
      if (!updateParentPage) {
        updateParentPage = await ChildPage.findByIdAndUpdate(parentPageId, {
          content: {
            ...parentPage?.content,
            [deletedBlock?.id]: deletedBlock,
          },
        });
      }
      console.log(updateParentPage, "Parent page updated");

      // Remove the trash entry for the restored page
      await TrashEntry.deleteOne({ pageId });
      return json({ message: "Page restored successfully" });
    }
  } catch (error) {
    console.error("Error restoring page:", error);
    return json({ error: "Internal Server Error" }, { status: 500 });
  }
};
