import { json, LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import RootPage from "~/module/models/rootPage";
import TrashEntry from "~/module/models/trashEntry";

export const loader: LoaderFunction = async () => {
  try {
    // Fetch all documents (modify as needed)
    const editorContents = await RootPage.find({isDeleted:true});
    const trashContents = await TrashEntry.find()
    return json({ success: true, rootPageTrash: editorContents,childpageTrash:trashContents });
  } catch (error) {
    console.error("Error fetching editor content:", error);
    return json(
      { success: false, error: "Failed to fetch data" },
      { status: 500 }
    );
  }
};

const Trash = () => {
    const {rootPageTrash,childpageTrash} = useLoaderData()
    // console.log(childpageTrash);
    const childPage = childpageTrash.map(page => page?.element?.props)
    console.log(childPage);
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Page List</h2>
      <ul className="space-y-2">
        {rootPageTrash?.map((page) => (
          <li key={page._id} className="border-b pb-2">
            <Link to={`/dashboard/content/${page._id}`} className="text-blue-500 hover:underline">
              {page.title}
            </Link>
          </li>
        ))}
      </ul>
      <h2 className="text-xl font-semibold my-4">Child Page List</h2>
      <ul className="space-y-2">
        {childPage?.map((page) => (
          <li key={page?.pageId} className="border-b pb-2">
            <Link to={`/dashboard/content/${page?.pageId}`} className="text-blue-500 hover:underline">
              {page?.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Trash