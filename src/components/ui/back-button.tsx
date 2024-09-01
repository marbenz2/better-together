import * as React from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface BackButtonProps extends React.HTMLAttributes<HTMLAnchorElement> {
  href: string;
}

const BackButton = React.forwardRef<HTMLAnchorElement, BackButtonProps>(
  ({ className, href, ...props }, ref) => {
    return (
      <Link
        ref={ref}
        className={cn(
          "absolute left-8 top-8 py-2 px-4 no-underline text-foreground flex items-center group text-sm",
          className
        )}
        href={href}
        {...props}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>{" "}
        Zurück
      </Link>
    );
  }
);

BackButton.displayName = "BackButton";
export { BackButton };
