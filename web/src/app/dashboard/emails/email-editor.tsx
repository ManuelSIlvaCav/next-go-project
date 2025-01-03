"use client";

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
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef } from "react";
import EmailEditor, { EditorRef, EmailEditorProps } from "react-email-editor";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { EmailTemplate } from "./List/columns";

const FormSchema = z.object({
  name: z.string(),
  subject: z.string(),
});

async function postData(body: {
  name: string;
  design: string;
  html: string;
}): Promise<EmailTemplate[]> {
  console.log("Posting", {
    url: `${process.env.NEXT_PUBLIC_API_PATH}/v1/email_templates`,
    body,
  });
  // Fetch data from your API here.
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_PATH}/v1/email_templates`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );
  const data = await response.json();

  /* {id: '9',
      name: 'A cute little name2',
      subject: 'Test Subject',
      body: 'body',
      meta_data: [Object],
      created_at: '2024-12-01T15:16:45.802732Z',
      updated_at: '2024-12-01T15:16:45.802732Z'} */
  console.log("data", data);

  return data.emailTemplate;
}

export default function EmailEditorView() {
  const { toast } = useToast();
  const emailEditorRef = useRef<EditorRef>(null);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const exportHtml = () => {
    const unlayer = emailEditorRef.current?.editor;

    unlayer?.exportHtml((data) => {
      const { design, html } = data;
      const createData = {
        name: form.getValues("name"),
        design: JSON.stringify(design),
        html,
      };
      postData(createData).then(() => {
        toast({
          title: "Email template created",
          position: "top-right",
        });
      });
    });
  };

  const onReady: EmailEditorProps["onReady"] = () => {
    // editor is ready
    // you can load your template here;
    // the design json can be obtained by calling
    // unlayer.loadDesign(callback) or unlayer.exportHtml(callback)
    // const templateJson = { DESIGN JSON GOES HERE };
    // unlayer.loadDesign(templateJson);
  };

  const options: EmailEditorProps["options"] = {
    id: "editor",
    displayMode: "email",
    version: "latest",
    appearance: {
      theme: "dark",
      panels: {
        tools: {
          dock: "right",
        },
      },
    },
  };

  function onFormSubmit(data: z.infer<typeof FormSchema>) {
    console.log("data", data);
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
    exportHtml();
  }

  return (
    <div className="flex flex-col justify-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onFormSubmit, (errors) => {
            console.error(errors);
          })}
          className="w-2/3 space-y-6"
        >
          <FormField
            control={form.control}
            name="name"
            defaultValue=""
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
          <FormField
            control={form.control}
            name="subject"
            defaultValue=""
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subject</FormLabel>
                <FormControl>
                  <Input
                    placeholder="A simple subject for the receiver"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-row gap-4 py-4">
            <Button type="submit">Export HTML</Button>
          </div>
        </form>
      </Form>

      <EmailEditor
        ref={emailEditorRef}
        minHeight={800}
        onReady={onReady}
        options={options}
        editorId="1"
      />
    </div>
  );
}
