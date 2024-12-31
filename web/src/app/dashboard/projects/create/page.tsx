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
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import Dropzone from "react-dropzone";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

const FormSchema = z.object({
  name: z.string(),
  description: z.string(),
  topologies: z
    .array(
      z.object({
        file: z.any(),
        name: z.string().min(1, { message: "Product Name is required" }),
        description: z.string().min(1, {
          message: "Product Description is required",
        }),
        price: z.coerce.number(),
      })
    )
    .nonempty({ message: "Product is required" }),
});

type FormValues = z.infer<typeof FormSchema>;

export default function CreateProjectPage() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const { fields, append } = useFieldArray({
    name: "topologies",
    control: form.control,
  });

  const onSubmit = (values: FormValues) => {
    console.log(values);
  };

  return (
    <div className="">
      <Form {...form}>
        <form
          action=""
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex-1 max-w-md space-y-5"
        >
          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">Nombre Proyecto</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your name"
                    type="text"
                    className="mt-3"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-500 capitalize" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Descripción del proyecto"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {fields.map((_, index) => {
            return (
              <div key={index}>
                <div className="mt-7 mb-2 text-xl font-bold">
                  {form.getValues(`topologies.${index}.file.name`)}
                </div>
                <div className="flex gap-x-3">
                  <FormField
                    control={form.control}
                    key={index}
                    name={`topologies.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage className="text-red-500 capitalize" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    key={index + 1}
                    name={`topologies.${index}.description`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Description</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage className="text-red-500 capitalize" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    key={index + 2}
                    name={`topologies.${index}.price`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Price</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage className="text-red-500 capitalize" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            );
          })}
          <div>
            <FormField
              control={form.control}
              name="topologies"
              render={() => (
                <Dropzone
                  accept={{
                    "image/*": [".jpg", ".jpeg", ".png"],
                  }}
                  onDropAccepted={(acceptedFiles) => {
                    acceptedFiles.map((acceptedFile) => {
                      return append({
                        file: acceptedFile,
                        name: "",
                        description: "",
                        price: 0,
                      });
                    });
                  }}
                  multiple={true}
                  maxSize={5000000}
                >
                  {({ getRootProps, getInputProps }) => (
                    <div
                      {...getRootProps({
                        className: cn(
                          "p-3 mb-4 flex flex-col items-center justify-center w-full rounded-md cursor-pointer border border-[#e2e8f0]"
                        ),
                      })}
                    >
                      <div className="flex items-center gap-x-3 mt-2 mb-2">
                        <label
                          htmlFor="Products"
                          className={`text-sm text-[7E8DA0] cursor-pointer focus:outline-none focus:underline ${
                            form.formState.errors.topologies && "text-red-500"
                          }`}
                          tabIndex={0}
                        >
                          Add your Product Images
                          <input {...getInputProps()} />
                        </label>
                      </div>
                    </div>
                  )}
                </Dropzone>
              )}
            />
          </div>
          <Button type="submit" className="!mt-0 w-full">
            Add
          </Button>
        </form>
      </Form>
    </div>
  );
}
