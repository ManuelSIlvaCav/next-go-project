"use client";

import TextInput from "@/components/form/text-input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

const FormSchema = z.object({
  name: z.string(),
  legal_name: z.string(),
  identifier: z.string(),
});

type FormValues = z.infer<typeof FormSchema>;

async function createBusinessRequest(data: FormValues) {
  console.log(data);
  const resp = await fetch(
    `${process.env.NEXT_PUBLIC_API_PATH}/v1/businesses`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  const json = await resp.json();

  if (!resp.ok) {
    throw new Error(json.message);
  }

  return json;
}

export default function CreateBusinessForm() {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      legal_name: "",
      identifier: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    await createBusinessRequest(values);

    toast({
      title: "Business created",
      description: "The business has been created successfully",
    });
    router.push("/dashboard/admin/businesses");
    router.refresh();
  };

  return (
    <Card className="w-full max-w-md p-4">
      <Form {...form}>
        <form
          action=""
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <TextInput
            form={form}
            fieldName="name"
            label="Name"
            placeholder="Enter your name"
          />
          <TextInput
            form={form}
            fieldName="legal_name"
            label="Nombre legal"
            placeholder="Empresa S.A."
          />
          <TextInput
            form={form}
            fieldName="identifier"
            label="Rut empresa"
            placeholder="12.345.678-9"
          />

          <div>
            <Button
              type="submit"
              className="!mt-0 w-full"
              isLoading={form.formState.isSubmitting}
            >
              Crear
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
}
