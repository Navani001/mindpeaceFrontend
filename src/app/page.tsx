import { auth } from "@/utils";
import { redirect } from "next/navigation";

export default async function Home() {
  const data: any = await auth();
  
  // Redirect to login if not authenticated
  if (!data?.user) {
    redirect("/login");
  }

  return (
   <div>hi</div>
  );
}
