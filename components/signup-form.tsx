"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

import { LoginFormSchema, SignupFormSchema } from "./auth-form";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";

type SignupFormProps = {
  signupForm: UseFormReturn<
    {
      name: string;
      email: string;
      password: string;
    },
    any,
    undefined
  >;
  onSubmitSignup(data: z.infer<typeof SignupFormSchema>): Promise<void>;
  loading: boolean;
};

export default function SignupForm({
  signupForm,
  onSubmitSignup,
  loading,
}: SignupFormProps) {
  return (
    <Form {...signupForm}>
      <form
        onSubmit={signupForm.handleSubmit(onSubmitSignup)}
        className="grid gap-6"
      >
        <div className="grid gap-2">
          <FormField
            control={signupForm.control}
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
            control={signupForm.control}
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
            control={signupForm.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          variant={"brand"}
          className="w-full"
          disabled={loading}
        >
          {loading ? <Loader2 className="animate-spin" /> : null}
          {loading ? "Signing you up..." : "Signup"}
        </Button>
      </form>
    </Form>
  );
}
