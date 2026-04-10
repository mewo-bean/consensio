import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  children,
  className,
}: PageHeaderProps) {
  return (
    <header className={cn("border-b border-border/60 pb-6 mb-10", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 min-w-0">
          <SidebarTrigger className="-ml-1 h-10 w-10 shrink-0 bg-primary/10 text-primary hover:bg-primary/20 transition-colors rounded-lg" />
          <h1 className="text-3xl font-black tracking-tight leading-none truncate">
            {title}
          </h1>
        </div>

        <div className="hidden sm:flex items-center gap-2">{children}</div>
      </div>

      {description && (
        <p className="text-muted-foreground text-sm sm:text-base mt-3 pl-[52px] leading-relaxed max-w-3xl">
          {description}
        </p>
      )}
    </header>
  );
}
