"use client";

import { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { SessionContext } from "@/context/session";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { login, register, setGuestSession } from "@/lib/requests/auth";
import { cn, removeSpaces } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import GuestForm from "./guest-form";
import LoginForm from "./login-form";
import SignupForm from "./signup-form";

export const GuestFormSchema = z.object({
  name: z.string().min(4, {
    message: "Name must be at least 4 characters.",
  }),
});
export const SignupFormSchema = z.object({
  name: z.string().min(4, {
    message: "Name must be at least 4 characters.",
  }),
  email: z.string().email({ message: "Invalid email address." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." }),
});
export const LoginFormSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." }),
});

export function AuthForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const router = useRouter();
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
      console.log("Newly set session after login: ", session);
      setLoginSuccess("You have successfully logged in. Redirecting...");
      setTimeout(() => {
        setLoginSuccess(null);
      }, 3500);
      router.push("/play");
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
      console.log("Newly set session after signup: ", session);
      signupForm.reset();
      setSignupSuccess("You have successfully registered. Redirecting...");
      setTimeout(() => {
        setSignupSuccess(null);
      }, 3500);
      router.push("/play");
    }
  }
  async function onSubmitGuest(data: z.infer<typeof GuestFormSchema>) {
    setLoading(true);
    const user = await setGuestSession(data.name);
    if (user) {
      setLoading(false);
      guestForm.reset();
      session?.setUser(user);
      console.log("Newly set session after guest: ", session);
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
      router.push("/play");
    }
  }

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
      {isGuest ? (
        <GuestForm
          loading={loading}
          onSubmitGuest={onSubmitGuest}
          guestForm={guestForm}
        />
      ) : isLogin ? (
        <LoginForm
          loading={loading}
          onSubmitLogin={onSubmitLogin}
          loginForm={loginForm}
        />
      ) : (
        <SignupForm
          loading={loading}
          onSubmitSignup={onSubmitSignup}
          signupForm={signupForm}
        />
      )}
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
