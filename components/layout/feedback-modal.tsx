"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { submitAppFeedback } from "@/app/actions/app-feedback";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export function FeedbackModal({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async () => {
        if (rating === 0) return;

        setIsSubmitting(true);
        const result = await submitAppFeedback(rating, comment);
        setIsSubmitting(false);

        if (result.error) {
            alert(result.error);
        } else {
            setIsSuccess(true);
            setTimeout(() => {
                setIsOpen(false);
                // Сбрасываем стейт после закрытия
                setTimeout(() => {
                    setIsSuccess(false);
                    setRating(0);
                    setComment("");
                }, 300);
            }, 2000);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-106.25">
                <DialogHeader>
                    <DialogTitle>Обратная связь</DialogTitle>
                </DialogHeader>

                {isSuccess ? (
                    <div className="py-6 text-center space-y-3">
                        <div className="inline-flex items-center justify-center size-12 rounded-full bg-green-100 text-green-600 mb-2">
                            <Star className="size-6 fill-current" />
                        </div>
                        <h3 className="font-bold text-lg">Спасибо за отзыв!</h3>
                        <p className="text-sm text-muted-foreground">
                            Мы обязательно учтем ваши комментарии.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6 py-4">
                        <div className="flex flex-col items-center gap-3">
                            <span className="text-sm font-medium">
                                Как вы оцениваете платформу?
                            </span>
                            <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        className="p-1 transition-transform hover:scale-110 active:scale-95"
                                        onMouseEnter={() => setHover(star)}
                                        onMouseLeave={() => setHover(0)}
                                        onClick={() => setRating(star)}
                                    >
                                        <Star
                                            className={cn(
                                                "size-8 transition-colors",
                                                (hover || rating) >= star
                                                    ? "fill-yellow-400 text-yellow-400"
                                                    : "fill-muted text-muted-foreground/30",
                                            )}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Комментарий (необязательно)
                            </label>
                            <Textarea
                                placeholder="Что вам нравится? Чего не хватает?"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                className="resize-none min-h-[100px]"
                            />
                        </div>

                        <Button
                            className="w-full"
                            onClick={handleSubmit}
                            disabled={rating === 0 || isSubmitting}
                        >
                            {isSubmitting ? "Отправка..." : "Отправить отзыв"}
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
