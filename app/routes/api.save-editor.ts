/* eslint-disable @typescript-eslint/no-explicit-any */
import { json } from "@remix-run/node";
import ChildPage from "~/module/models/childPage";
import RootPage from "~/module/models/rootPage";

import { Model, Document } from "mongoose";
import TrashEntry from "~/module/models/trashEntry";

// Define interfaces for your page's content structure.
interface ContentItem {
  id: string;
  props: {
    title: string;
    [key: string]: any;
  };
  [key: string]: any;
}

interface Block {
  value: ContentItem[];
  [key: string]: any;
}

interface PageContent {
  content: {
    [blockId: string]: Block;
  };
}

// The PageModelType extends Document with your PageContent interface.
type PageModelType = Model<PageContent & Document>;

/**
 * Helper function to update the content of a parent page.
 *
 * @param PageModel - The Mongoose model (RootPage or ChildPage).
 * @param parentId - The ID of the parent document.
 * @param parentPageBlockId - The block ID within the parent's content.
 * @param parentPageElementId - The element ID to update within the block.
 * @param title - The new title to set.
 * @returns A Promise that resolves to a boolean indicating if the update was performed.
 */
const updateParentContent = async (
  PageModel: PageModelType,
  parentId: string,
  parentPageBlockId: string,
  parentPageElementId: string,
  title: string
): Promise<boolean> => {
  const parentPage = await PageModel.findById(parentId);
  if (parentPage && parentPage.content?.[parentPageBlockId]) {
    const updatedContent = {
      ...parentPage.content,
      [parentPageBlockId]: {
        ...parentPage.content[parentPageBlockId],
        value: parentPage.content[parentPageBlockId].value.map((item: ContentItem) =>
          item.id === parentPageElementId
            ? { ...item, props: { ...item.props, title } }
            : item
        ),
      },
    };
    await PageModel.findByIdAndUpdate(parentId, { content: updatedContent });
    return true;
  }
  return false;
};

const storeDeletedPage = async (trashEntry) => {
  const pageId = trashEntry?.pageId;
  const addToTrash = await TrashEntry.create(trashEntry);

  const page = await ChildPage.findByIdAndUpdate(pageId,{isDeleted:true,deletedAt:new Date()})
  console.log(addToTrash,'Trash Added');
  console.log(page,'Page Updated');
}

export const action = async ({ request }: { request: Request }) => {
  try {
    const { content, contentId, title } = await request.json();

    // If there's no contentId, create a new RootPage.
    if (!contentId) {
      const newRootPage = await RootPage.create({ title, content });
      return json({
        success: true,
        message: "Content saved successfully",
        data: newRootPage,
      });
    }
    let existingPage;

    existingPage = await RootPage.findById(contentId)

    if(!existingPage){
      existingPage = await ChildPage.findById(contentId)
    }

    // Attempt to update the content in RootPage.
    let updatedContent = await RootPage.findOneAndUpdate(
      { _id: contentId },
      { content, title },
      { new: true }
    );

    // If not found in RootPage, try updating ChildPage.
    if (!updatedContent) {
      updatedContent = await ChildPage.findOneAndUpdate(
        { _id: contentId },
        { content, title },
        { new: true }
      );

      // If a ChildPage is updated, update its parent.
      if (updatedContent) {
        const { parentId, parentPageBlockId, parentPageElementId } = updatedContent;
        // Try updating in RootPage first.
        const parentUpdated = await updateParentContent(
          RootPage,
          parentId,
          parentPageBlockId,
          parentPageElementId,
          title
        );
        // If not updated in RootPage, try updating in ChildPage.
        if (!parentUpdated) {
          await updateParentContent(
            ChildPage,
            parentId,
            parentPageBlockId,
            parentPageElementId,
            title
          );
        }
      }
    }

    if (!updatedContent) {
      return json({ error: "Content not found" }, { status: 404 });
    }



    // Compare previous content (from DB) with new content (from request).
    const previousContent = existingPage.content || {};
    const newContent = content || {};

    // Get keys for blocks in previous content.
    const previousKeys = Object.keys(previousContent);
    // Get keys for blocks in new content.
    const newKeys = Object.keys(newContent);

    // Find block keys that existed before but are missing now.
    const deletedKeys = previousKeys.filter((key) => !newKeys.includes(key));

    // For each deleted block, check if its type is "Page" and store it in trash.
    for (const key of deletedKeys) {
      const deletedBlock = previousContent[key];
      // Loop through the block's items (since value is an array)
      deletedBlock.value.forEach(async (item: ContentItem) => {
        if (item.type === "page") {
        const trashEntry = {
          pageId: item.props.pageId, // the deleted page's _id,
          parentId: item.props.parentId, // the parent page ID
          order: deletedBlock?.meta?.order,
          deletedAt: Date.now(),
          element: item,
        };
        await storeDeletedPage(trashEntry);
        }
      });
    }

    return json({
      success: true,
      message: "Content updated successfully",
      data: updatedContent,
    });
  } catch (error) {
    console.error("Error saving editor content:", error);
    return json({ error: "Internal Server Error" }, { status: 500 });
  }
};