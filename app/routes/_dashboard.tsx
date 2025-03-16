import * as React from "react"
import { ChevronDown, FilePlus, Home, MoreHorizontal, Search, Settings } from "lucide-react"
import { nanoid } from "nanoid"
import { Button } from "~/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "~/components/ui/collapsible"
import { Input } from "~/components/ui/input"
import {
  Sidebar,
  SidebarContent,
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
} from "~/components/ui/sidebar"
import { Link, Outlet, useFetcher, useLoaderData, useParams } from "@remix-run/react"
import { json, LoaderFunction } from "@remix-run/node"
import { EditorContent } from "~/module/editor/model"

// Define the Page type
interface Page {
  id: string
  title: string
  content: string
  emoji?: string
  workspace?: string
}

export const loader: LoaderFunction = async () => {
    try {
      
      // Fetch all documents (modify as needed)
      const editorContents = await EditorContent.find();
  
      return json({ success: true, data: editorContents });
    } catch (error) {
      console.error("Error fetching editor content:", error);
      return json({ success: false, error: "Failed to fetch data" }, { status: 500 });
    }
  };

export default function Dashboard() {
  const fetcher = useFetcher(); 
  console.log(fetcher);
  const { data: pages } = useLoaderData<typeof loader>();
  // console.log(data);

  // const [pages, setPages] = React.useState(data?.map((page: { _id: string; title: string }) => ({
  //   id: page._id,
  //   title: page.title,
  //   emoji: "👋",
  //   workspace: "Personal"
  // })) || []);
  console.log(pages);

  const [selectedPage, setSelectedPage] = React.useState<Page | null>(pages[0]);

  const createPage = async () => {
    const newPage = { id: nanoid(), title: "Untitled", content: {}, workspace: "Personal" };

    try {
      await fetcher.submit(
        { title: newPage.title, content: newPage.content },
        { method: "POST", action: "/api/createPage" }
      );

      // 🔄 Refetch data after new page is added
      fetcher.load(location.pathname);
    } catch (error) {
      console.error("Error creating page:", error);
    }
  };

  // 🔄 Update state when new data is fetched
  React.useEffect(() => {
    if (fetcher.data?.data) {
      // setPages(data);
      setSelectedPage(fetcher.data.data[0] || null);

    }
  }, [fetcher.data]);
   // State for workspaces
   const [workspaces] = React.useState([
    { name: "Personal", emoji: "🏠" },
    // { name: "Work", emoji: "💼" },
  ])

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <NotionSidebar
          pages={pages}
          workspaces={workspaces}
          selectedPage={selectedPage}
          onSelectPage={setSelectedPage}
          onCreatePage={createPage}
        />
        <SidebarInset>
          <header className="sticky top-0 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6">
            <SidebarTrigger />
            <div className="flex flex-1 items-center justify-between">
              <div className="flex items-center gap-2">
                {selectedPage && (
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{selectedPage.emoji || "📄"}</span>
                    <h1 className="text-lg font-medium">{selectedPage.title}</h1>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Settings className="h-4 w-4" />
                  <span className="sr-only">Settings</span>
                </Button>Welcome to your workspace! This is your first page.
              </div>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-4 sm:p-6">
           {/* // {selectedPage ? ( */}
              <div className="mx-auto max-w-4xl">
                <Outlet/>
              </div>
            {/* // ) : (
            //   <div className="flex h-full items-center justify-center">
            //     <p className="text-muted-foreground">Select a page or create a new one</p>
            //   </div>
            // )} */}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}

interface NotionSidebarProps {
  pages: Page[]
  workspaces: { name: string; emoji: string }[]
  selectedPage: Page | null
  onSelectPage: (page: Page) => void
  onCreatePage: () => void
}

function NotionSidebar({ pages, workspaces, selectedPage, onSelectPage}: NotionSidebarProps) {
  const [searchQuery, setSearchQuery] = React.useState("")
  const fetcher = useFetcher();

  // const filteredPages = searchQuery
  //   ? pages.filter((page) => page.title.toLowerCase().includes(searchQuery.toLowerCase()))
  //   : pages

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
                <fetcher.Form action="/api/createPage" method="POST" className="flex items-center">
                <button 
                  type="submit"
                  className="w-full flex items-center gap-x-2">
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
  )
}

interface WorkspaceGroupProps {
  workspace: { name: string; emoji: string }
  pages: Page[]
  selectedPage: Page | null
  onSelectPage: (page: Page) => void
}

function WorkspaceGroup({ workspace, pages}: WorkspaceGroupProps) {
  const {id} = useParams()
  console.log("pages", pages);
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
              {pages.map((page) => (
                <SidebarMenuItem key={page._id}>
                  <SidebarMenuButton asChild isActive={id === page._id}>
                    <Link 
                    to={`/dashboard/content/${page._id}`}

                    // onClick={() => onSelectPage(page)} 
                    className="w-full">
                      <span>{page?.emoji || "📄"}</span>
                      <span>{page.title}</span>
                    </Link>
                  </SidebarMenuButton>
                  <SidebarMenuAction showOnHover>
                    <MoreHorizontal className="h-4 w-4" />
                  </SidebarMenuAction>
                </SidebarMenuItem>
              ))}
              {/* <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <button className="w-full text-muted-foreground">
                    <Plus className="h-4 w-4" />
                    <span>Add a page</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem> */}
            </SidebarMenu>
          </SidebarGroupContent>
        </CollapsibleContent>
      </Collapsible>
    </SidebarGroup>
  )
}

