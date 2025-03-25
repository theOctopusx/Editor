import { json } from "@remix-run/react";
import ChildPage from "~/module/models/childPage";
import RootPage from "~/module/models/rootPage";


export const action = async ({ request }: { request: Request }) => {
    try {
    
      const { pageId } = await request.json();
      const result = await RootPage.findByIdAndUpdate(pageId,{isDeleted:true,deletedAt:new Date()})
      const updateChildCollection = await ChildPage.find({parentId:pageId}).updateMany({isDeleted:true,deletedAt:new Date()})
      console.log(result,'Root Delete update');
      console.log(updateChildCollection,'Child Collection update');
      return json({result})
    }
    catch (error) {
        console.error("Error saving editor content:", error);
        return json({ error: "Internal Server Error" }, { status: 500 });
      }
};
