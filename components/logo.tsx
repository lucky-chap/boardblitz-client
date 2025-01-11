import React from "react";
import Image from "next/image";
import logo from "@/public/images/logo.png";

import { cn } from "@/lib/utils";

export default function Logo({
  width,
  height,
  className,
}: {
  width?: number;
  height?: number;
  className?: string;
}) {
  return (
    <Image
      src={logo}
      alt="Logo"
      className={cn("mx-auto", className)}
      width={width || 200}
      height={height || 200}
    />
  );
}
