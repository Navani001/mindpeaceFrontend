import { Chatbot } from "@/component";
import { SideBar } from "@/component/sidebar";
import { use } from "react";


export default function Home({ params }: any) {
  const unwrappedParams = use(params);
  const { id } = unwrappedParams as { id: string };

  return (
    <div className="flex h-screen w-screen">
      <SideBar />
      <Chatbot id={id} />
    </div>
  )
}
