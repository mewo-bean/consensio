import { Button } from  "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export function Guest() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
            <Card className="w-full max-w-md border-dashed">
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl font-bold">Consensio</CardTitle>
                    <CardDescription>
                        Для доступа необходимо войти или зарегистрироваться
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <div className="grid grid-cols-2 gap-4">
                        <Link href="/login" className="w-full">
                            <button className="w-full h-10 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors">
                                Войти
                            </button>
                        </Link>
                        <Link href="/signup" className="w-full">
                            <button className="w-full h-10 border border-input bg-background rounded-md font-medium hover:bg-accent hover:text-accent-foreground transition-colors">
                                Регистрация
                            </button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}