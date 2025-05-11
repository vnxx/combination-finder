import { cn } from "@/lib/utils";

const Container = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("container max-w-3xl mx-auto px-4", className)}>
      {children}
    </div>
  );
};

export { Container };
