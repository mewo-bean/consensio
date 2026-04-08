"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";

export function CopyInviteButton({ teamId }: { teamId: number }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const inviteLink = `${window.location.origin}/dashboard/invite/${teamId}`;
    const textToCopy = `Присоединяйся к моей команде в consensio!\nСсылка: ${inviteLink}\n(Или введи ID вручную: ${teamId})`;

    await navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button
      variant="outline"
      className="w-full gap-2 text-xs"
      onClick={handleCopy}
    >
      {copied ? (
        <>
          <Check className="size-3 text-green-500" /> Скопировано!
        </>
      ) : (
        <>
          <Copy className="size-3" /> Копировать инвайт
        </>
      )}
    </Button>
  );
}
