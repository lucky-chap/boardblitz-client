"use client";

import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import { SessionContext } from "@/context/session";
import demoBg from "@/public/images/demo-bg.png";
import demoUserImage from "@/public/images/demo-user.png";
import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { zodResolver } from "@hookform/resolvers/zod";
import AWS from "aws-sdk";
import S3 from "aws-sdk/clients/s3";
import { Loader2, Pencil, RotateCw } from "lucide-react";
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
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [userProfileImageFile, setUserProfileImageFile] = useState<
    File | null | undefined
  >();
  const [userBannerImageFile, setUserBannerImageFile] = useState<
    File | null | undefined
  >();
  const [userProfileImageURL, setUserProfileImageURL] = useState<
    string | undefined
  >(undefined);
  const [userBannerImageURL, setUserBannerImageURL] = useState<
    string | undefined
  >(undefined);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: session?.user?.name ?? "",
      email: session?.user?.email ?? "",
      password: undefined,
    },
  });

  const handleProfileImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    // Check if file exists
    if (!file) return;

    // Check file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!validTypes.includes(file.type)) {
      setUpdateError(
        "Please select only JPGs, JPEGs or PNGs for profile image"
      );
      event.target.value = ""; // Reset input
      setTimeout(() => {
        setUpdateError(null);
      }, 5000);
      return;
    }

    // Check file size (6MB = 6 * 1024 * 1024 bytes)
    const maxSize = 6 * 1024 * 1024; // 6MB in bytes
    if (file.size > maxSize) {
      setUpdateError("File size must be less than 6MB");
      event.target.value = ""; // Reset input
      setTimeout(() => {
        setUpdateError(null);
      }, 5000);
      return;
    }

    setUserProfileImageFile(file);
    return userProfileImageFile;
  };

  const handleBannerImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    // Check if file exists
    if (!file) return;

    // Check file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!validTypes.includes(file.type)) {
      setUpdateError("Please select only JPGs, JPEGs or PNGs for banner image");
      event.target.value = ""; // Reset input
      setTimeout(() => {
        setUpdateError(null);
      }, 5000);
      return;
    }

    // Check file size (6MB = 6 * 1024 * 1024 bytes)
    const maxSize = 6 * 1024 * 1024; // 6MB in bytes
    if (file.size > maxSize) {
      setUpdateError("File size must be less than 6MB");
      event.target.value = ""; // Reset input
      setTimeout(() => {
        setUpdateError(null);
      }, 5000);
      return;
    }

    setUserBannerImageFile(file);
    return userBannerImageFile;
  };

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setLoading(true);
    console.log("Submission data: ", data);

    if (data.password && data.password?.trim().length < 6) {
      setLoading(false);
      console.log("Password is less than 6 chars");
      setPasswordError(true);
      setTimeout(() => {
        setPasswordError(false);
      }, 5000);
      return;
    } else {
      const handleProfileImageUpload = async () => {
        let profileImageUrl;

        if (userProfileImageFile instanceof File) {
          // upload user profile image
          const formData = new FormData();
          formData.append("file", userProfileImageFile);
          const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });
          if (!response.ok) {
            setUploadError("Error uploading profile image");
            setTimeout(() => {
              setUploadError(null);
            }, 3500);
          }
          const data = await response.json();
          return (profileImageUrl = data.url);
        } else {
          profileImageUrl = session?.user?.profile_picture;
          return profileImageUrl;
        }
      };

      const handleBannerImageUpload = async () => {
        let bannerImageUrl;

        if (userBannerImageFile instanceof File) {
          // upload user banner image
          const formData = new FormData();
          formData.append("file", userBannerImageFile);
          const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });
          if (!response.ok) {
            setUploadError("Error uploading banner image");
            setTimeout(() => {
              setUploadError(null);
            }, 3500);
          }
          const data = await response.json();
          return (bannerImageUrl = data.url);
        } else {
          bannerImageUrl = session?.user?.banner_picture;
          return bannerImageUrl;
        }
      };

      const alteredName = removeSpaces(data.name);
      const user = await updateUser(
        alteredName, // name
        data.email, // new email
        session?.user?.email as string, // old email
        data.password && data.password?.trim().length > 0
          ? data.password
          : undefined,
        await handleProfileImageUpload(), // profile image
        await handleBannerImageUpload() // banner image
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

    // }
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
          {/* <Image
            src={demoBg}
            alt="user profile background"
            width={600}
            height={400}
            className="rounded object-fill"
          /> */}
          {/* banner image */}
          {userBannerImageFile ? (
            <Image
              src={
                userBannerImageFile instanceof File
                  ? URL.createObjectURL(userBannerImageFile)
                  : demoBg
              }
              alt="user banner image"
              width={600}
              height={400}
              className="rounded object-fill"
            />
          ) : (
            <Image
              src={
                session?.user?.banner_picture?.trim().length
                  ? session.user.banner_picture
                  : demoBg
              }
              alt="user banner image"
              width={600}
              height={400}
              className="rounded object-fill"
            />
          )}

          {/* profile image */}
          {userProfileImageFile ? (
            <Image
              src={
                userProfileImageFile instanceof File
                  ? URL.createObjectURL(userProfileImageFile)
                  : demoUserImage
              }
              alt="user profile image"
              width={80}
              height={80}
              className="absolute -bottom-5 left-10 h-20 w-20 rounded-full object-fill"
            />
          ) : (
            <Image
              src={
                session?.user?.profile_picture?.trim().length
                  ? session.user.profile_picture
                  : demoUserImage
              }
              alt="user profile image"
              width={80}
              height={80}
              className="absolute -bottom-5 left-10 h-20 w-20 rounded-full object-fill"
            />
          )}

          {/* file input for user profile image */}
          <div className="flex w-full items-center justify-center">
            <label
              htmlFor="profile-dropzone"
              className="absolute left-10 flex cursor-pointer rounded-full bg-gray-100 p-2"
            >
              <Pencil size={"18"} />
              <input
                id="profile-dropzone"
                type="file"
                className="hidden"
                accept="image/png,image/jpg,image/jpeg"
                onChange={handleProfileImageChange}
              />
            </label>
          </div>
          {/* file input for user banner image */}
          <div className="flex w-full items-center justify-center">
            <label
              htmlFor="banner-dropzone"
              className="absolute bottom-4 right-4 flex cursor-pointer rounded-full bg-gray-100 p-2"
            >
              <Pencil size={"18"} />
              <input
                id="banner-dropzone"
                type="file"
                className="hidden"
                accept="image/png,image/jpg,image/jpeg"
                onChange={handleBannerImageChange}
              />
            </label>
          </div>
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
        {uploadError && (
          <p className="mt-16 px-2 text-sm text-red-500">{uploadError}</p>
        )}
      </div>
    </div>
  );
}
