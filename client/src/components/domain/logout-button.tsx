import { FC } from "react";
import { Button } from "../ui/button";
import { LucideLogOut } from "lucide-react";
import ky from "ky";
import { useLocation } from "wouter";
import { useSWRConfig } from "swr";

const LogoutButton: FC = () => {
  const [, navigate] = useLocation();
  const { mutate } = useSWRConfig();

  const handleLogout = async () => {
    await ky
      .post(`${import.meta.env.VITE_API_URL}/v1/logout`, {
        credentials: "include",
      })
      .json();
    mutate("/api/v1/me");
    navigate("/login", { replace: true });
  };

  return (
    <Button className="bg-red-500 hover:bg-red-600" onClick={handleLogout}>
      <LucideLogOut className="mr-2 h-4 w-4" />
      Logout
    </Button>
  );
};

export default LogoutButton;
