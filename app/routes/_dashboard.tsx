import * as React from "react";
import {
  ChevronDown,
  Copy,
  Edit,
  FilePlus,
  Home,
  MoreHorizontal,
  Search,
  Settings,
  Share2,
  Trash,
  Trash2,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import { Input } from "~/components/ui/input";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "~/components/ui/sidebar";
import {
  Link,
  Outlet,
  useFetcher,
  useLoaderData,
  useNavigate,
  useParams,
} from "@remix-run/react";
import { json, LoaderFunction } from "@remix-run/node";
import { PageProvider, usePageContext } from "~/hooks/use-dashboard";
import RootPage from "~/module/models/rootPage";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "~/components/ui/dropdown-menu";
import { toast } from "sonner";

// Define the Page type
interface Page {
  _id: string;
  title: string;
  content: string;
  emoji?: string;
  workspace?: string;
}

export const loader: LoaderFunction = async () => {
  try {
    // Fetch all documents (modify as needed)
    const editorContents = await RootPage.find({isDeleted:false});

    return json({ success: true, data: editorContents });
  } catch (error) {
    console.error("Error fetching editor content:", error);
    return json(
      { success: false, error: "Failed to fetch data" },
      { status: 500 }
    );
  }
};

export default function Dashboard() {
  const fetcher = useFetcher();
  const { data: pages } = useLoaderData<typeof loader>();

  const [selectedPage, setSelectedPage] = React.useState<Page | null>(pages[0]);

  // 🔄 Update state when new data is fetched
  React.useEffect(() => {
    if (fetcher.data?.data) {
      setSelectedPage(fetcher.data.data[0] || null);
    }
  }, [fetcher.data]);
  // State for workspaces
  const [workspaces] = React.useState([
    { name: "Personal", emoji: "🏠" },
    // { name: "Work", emoji: "💼" },
  ]);

  return (
    <PageProvider initialPages={pages}>
      <SidebarProvider>
        <div className="flex h-screen w-full">
          <NotionSidebar
            // pages={pages}
            workspaces={workspaces}
            selectedPage={selectedPage}
            onSelectPage={setSelectedPage}
          />
          <SidebarInset>
            <header className="sticky top-0 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6">
              <SidebarTrigger />
              <div className="flex flex-1 items-center justify-between">
                <div className="flex items-center gap-2">
                  {selectedPage && (
                    <div className="flex items-center gap-2">
                      <span className="text-xl">
                        {selectedPage.emoji || "📄"}
                      </span>
                      <h1 className="text-lg font-medium">
                        {selectedPage.title}
                      </h1>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon">
                    <Settings className="h-4 w-4" />
                    <span className="sr-only">Settings</span>
                  </Button>
                  Welcome to your workspace! This is your first page.
                </div>
              </div>
            </header>
            <main className="flex-1 overflow-auto p-4 sm:p-6">
              <div className="mx-auto">
                <Outlet />
              </div>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </PageProvider>
  );
}

interface NotionSidebarProps {
  // pages: Page[];
  workspaces: { name: string; emoji: string }[];
  selectedPage: Page | null;
  onSelectPage: (page: Page) => void;
}

function NotionSidebar({
  // pages,
  workspaces,
  selectedPage,
  onSelectPage,
}: NotionSidebarProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const fetcher = useFetcher();
  const { data: pages } = useLoaderData<typeof loader>();

  const { setNewPages } = usePageContext();

  React.useEffect(() => {
    if (pages) {
      setNewPages(pages);
    }
  }, [pages]);

  return (
    <Sidebar>
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              N
            </div>
            <span className="font-semibold">Octopus X</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <div className="px-3 py-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search pages..."
                className="w-full pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <fetcher.Form
                  action="/api/createRootPage"
                  method="POST"
                  className="flex items-center"
                >
                  <button
                    type="submit"
                    className="w-full flex items-center gap-x-2"
                  >
                    <FilePlus className="h-4 w-4" />
                    <span>Create new page</span>
                  </button>
                </fetcher.Form>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <button className="w-full">
                  <Home className="h-4 w-4" />
                  <span>Home</span>
                </button>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        {workspaces.map((workspace) => (
          <WorkspaceGroup
            key={workspace.name}
            workspace={workspace}
            pages={pages}
            // pages={filteredPages.filter((page) => page.workspace === workspace.name)}
            selectedPage={selectedPage}
            onSelectPage={onSelectPage}
          />
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}

interface WorkspaceGroupProps {
  workspace: { name: string; emoji: string };
  pages: Page[];
  selectedPage: Page | null;
  onSelectPage: (page: Page) => void;
}

function WorkspaceGroup({ workspace, pages: initialPage }: WorkspaceGroupProps) {
  const { id } = useParams()
  const { pages,setNewPages } = usePageContext()
  const pagesData = pages ? pages : initialPage
  const navigate = useNavigate();

  const handleDelete = async (pageId: string) => {
    // Implement delete functionality
    console.log("Delete page:", pageId)
    try {
      await fetch("/api/deleteRootPage", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pageId,
        }),
      });
      toast.success('SuccessFully Deleted Root Page')
      setNewPages(pages.filter(page => page._id !==pageId))
      navigate('/dashboard')
    } catch (error) {
      console.error("Error saving content:", error);
    }
  }

  const handleShare = (pageId: string) => {
    // Implement share functionality
    console.log("Share page:", pageId)
  }

  const handleDuplicate = (pageId: string) => {
    // Implement duplicate functionality
    console.log("Duplicate page:", pageId)
  }

  const handleEdit = (pageId: string) => {
    // Implement edit functionality
    console.log("Edit page:", pageId)
  }

  return (
    <SidebarGroup>
      <Collapsible defaultOpen className="group/collapsible">
        <SidebarGroupLabel asChild>
          <CollapsibleTrigger className="flex w-full items-center justify-between">
            <div className="flex items-center gap-2">
              <span>{workspace.emoji}</span>
              <span>{workspace.name}</span>
            </div>
            <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
          </CollapsibleTrigger>
        </SidebarGroupLabel>
        <CollapsibleContent>
          <SidebarGroupContent>
            <SidebarMenu>
              {pagesData.map((page) => (
                <SidebarMenuItem key={page._id}>
                  <SidebarMenuButton asChild isActive={id === page._id}>
                    <Link to={`/dashboard/content/${page._id}`} className="w-full">
                      <span>{page?.emoji || "📄"}</span>
                      <span>{page.title}</span>
                    </Link>
                  </SidebarMenuButton>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <SidebarMenuAction showOnHover>
                        <MoreHorizontal className="h-4 w-4" />
                      </SidebarMenuAction>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="right" align="start" className="w-48">
                      <DropdownMenuItem onClick={() => handleEdit(page._id)}>
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Edit</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleShare(page._id)}>
                        <Share2 className="mr-2 h-4 w-4" />
                        <span>Share</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDuplicate(page._id)}>
                        <Copy className="mr-2 h-4 w-4" />
                        <span>Duplicate</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDelete(page._id)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </CollapsibleContent>
      </Collapsible>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild 
              // isActive={location.pathname === "/dashboard/trash"}
            >
              <Link to="/dashboard/trash" className="flex items-center justify-between">
                <div className="flex items-center">
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span>Trash</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </SidebarGroup>
  )
}
