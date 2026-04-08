import { auth } from "@/auth";
import { Guest } from "@/components/guest";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await auth();

  if (!session?.user) {
    return <Guest />;
  }

  redirect("/dashboard");
}
