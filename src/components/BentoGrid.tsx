import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

export const BentoGrid = ({
    className,
    children,
}: {
    className?: string
    children?: ReactNode
}) => {
    return (
        <div
            className={cn(
                "grid md:grid-auto-rows-[minmax(18rem,_auto)] grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto",
                className
            )}
        >
            {children}
        </div>
    )
}

export const BentoGridItem = ({
    className,
    title,
    description,
    header,
    icon,
    className_inner,
}: {
    className?: string
    title?: string | ReactNode
    description?: string | ReactNode
    header?: ReactNode
    icon?: ReactNode
    className_inner?: string
}) => {
    return (
        <div
            className={cn(
                "row-span-1 border-2 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 justify-between flex flex-col space-y-4 transition duration-200 group/bento hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1",
                className
            )}
        >
            {header}
            <div className={cn("group-hover/bento:translate-x-2 transition duration-200", className_inner)}>
                {icon}
                <div className="font-heading text-xl text-black mb-2 mt-2">
                    {title}
                </div>
                <div className="font-base text-sm text-black/70">
                    {description}
                </div>
            </div>
        </div>
    )
}
