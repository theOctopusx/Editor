/* eslint-disable @typescript-eslint/no-explicit-any */
import { json } from "@remix-run/node";
import ChildPage from "~/module/models/childPage";
import RootPage from "~/module/models/rootPage";

import { Model, Document } from "mongoose";

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
