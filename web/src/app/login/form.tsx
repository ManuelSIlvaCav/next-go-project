"use client";

import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { clsx } from "clsx";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";

const FormSchema = z.object({
  email: z.string(),
});

export default function LoginForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  return (
    <Form {...form}>
      <form action="#" method="POST" className="p-7 sm:p-11">
        <div className="flex items-start">
          <Link href="/" title="Home">
            Logo
          </Link>
        </div>
        <h1 className="mt-8 text-base/6 font-medium font-[family-name:var(--font-fredoka)]">
          Welcome back!
        </h1>
        <p className="mt-1 text-sm/5 text-gray-600 font-[family-name:var(--font-fredoka)]">
          Sign in to your account to continue.
        </p>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-4">
              <Input
                {...field}
                required
                autoFocus
                id="email"
                className={clsx(
                  "block w-full rounded-lg border border-transparent shadow ring-1 ring-black/10 ",
                  "px-[calc(theme(spacing.2)-1px)] py-[calc(theme(spacing[1.5])-1px)] text-base/6 sm:text-sm/6",
                  "data-[focus]:outline data-[focus]:outline-2 data-[focus]:-outline-offset-1 data-[focus]:outline-black"
                )}
              />
            </FormItem>
          )}
        />

        <div className="mt-8 flex items-center justify-between text-sm/5">
          {/* <Field className="flex items-center gap-3">
        <Checkbox
          name="remember-me"
          className={clsx(
            "group block size-4 rounded border border-transparent shadow ring-1 ring-black/10 focus:outline-none",
            "data-[checked]:bg-black data-[checked]:ring-black",
            "data-[focus]:outline data-[focus]:outline-2 data-[focus]:outline-offset-2 data-[focus]:outline-black"
          )}
        >
          <CheckIcon className="fill-white opacity-0 group-data-[checked]:opacity-100" />
        </Checkbox>
        <Label>Remember me</Label>
      </Field> */}
          <Link
            href="#"
            className="font-light cursor-pointer hover:text-gray-600"
          >
            <p className="mt-1 text-sm/5 text-gray-600 font-[family-name:var(--font-fredoka)]">
              Forgot password?
            </p>
          </Link>
        </div>
        <div className="mt-8">
          <Button
            type="submit"
            className="w-full font-[family-name:var(--font-latto)]"
          >
            Sign in
          </Button>
        </div>
      </form>
    </Form>
  );
}
