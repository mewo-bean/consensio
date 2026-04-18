"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";

export function CopyInviteButton({ inviteCode }: { inviteCode: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        const inviteLink = `${window.location.origin}/dashboard/invite/${inviteCode}`;
        const textToCopy = `Присоединяйся к моей команде в consensio!\nСсылка: ${inviteLink}\n(Или введи код вручную: ${inviteCode})`;

        await navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Button
            variant="outline"
            className="w-full gap-2 text-sm whitespace-normal h-auto py-2.5 sm:py-2 text-balance"
            onClick={handleCopy}
        >
            {copied ? (
                <>
                    <Check className="size-4 text-green-500 shrink-0" />{" "}
                    Скопировано!
                </>
            ) : (
                <>
                    <Copy className="size-4 shrink-0" /> Копировать инвайт
                </>
            )}
        </Button>
    );
}
