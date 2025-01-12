"use client";

import { useContext, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SessionContext } from "@/context/session";
import demoUserImage from "@/public/images/demo-user.png";

import { logout } from "@/lib/requests/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
        <Image
          src={
            session?.user?.profile_picture?.trim().length
              ? session.user.profile_picture
              : demoUserImage
          }
          alt="user profile image"
          width={32}
          height={32}
          className="h-8 w-8 rounded-full object-fill"
        />
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
