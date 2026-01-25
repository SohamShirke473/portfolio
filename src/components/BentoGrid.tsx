import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}) => {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto",
        className,
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  icon,
  className_inner,
  href,
}: {
  className?: string;
  title?: string | ReactNode;
  description?: string | ReactNode;
  header?: ReactNode;
  icon?: ReactNode;
  className_inner?: string;
  href?: string;
}) => {
  const Wrapper = ({
    children,
    className,
    href,
  }: {
    children: ReactNode;
    className?: string;
    href?: string;
  }) => {
    return href ? (
      <a href={href} className={className} target="_blank">
        {children}
      </a>
    ) : (
      <div className={className}>{children}</div>
    );
  };
  return (
    <Wrapper
      href={href}
      className={cn(
        "border-2 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 justify-between flex flex-col space-y-4 transition duration-200 group/bento hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 overflow-hidden",
        className,
      )}
    >
      {header && <div className="w-full">{header}</div>}
      <div
        className={cn(
          "group-hover/bento:translate-x-2 transition duration-200 flex-grow",
          className_inner,
        )}
      >
        <div className="flex items-center gap-2 mb-2">
          {icon}
          <div className="font-heading text-2xl text-black">{title}</div>
        </div>
        <div className="font-base text-base text-black/70 leading-relaxed">
          {description}
        </div>
      </div>
    </Wrapper>
  );
};
