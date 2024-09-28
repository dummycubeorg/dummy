import { cn } from "@/lib/utils";
import type { ComponentProps, FC } from "react";
import Container from "./container";
import { Button } from "../ui/button";
import { Link } from "wouter";
import { LogInIcon } from "lucide-react";
import { useSession } from "@/hooks/use-session";
import { Skeleton } from "../ui/skeleton";
import LogoutButton from "./logout-button";

type Props = ComponentProps<"div">;

const Header: FC<Props> = ({ className, ...others }) => {
  const { user, isLoading } = useSession();

  return (
    <header
      className={cn("h-16 border-b border-b-gray-200", className)}
      {...others}
    >
      <Container className="flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold tracking-tight">
          Todo App
        </Link>
        <nav>
          <ul className="flex space-x-4">
            <li>
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              ) : user ? (
                <LogoutButton />
              ) : (
                <Link href="/login" asChild>
                  <Button>
                    <LogInIcon className="mr-2 h-4 w-4" />
                    Login
                  </Button>
                </Link>
              )}
            </li>
          </ul>
        </nav>
      </Container>
    </header>
  );
};

export default Header;
