"use server";

import { cookies } from "next/headers";

export default async function loginMagicLink(data: {
  email: string;
  token: string;
  adminLogin: boolean;
}): Promise<{
  error: string | null;
  data?: { access_token: string; expires_at: string };
}> {
  console.log(data);
  const resp = await fetch(
    `${process.env.NEXT_PUBLIC_API_PATH}/v1/auth/magic-link-login` +
      (data.adminLogin ? "/admin" : ""),
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  /* Make a sleep[ of 2 sec] */
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const jsonData = await resp.json();

  if (resp.status !== 201) {
    return { error: jsonData.message ?? "An error occurred" };
  }

  const cookieStore = await cookies();
  cookieStore.set("jwt", jsonData.access_token, {
    expires: new Date(jsonData.expires_at),
  });

  return { error: null, data: jsonData };
}
