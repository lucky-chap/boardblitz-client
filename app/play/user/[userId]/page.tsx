import React from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import demoBg from "@/public/images/demo-bg.png";
import demoUserImage from "@/public/images/demo-user.png";

import { fetchUserProfile } from "@/lib/requests/user";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import HistoryTable from "@/components/history-table";

type tParams = Promise<{ userId: string | number }>;

export default async function UserProfileDetails(props: { params: tParams }) {
  const { userId } = await props.params;
  const data = await fetchUserProfile(userId);
  if (!data) {
    notFound();
  }
  return (
    <div className="items- mx-auto my-10 flex max-w-5xl flex-col justify-center p-4">
      <div className="relative mb-16">
        <Image
          src={
            data.banner_picture?.trim().length ? data.banner_picture : demoBg
          }
          alt="user banner image"
          width={600}
          height={400}
          className="rounded object-fill"
        />
        <Image
          src={
            data?.profile_picture?.trim().length
              ? data?.profile_picture
              : demoUserImage
          }
          alt="user profile image"
          width={80}
          height={80}
          className="absolute -bottom-5 left-10 h-20 w-20 rounded-full object-fill"
        />
      </div>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="email">Name</Label>
        <Input
          type="text"
          id="name"
          placeholder="Name"
          defaultValue={data.name as string}
          disabled
          className="mb-5 disabled:cursor-default disabled:text-zinc-700 disabled:opacity-100"
        />
        <Label htmlFor="email">Email</Label>
        <Input
          type="email"
          id="email"
          placeholder="Email"
          defaultValue={data.email}
          disabled
          className="mb-5 disabled:cursor-default disabled:text-zinc-700 disabled:opacity-100"
        />
        <Label htmlFor="email">Wins</Label>
        <Input
          type="text"
          id="wins"
          placeholder="Wins"
          defaultValue={data.wins}
          disabled
          className="mb-5 disabled:cursor-default disabled:text-zinc-700 disabled:opacity-100"
        />
        <Label htmlFor="email">Losses</Label>
        <Input
          type="text"
          id="Losses"
          placeholder="Losses"
          defaultValue={data.losses}
          disabled
          className="mb-5 disabled:cursor-default disabled:text-zinc-700 disabled:opacity-100"
        />
        <Label htmlFor="email">Draws</Label>
        <Input
          type="text"
          id="Draws"
          placeholder="Draws"
          defaultValue={data.draws}
          disabled
          className="mb-5 disabled:cursor-default disabled:text-zinc-700 disabled:opacity-100"
        />
      </div>
      <HistoryTable userId={userId} />
    </div>
  );
}
