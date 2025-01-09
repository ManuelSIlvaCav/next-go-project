"use client";

import { useAuth } from "@/cms/providers/Auth";
import { User } from "@/payload-types";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Message } from "./Message";

export default function CMSPage() {
  const searchParams = useSearchParams();
  const allParams = searchParams.toString()
    ? `?${searchParams.toString()}`
    : "";
  const { login } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);

  const onSubmit = useCallback(
    async (data: Partial<User>) => {
      try {
        const tryLoginData = await login(data);

        if (tryLoginData) {
          //Login success
          console.log("loging tryLoginData", tryLoginData);
          return router.push(`/admin`);
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {
        console.log("Logging user in failed creating");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users`,
        {
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
        }
      );

      console.log("loging response", response);
      if (!response.ok) {
        const message =
          response.statusText || "There was an error creating the account.";
        setError(message);
        return;
      }

      const redirect = searchParams.get("redirect");

      const timer = setTimeout(() => {
        setLoading(true);
      }, 1000);

      try {
        console.log("loging data", data);
        await login(data);
        clearTimeout(timer);
        if (redirect) {
          router.push(redirect);
        } else {
          return router.push(`/admin`);
        }
      } catch (error) {
        console.error(error);
        clearTimeout(timer);
        setError(
          "There was an error with the credentials provided. Please try again."
        );
      }
    },
    [login, router, searchParams]
  );

  useEffect(() => {
    onSubmit({
      email: "manuel@gmail.com",
      name: "manuel",
      password: "password",
      roles: ["admin", "user"],
      businessId: "1",
    });
  }, []);

  return (
    <div>
      <h1>CMS</h1>
      <Message error={error} />
    </div>
  );
}
