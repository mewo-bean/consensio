import { SidebarTrigger } from "@/components/ui/sidebar";

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <header className="border-b border-border/60 pb-5 mb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <SidebarTrigger className="-ml-2 h-9 w-9 shrink-0" />
          <h1 className="text-3xl font-black tracking-tight leading-none truncate">
            {title}
          </h1>
        </div>

        <div className="hidden sm:flex items-center gap-2">{children}</div>
      </div>

      {description && (
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl leading-relaxed mt-2.5">
          {description}
        </p>
      )}

      {children && (
        <div className="flex sm:hidden items-center gap-2 w-full pt-4">
          {children}
        </div>
      )}
    </header>
  );
}
