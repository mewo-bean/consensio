"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";

export function CopyInviteButton({ inviteCode }: { inviteCode: string }) {
    const [copied, setCopied] = useState(false);

    const fallbackCopyTextToClipboard = (text: string) => {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.top = "-999999px";
        textArea.style.left = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            document.execCommand("copy");
        } catch (err) {
            console.error("Ошибка при копировании", err);
        }
        document.body.removeChild(textArea);
    };

    const handleCopy = async () => {
        const inviteLink = `${window.location.origin}/dashboard/invite/${inviteCode}`;
        const textToCopy = `Присоединяйся к моей команде в consensio!\nСсылка: ${inviteLink}\n(Или введи код вручную: ${inviteCode})`;

        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(textToCopy);
        } else {
            fallbackCopyTextToClipboard(textToCopy);
        }

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
