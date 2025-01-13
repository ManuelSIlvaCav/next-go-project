"use server";

import { rest } from "@/cms/providers/rest";
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

  await createCMSResources({
    email: data.email,
    roles: data.adminLogin ? ["super-admin"] : ["user"],
    password: data.email,
  });

  const cookieStore = await cookies();
  cookieStore.set("jwt", jsonData.access_token, {
    expires: new Date(jsonData.expires_at),
  });

  /* Create the user on the CMS */

  return { error: null, data: jsonData };
}

async function createCMSResources(args: {
  email: string;
  roles: string[];
  password: string;
  tenants?: string[];
}) {
  try {
    const respUserCreate = await rest(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users`,
      args
    );

    const respLoginUser = await rest(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/login`,
      args
    );

    console.log("User created", { respUserCreate, respLoginUser });
  } catch (error) {
    console.log(error);
  }
}
