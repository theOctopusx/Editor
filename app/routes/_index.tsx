import { type MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { Button } from "~/components/ui/button";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};



export default function Index() {
  return (
    <main className="h-screen w-full flex justify-center items-center">
      <Link to="/dashboard">
      <Button>Dashboard</Button>
      </Link>
    </main>
  );
}

