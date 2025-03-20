import React, { createContext, useContext, useState } from "react";

interface Page {
  _id: string;
  title: string;
  content: string;
  emoji?: string;
  workspace?: string;
}

interface PageContextType {
  pages: Page[];
  updatePageTitle: (id: string, newTitle: string) => void;
  setNewPages: (newPages: Page[]) => void;
}

const PageContext = createContext<PageContextType | undefined>(undefined);

export const PageProvider = ({
  children,
  initialPages,
}: {
  children: React.ReactNode;
  initialPages: Page[];
}) => {
  const [pages, setPages] = useState<Page[]>(initialPages);

  const updatePageTitle = (id: string, newTitle: string) => {
    setPages((prevPages) =>
      prevPages.map((page) =>
        page._id === id ? { ...page, title: newTitle } : page
      )
    );
  };

  const setNewPages = (newPages: Page[]) => {
    setPages(newPages);
  };

  const value = React.useMemo(
    () => ({
      pages,
      updatePageTitle,
      setNewPages,
    }),
    [pages]
  );

  return <PageContext.Provider value={value}>{children}</PageContext.Provider>;
};
export const usePageContext = () => {
  const context = useContext(PageContext);
  if (!context) {
    throw new Error("usePageContext must be used within a PageProvider");
  }
  return context;
};
