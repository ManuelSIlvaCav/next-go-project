import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Metadata } from "next";
import Link from "next/link";
import LoginForm from "./form";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to your account to continue.",
};

export default function Login() {
  return (
    <main className="overflow-hidden">
      <div className="isolate flex min-h-dvh items-center justify-center p-6 lg:p-8">
        <div className="w-full max-w-md ">
          <Card className="w-[350px]">
            <CardHeader>
              <CardTitle>Create project</CardTitle>
              <CardDescription>
                Deploy your new project in one-click.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LoginForm />
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className=" text-sm/5 ">
                Not a member?{" "}
                <Link href="#" className="font-medium hover:text-gray-600">
                  Create an account
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </main>
  );
}
