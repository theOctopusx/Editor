import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import ChildPage from "~/module/models/childPage";
import RootPage from "~/module/models/rootPage";
import NotionLikePageEditor from "~/page/NotionLikePageEditor";

export const loader: LoaderFunction = async ({ params }) => {
  try {
    const { id } = params;
    if (!id) {
      return json({ success: false, error: "ID is required" }, { status: 400 });
    }

    // Try to find the document in RootPage first
    let editorContent = await RootPage.findOne({ _id: id });

    // If not found, check in ChildPage
    if (!editorContent) {
      editorContent = await ChildPage.findOne({ _id: id });
    }

    if (!editorContent) {
      return json(
        { success: false, error: "Content not found" },
        { status: 404 }
      );
    }

    return json({ success: true, data: editorContent });
  } catch (error) {
    console.error("Error fetching editor content:", error);
    return json(
      { success: false, error: "Failed to fetch data" },
      { status: 500 }
    );
  }
};

export const action = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const parentId = formData.get("parentId");
  const parentPageBlockId = formData.get("parentPageBlockId");
  const parentPageElementId = formData.get("parentPageElementId");

  const result = await ChildPage.create({
    title: "Untitled Child Page",
    content: {},
    parentId,
    parentPageBlockId,
    parentPageElementId,
  });

  return new Response(
    JSON.stringify({ title: result.title, id: result._id, ...result.toJSON() }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

const PageContent = () => {
  const { data } = useLoaderData<typeof loader>();
  // const [trashNotification, setTrashNotification] = useState(data?.isDeleted)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);

  const handleDeletePermanently = () => {
    // console.log(pageId);
    if (data.parentId) {
      console.log(data.parentId);
    } else {
      console.log(data._id);
    }
  };
  const handleRestore = async () => {
    try {
      await fetch("/api/restorePage", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pageId: data._id,
        }),
      });
      console.log("Page restored successfully");
    } catch (error) {
      console.log(error);
    }
    finally{
      setRestoreDialogOpen(false)
    }
  };
  return (
    <div>
      {data?.isDeleted && (
        <Alert className="fixed top-0 left-0 right-0 z-50 bg-destructive text-destructive-foreground border-none">
          <AlertDescription className="flex items-center justify-between w-full">
            <span>
              Moved this page to Trash just now. It will automatically be
              deleted in 30 days.
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="bg-transparent text-white border-white hover:bg-white/20 hover:text-white"
                onClick={() => {
                  return setRestoreDialogOpen(true);
                  // const page = pages?.find((p) => p._id === trashNotification.pageId)
                  // if (page) openRestoreDialog(page)
                }}
              >
                Restore page
              </Button>
              {/* <Button
                variant="outline"
                size="sm"
                className="bg-transparent text-white border-white hover:bg-white/20 hover:text-white"
                onClick={() => {
                  setDeleteDialogOpen(true);
                  // const page = pages?.find((p) => p._id === trashNotification.pageId)
                  // if (page) openDeleteDialog(page)
                }}
              >
                Delete from Trash
              </Button> */}
            </div>
          </AlertDescription>
        </Alert>
      )}
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete permanently?</DialogTitle>
            <DialogDescription>
              This page will be permanently deleted and cannot be recovered.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeletePermanently}>
              Delete permanently
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Restore Confirmation Dialog */}
      <Dialog open={restoreDialogOpen} onOpenChange={setRestoreDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Restore page?</DialogTitle>
            <DialogDescription>
              This page will be restored to your workspace.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRestoreDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleRestore}>Restore page</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <NotionLikePageEditor />
    </div>
  );
};

export default PageContent;
