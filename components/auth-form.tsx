"use client";

import { useContext, useState } from "react";
import Link from "next/link";
import { SessionContext } from "@/context/session";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { login, logout, register, setGuestSession } from "@/lib/requests/auth";
import { cn, removeSpaces } from "@/lib/utils";
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

const GuestFormSchema = z.object({
  name: z.string().min(4, {
    message: "Name must be at least 4 characters.",
  }),
});
const SignupFormSchema = z.object({
  name: z.string().min(4, {
    message: "Name must be at least 4 characters.",
  }),
  email: z.string().email({ message: "Invalid email address." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." }),
});
const LoginFormSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." }),
});

export function AuthForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const session = useContext(SessionContext);
  const [isLogin, setIsLogin] = useState(true);
  const [isGuest, setIsGuest] = useState(false);
  const [loading, setLoading] = useState(false);

  const [loginSuccess, setLoginSuccess] = useState<string | null>(null);
  const [signupSuccess, setSignupSuccess] = useState<string | null>(null);
  const [guestSuccess, setGuestSuccess] = useState<string | null>(null);

  const [loginError, setLoginError] = useState<string | null>(null);
  const [signupError, setSignupError] = useState<string | null>(null);
  const [guestError, setGuestError] = useState<string | null>(null);

  const loginForm = useForm<z.infer<typeof LoginFormSchema>>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const signupForm = useForm<z.infer<typeof SignupFormSchema>>({
    resolver: zodResolver(SignupFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const guestForm = useForm<z.infer<typeof GuestFormSchema>>({
    resolver: zodResolver(GuestFormSchema),
    defaultValues: {
      name: "",
    },
  });

  const logoutUser = async () => {
    setLoading(true);
    const res = await logout();
    if (res) {
      setLoading(false);
      session?.setUser(null);
      window.location.reload();
    }
  };

  async function onSubmitLogin(data: z.infer<typeof LoginFormSchema>) {
    setLoading(true);
    const user = await login(data.email, data.password);
    if (typeof user === "string") {
      setLoading(false);
      setLoginError(user);
      setTimeout(() => {
        setLoginError(null);
      }, 3500);
    } else if (user?.id) {
      setLoading(false);
      loginForm.reset();
      session?.setUser(user);
      setLoginSuccess("You have successfully logged in. Redirecting...");
      setTimeout(() => {
        setLoginSuccess(null);
      }, 3500);
      window.location.reload();
    }
  }
  async function onSubmitSignup(data: z.infer<typeof SignupFormSchema>) {
    setLoading(true);
    const alteredName = removeSpaces(data.name);
    const user = await register(alteredName, data.email, data.password);
    if (typeof user === "string") {
      setLoading(false);
      setSignupError(user);
      setTimeout(() => {
        setSignupError(null);
      }, 3500);
    } else if (user?.id) {
      setLoading(false);
      session?.setUser(user);
      signupForm.reset();
      setSignupSuccess("You have successfully registered. Redirecting...");
      setTimeout(() => {
        setSignupSuccess(null);
      }, 3500);
      window.location.reload();
    }
  }
  async function onSubmitGuest(data: z.infer<typeof GuestFormSchema>) {
    setLoading(true);
    const user = await setGuestSession(data.name);
    if (user) {
      setLoading(false);
      guestForm.reset();
      session?.setUser(user);
      setGuestSuccess("You have successfully set guest session.");
      setTimeout(() => {
        setGuestSuccess(null);
      }, 3500);
    } else {
      setLoading(false);
      setGuestError("Failed to set guest session. Try loggin in.");
      setTimeout(() => {
        setGuestError(null);
      }, 3500);
      window.location.reload();
    }
  }

  const LoginForm = () => {
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
                    <div className="text-center text-xs">
                      <Link href="/forgot-password">
                        {isLogin ? "Recover password" : ""}
                      </Link>
                    </div>
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
  };

  const SignupForm = () => {
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
  };

  const GuestForm = () => {
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
  };

  return (
    <section className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="mb-10 flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">
          {isGuest
            ? "Login as guest"
            : isLogin
              ? "Login to your account"
              : "Create an account"}
        </h1>
        <p className="text-balance text-sm text-zinc-500 dark:text-zinc-400">
          {isGuest
            ? "Enter your name to start."
            : isLogin
              ? "Welcome back! Please enter your details."
              : "Hello! Please enter your details to start."}
        </p>
      </div>
      {isGuest ? <GuestForm /> : isLogin ? <LoginForm /> : <SignupForm />}
      {isGuest ? (
        ""
      ) : (
        <>
          <div className="text-center text-sm">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <Button
              variant={"link"}
              onClick={() => setIsLogin(!isLogin)}
              className=""
              disabled={loading}
            >
              {isLogin ? "Signup" : "Login"}
            </Button>
          </div>
        </>
      )}
      <div className="text-center text-sm">
        <Button
          variant={"link"}
          onClick={() => setIsGuest(!isGuest)}
          className=""
          disabled={loading}
        >
          {isGuest ? "Login with credentials" : "Continue as guest"}
        </Button>
      </div>
      <div className="text-center text-sm">
        <Button
          variant={"link"}
          onClick={() => logoutUser()}
          className=""
          disabled={loading}
        >
          Logout
        </Button>
      </div>
      <div className="text-center text-sm">
        {loginSuccess && <p className="text-green-500">{loginSuccess}</p>}
        {signupSuccess && <p className="text-green-500">{signupSuccess}</p>}
        {guestSuccess && <p className="text-green-500">{guestSuccess}</p>}

        {guestError && <p className="text-red-500">{guestError}</p>}
        {loginError && <p className="text-red-500">{loginError}</p>}
        {signupError && <p className="text-red-500">{signupError}</p>}
      </div>
    </section>
  );
}
