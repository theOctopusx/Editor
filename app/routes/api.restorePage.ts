import { json } from "@remix-run/react";
import ChildPage from "~/module/models/childPage";
import RootPage from "~/module/models/rootPage";
import TrashEntry from "~/module/models/trashEntry";

export const action = async ({ request }: { request: Request }) => {
    try {
    
        const { pageId } = await request.json();
        console.log(pageId,"page id");
        const parent = await RootPage.findById(pageId)
        if(parent){
            const result = await RootPage.findByIdAndUpdate(pageId,{isDeleted:false,deletedAt:null})
            const updateChildCollection = await ChildPage.find({parentId:pageId}).updateMany({isDeleted:false,deletedAt:null})
            const deleteTrash = await TrashEntry.deleteMany({parentId:pageId})
            console.log(deleteTrash,'Childe deleted from trash');
            return json({result})
        }
        else{
            const result = await ChildPage.findByIdAndUpdate(pageId,{isDeleted:false,deletedAt:null})
            const updateChildCollection = await ChildPage.find({parentId:pageId}).updateMany({isDeleted:false,deletedAt:null})
        }
        // console.log(result,'Root Delete update');
        // console.log(updateChildCollection,'Child Collection update');
      }
      catch (error) {
          console.error("Error saving editor content:", error);
          return json({ error: "Internal Server Error" }, { status: 500 });
    }
};
