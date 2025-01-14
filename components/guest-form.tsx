"use client";

import { Loader2 } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

import { GuestFormSchema } from "./auth-form";
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

type GuestFormProps = {
  guestForm: UseFormReturn<
    {
      name: string;
    },
    any,
    undefined
  >;
  onSubmitGuest(data: z.infer<typeof GuestFormSchema>): Promise<void>;
  loading: boolean;
};

export default function GuestForm({
  guestForm,
  onSubmitGuest,
  loading,
}: GuestFormProps) {
  return (
    <Form {...guestForm}>
      <form
        onSubmit={guestForm.handleSubmit(onSubmitGuest)}
        className="grid gap-6"
      >
        <div className="grid gap-2">
          <FormField
            control={guestForm.control}
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

        <Button
          type="submit"
          variant={"brand"}
          className="w-full"
          disabled={loading}
        >
          {loading ? <Loader2 className="animate-spin" /> : null}
          {loading ? "Guest loggin in..." : "Login as guest"}
        </Button>
      </form>
    </Form>
  );
}
