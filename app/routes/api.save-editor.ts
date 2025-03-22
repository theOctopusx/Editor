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
