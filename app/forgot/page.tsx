import { ForgotForm } from "@/components/forgot-form"

export default function ForgotPasswordPage() {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
            <ForgotForm />
        </div>
    )
}