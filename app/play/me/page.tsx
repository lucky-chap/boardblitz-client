"use client";

import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import { SessionContext } from "@/context/session";
import demoBg from "@/public/images/demo-bg.jpg";
import userProfile from "@/public/images/takeoff.jpg";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { updateUser } from "@/lib/requests/auth";
import { fetchUserProfile } from "@/lib/requests/user";
import { removeSpaces } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const FormSchema = z.object({
  name: z.string().min(4, {
    message: "Name must be at least 4 characters.",
  }),
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().optional(),
});

export default function UserProfilePage() {
  const session = useContext(SessionContext);
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState<string | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: undefined,
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log("Submission data: ", data);
    // const pattern = /^[A-Za-z0-9]+$/;

    if (data.password && data.password?.trim().length < 6) {
      console.log("Password is less than 6 chars");
      setPasswordError(true);
      setTimeout(() => {
        setPasswordError(false);
      }, 5000);
    }
    // else if (!pattern.test(data.name)) {
    //   setUpdateError("Name must be alphanumeric characters only.");
    //   setTimeout(() => {
    //     setUpdateError(null);
    //   }, 5000);
    // }
    else {
      setLoading(true);
      const alteredName = removeSpaces(data.name);
      const user = await updateUser(
        alteredName, // name
        data.email, // new email
        session?.user?.email as string, // old email
        data.password && data.password?.trim().length > 0
          ? data.password
          : undefined
      );
      if (typeof user === "string") {
        setLoading(false);
        setUpdateError(user);
      } else if (user?.id) {
        setLoading(false);
        session?.setUser(user);
        setUpdateSuccess("Profile update successfully");
        setTimeout(() => {
          setUpdateSuccess(null);
        }, 3500);
      }
    }
  }

  useEffect(() => {
    const fetcher = async () => {
      const data = await fetchUserProfile(session?.user?.id as string | number);
      // return data;
      if (data) {
        form.setValue("name", data.name as string);
        form.setValue("email", data.email as string);
      }
    };

    fetcher();
  }, [session?.user]);

  return (
    <div className="mx-auto flex max-w-5xl items-center justify-center p-4">
      <div className="flex flex-col">
        <div className="relative">
          <Image
            src={demoBg}
            alt="user profile background"
            width={600}
            height={400}
            className="rounded object-fill"
          />
          <Image
            src={userProfile}
            alt="user profile image"
            className="absolute -bottom-5 left-10 h-20 w-20 rounded-full object-fill"
          />
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-16 grid gap-6"
          >
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {passwordError && (
                <span className="max-w-lg text-xs text-red-500">
                  Password must be at least 6 characters long. Leave blank if
                  you do not want to change your password.
                </span>
              )}
            </div>

            <Button
              type="submit"
              variant={"brand"}
              className="w-full"
              disabled={
                loading
                // form.getValues("email") == session?.user?.email ||
                // form.getValues("name") == session?.user?.name
              }
            >
              {loading ? <Loader2 className="animate-spin" /> : null}
              {loading ? "Updating profile..." : "Update profile"}
            </Button>
          </form>
        </Form>
        {updateSuccess && (
          <p className="mt-16 px-2 text-sm text-green-500">{updateSuccess}</p>
        )}
        {updateError && (
          <p className="mt-16 px-2 text-sm text-red-500">{updateError}</p>
        )}
      </div>
    </div>
  );
}
