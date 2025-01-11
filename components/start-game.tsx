"use client";

import { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { SessionContext } from "@/context/session";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { createGame } from "@/lib/requests/game";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";

const CreateGameSchema = z.object({
  side: z.string().optional(),
  unlisted: z.boolean().default(false).optional(),
});

const JoinGameSchema = z.object({
  code: z.string().min(3, {
    message: "Game code must be at least 3 characters.",
  }),
});

export default function StartGame({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const createGameForm = useForm<z.infer<typeof CreateGameSchema>>({
    resolver: zodResolver(CreateGameSchema),
    defaultValues: {
      side: "white",
      unlisted: false,
    },
  });
  const joinGameForm = useForm<z.infer<typeof JoinGameSchema>>({
    resolver: zodResolver(JoinGameSchema),
    defaultValues: {
      code: "",
    },
  });

  const session = useContext(SessionContext);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleCreateNewGame(data: z.infer<typeof CreateGameSchema>) {
    setLoading(true);
    let chosenSide;
    if (data.side === "random") {
      const sides = ["white", "black"];
      chosenSide = sides[Math.floor(Math.random() * sides.length)];
    } else {
      chosenSide = data.side?.toLowerCase() as string;
    }
    await createGame(chosenSide, data.unlisted as boolean)
      .then((g) => {
        if (g) {
          setLoading(false);
          //   router.push(`/play/${g.code}`);
          console.log("Game created: ", g);
          // alert the games table that a new game has been created
          session?.setNewGameCreated(true);
        }
      })
      .catch((e) => {
        setLoading(false);
        console.log("Error creating game: ", e);
      });
  }

  async function handleJoinGame(data: z.infer<typeof JoinGameSchema>) {
    router.push(`/play/${data.code}`);
  }

  return (
    <div
      className={cn(
        "mx-auto mt-20 flex w-full max-w-lg flex-col gap-6 px-4 xl:mt-0",
        className
      )}
      {...props}
    >
      <div className="flex flex-col gap-6">
        <div className="items-centr flex flex-col gap-2">
          <h1 className="text-start text-base font-semibold leading-6 text-gray-900">
            Join or start game
          </h1>
        </div>
        <Form {...joinGameForm}>
          <form
            onSubmit={joinGameForm.handleSubmit(handleJoinGame)}
            className="flex flex-col gap-6"
          >
            <div className="grid gap-2">
              <FormField
                control={joinGameForm.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Game code</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" variant={"brand"} className="w-full">
              Join game
            </Button>
          </form>
        </Form>
        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-zinc-200 dark:after:border-zinc-800">
          <span className="relative z-10 bg-white px-2 text-zinc-500 dark:bg-zinc-950 dark:text-zinc-400">
            Or
          </span>
        </div>
        <Form {...createGameForm}>
          <form onSubmit={createGameForm.handleSubmit(handleCreateNewGame)}>
            <div className="grid gap-4">
              <FormField
                control={createGameForm.control}
                name="side"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Side</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="w-full border-zinc-200 focus:ring-zinc-300">
                          <SelectValue placeholder="Select a side" />
                        </SelectTrigger>
                        <SelectContent className="w-full">
                          <SelectGroup className="border-blue-500">
                            <SelectLabel>Sides</SelectLabel>
                            <SelectItem value="random">Random</SelectItem>
                            <SelectItem value="black">Black</SelectItem>
                            <SelectItem value="white">White</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={createGameForm.control}
                name="unlisted"
                render={({ field }) => (
                  <FormItem className="my-2">
                    <FormControl>
                      <div className="flex items-center">
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="ml-1 mr-2 border-zinc-300 data-[state=checked]:bg-blue-600"
                        />
                        <label
                          htmlFor="inviteOnly"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Invite only
                        </label>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button variant="outline" className="w-full" disabled={loading}>
                {loading ? <Loader2 className="animate-spin" /> : null}
                {loading ? "Creating game..." : "Create game"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
