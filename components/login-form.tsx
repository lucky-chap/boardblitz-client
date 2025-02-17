"use client";

import { Loader2 } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

import { LoginFormSchema } from "./auth-form";
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

type LoginFormProps = {
  loginForm: UseFormReturn<
    {
      email: string;
      password: string;
    },
    any,
    undefined
  >;
  onSubmitLogin(data: z.infer<typeof LoginFormSchema>): Promise<void>;
  loading: boolean;
};

export default function LoginForm({
  loginForm,
  onSubmitLogin,
  loading,
}: LoginFormProps) {
  return (
    <Form {...loginForm}>
      <form
        onSubmit={loginForm.handleSubmit(onSubmitLogin)}
        className="grid gap-6"
      >
        <div className="grid gap-2">
          <FormField
            control={loginForm.control}
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
            control={loginForm.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>Password</FormLabel>
                </div>
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
          {loading ? "Logging you in..." : "Login"}
        </Button>
      </form>
    </Form>
  );
}
