import { cn } from "@/lib/utils";
interface SectionWrapperProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
}
export function SectionWrapper({
  children,
  id,
  className,
}: SectionWrapperProps) {
  return (
    <section
      id={id}
      className={cn("relative px-4 py-20 sm:px-6 lg:px-8", className)}
    >
      <div className="mx-auto max-w-screen-xl">{children}</div>
    </section>
  );
}
