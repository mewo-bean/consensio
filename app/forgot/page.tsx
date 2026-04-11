import { ForgotForm } from "@/components/forgot-form"

export default function ForgotPasswordPage() {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
            <a href="/" className="flex items-center gap-2 self-center font-medium">
                <h1 className="text-5xl font-extrabold tracking-tight text-primary justify-end">
                    consensio.
                </h1>
            </a>
            <ForgotForm />
        </div>
    )
}