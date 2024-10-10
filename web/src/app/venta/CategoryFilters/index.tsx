"use client";

import { Button } from "@/components/ui/button";
import DesktopFilters from "./desktop-filters";
import MobileFilters from "./mobile-filters";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { CaretSortIcon } from "@radix-ui/react-icons";
import Link from "next/link";

const chileanRegions = [
  "Arica y Parinacota",
  "Tarapacá",
  "Antofagasta",
  "Atacama",
  "Coquimbo",
  "Valparaíso",
  "Metropolitana",
  "O'Higgins",
  "Maule",
  "Ñuble",
  "Biobío",
  "Araucanía",
  "Los Ríos",
  "Los Lagos",
  "Aysén",
  "Magallanes",
];

const bedroomOptions = ["Monoambiente", "1 ", "2 ", "3 ", "4 ", "5 "];

function RegionFilterLinks() {
  return (
    <Collapsible className="pt-4">
      <CollapsibleTrigger asChild>
        <Button variant="ghost" size="sm">
          <span className="text-sm md:text-base">Ubicacion</span>
          <CaretSortIcon className="h-4 w-4" />
          <span className="sr-only">Toggle</span>
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <NavigationMenu>
          <NavigationMenuList className="flex-col text-start items-start">
            {chileanRegions.map((region) => (
              <NavigationMenuItem key={region}>
                <Link href={`/${region}`} legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    <span className="text-sm md:text-base ">{region}</span>
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </CollapsibleContent>
    </Collapsible>
  );
}

function BedroomFilterLinks() {
  return (
    <Collapsible className="pt-4">
      <CollapsibleTrigger asChild>
        <Button variant="ghost" size="sm">
          <span className="text-sm md:text-base">Dormitorios</span>
          <CaretSortIcon className="h-4 w-4" />
          <span className="sr-only">Toggle</span>
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <NavigationMenu>
          <NavigationMenuList className="flex-col text-start items-start">
            {bedroomOptions.map((region) => (
              <NavigationMenuItem key={region}>
                <Link href={`/${region}`} legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    <span className="text-sm md:text-base ">{region}</span>
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </CollapsibleContent>
    </Collapsible>
  );
}

function Categories() {
  return (
    <>
      <RegionFilterLinks />
      <BedroomFilterLinks />
    </>
  );
}

export default function CategoryFilters() {
  return (
    <div>
      <MobileFilters className="lg:hidden">
        <Categories />
      </MobileFilters>
      <DesktopFilters className="hidden lg:block">
        <Categories />
      </DesktopFilters>
    </div>
  );
}

/* 
const FormSchema = z.object({
  mobile: z.boolean().default(false).optional(),
  region: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),
}); */

/* const form = useForm<z.infer<typeof FormSchema>>({
  resolver: zodResolver(FormSchema),
  defaultValues: {
    mobile: true,
  },
});

function onSubmit(data: z.infer<typeof FormSchema>) {
  toast({
    title: "You submitted the following values:",
    description: (
      <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
        <code className="text-white">{JSON.stringify(data, null, 2)}</code>
      </pre>
    ),
  });
} */

{
  /* <div className="grid grid-cols-5">
        <div className="col-span-1">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="mobile"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 ">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Use different settings for my mobile devices
                      </FormLabel>
                      <FormDescription>
                        You can manage your mobile notifications in the
                        <Link href="/examples/forms">mobile settings</Link>{" "}
                        page.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </div>
        <div className="col-span-4">Main Home</div>
      </div> */
}
