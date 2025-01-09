import { User } from "@/payload-types";

export const rest = async (
  url: string,
  args?: any, // eslint-disable-line @typescript-eslint/no-explicit-any
  options?: RequestInit
): Promise<null | undefined | User> => {
  const method = options?.method || "POST";

  try {
    const res = await fetch(url, {
      method,
      ...(method === "POST" ? { body: JSON.stringify(args) } : {}),
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    });

    const jsonResponse = await res.json();

    console.log("RES REST", { url, jsonResponse, args, options });

    if (jsonResponse.errors) {
      throw new Error(jsonResponse.errors[0].message);
    }

    if (res.ok) {
      return jsonResponse;
    }
  } catch (e: unknown) {
    throw new Error(e as string);
  }
};
