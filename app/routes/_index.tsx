import type { MetaFunction } from "@remix-run/node";
import Editor from "~/components/Editor";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <main>
      <Editor/>
    </main>
  );
}

