import { json } from "@remix-run/node";
import ChildPage from "~/module/models/childPage";
import RootPage from "~/module/models/rootPage";

export const action = async ({ request }: { request: Request }) => {
  try {
    const body = await request.json();
    const { content, contentId, title } = body;

    if (!contentId) {
      const saveToDb = await RootPage.create({ title, content });
      return json({
        success: true,
        message: "Content saved successfully",
        data: saveToDb,
      });
    }

    let updatedContent = await RootPage.findOneAndUpdate(
      { _id: contentId },
      { content, title },
      { new: true }
    );

    if (!updatedContent) {
      updatedContent = await ChildPage.findOneAndUpdate(
        { _id: contentId },
        { content, title },
        { new: true }
      );
      const parentId = await updatedContent.parentId;
      const parentBlockId = await updatedContent.parentPageBlockId;
      const parentPageElementId = await updatedContent.parentPageElementId
      // console.log(parentId,'parent id');
      const parent = await RootPage.findById(parentId)

      const previousTitle = await (parent?.content?.[parentBlockId]?.value?.find(
        item => item.id === parentPageElementId
      )?.props?.title);
      console.log(previousTitle, 'title');
      
      // Create an updated version of the full parent's content.
      const updatedParentContent = {
        ...parent.content,
        [parentBlockId]: {
          ...parent.content[parentBlockId],
          value: parent.content[parentBlockId].value.map(item => {
            if (item.id === parentPageElementId) {
              return {
                ...item,
                props: {
                  ...item.props,
                  title: title, // replacing previousTitle with the new title value
                },
              };
            }
            return item;
          }),
        },
      };
      
      await RootPage.findByIdAndUpdate(parentId,{content:updatedParentContent})
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
