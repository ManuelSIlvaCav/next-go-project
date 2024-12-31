import { Button } from "@/components/ui/button";
import Link from "next/link";
import { EmailTemplate, columns } from "./columns";
import { DataTable } from "./data-table";

async function getData(): Promise<EmailTemplate[]> {
  // Fetch data from your API here.
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_PATH}/v1/email_templates`,
    {
      cache: "no-cache",
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

  return data.emailTemplates;
}

export default async function DemoList() {
  const data = await getData();

  return (
    <div className="flex flex-col container mx-auto py-10 gap-4">
      <div className="flex flex-row justify-end">
        <Button className="" variant={"default"} type="button" asChild>
          <Link href="/dashboard/projects/create">Nuevo Proyecto</Link>
        </Button>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
}