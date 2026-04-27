import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { User, Mail } from "lucide-react";
import NotificationSettings from "@/components/settings/NotificationSettings";
import LogoutButton from "@/components/settings/LogoutButton";
import { ModeToggle } from "@/components/settings/ModeToggle";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default async function ProfilePage() {
    const session = await auth();
    if (!session?.user) redirect("/login");

    const user = session.user;

    return (
        <div className="container mx-auto max-w-3xl px-4 py-8">
            <Card className="mb-8">
                <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                        <SidebarTrigger className="md:hidden -ml-2 h-10 w-10 shrink-0 bg-primary/10 text-primary hover:bg-primary/20 transition-colors rounded-lg" />

                        <div className="rounded-full bg-primary/10 p-3">
                            <User className="h-6 w-6 text-primary" />
                        </div>
                        <div className="space-y-1 flex-1">
                            <h1 className="text-xl font-semibold">
                                {user.username || "Пользователь"}
                            </h1>
                            {/*<p className="text-sm text-muted-foreground flex items-center gap-1">*/}
                            {/*    <Mail className="h-3 w-3" />*/}
                            {/*    {user.email}*/}
                            {/*</p>*/}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <NotificationSettings />

            <ModeToggle />

            <div className="mt-8 flex justify-end">
                <LogoutButton />
            </div>
        </div>
    );
}
