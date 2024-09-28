import { cn } from "@/lib/utils";
import type { ComponentProps, FC } from "react";

type Props = ComponentProps<"div">;

const Container: FC<Props> = ({ className, children, ...others }) => {
  return (
    <div
      className={cn("w-full h-full mx-auto max-w-[min(90%,75rem)]", className)}
      {...others}
    >
      {children}
    </div>
  );
};

export default Container;
