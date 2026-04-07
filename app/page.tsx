import { auth } from "@/auth"
import { Guest } from "@/components/guest"
import UserClient from "./user_client"

export default async function Page() {
    // Проверка сессии на сервере (мгновенно и надежно)
    const session = await auth()

    if (!session) {
        return <Guest />
    }

    return <UserClient user={session.user} />
}