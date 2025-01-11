"use client";

import { useContext, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SessionContext } from "@/context/session";

import { login, logout, register, setGuestSession } from "@/lib/requests/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "./ui/button";

export default function ProfileDropdown() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const session = useContext(SessionContext);
  const logoutUser = async () => {
    setLoading(true);
    const res = await logout();
    if (res) {
      setLoading(false);
      session?.setUser(null);
      router.push("/");
      window.location.reload();
    }
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="cursor-pointer">
        <Avatar>
          <AvatarImage
            className="h-10 w-10 rounded-full border-2 border-gray-900 object-cover"
            src="https://inbetweendrafts.com/wp-content/uploads/2022/12/FjOQCPqUcAApKBu.jpg"
          />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href="/play/me">
            <DropdownMenuItem>Profile</DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logoutUser}>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
