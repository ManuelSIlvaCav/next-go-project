"use client";

import { DataTableRowActions } from "@/components/data-table-examples/data-table-row-actions";
import { ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type EmailTemplate = {
  id: string;
  name: string;
  subject: string;
  body: string;
  meta_data: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

export const columns: ColumnDef<EmailTemplate>[] = [
  {
    accessorKey: "name",
    header: "Nombre",
  },
  {
    accessorKey: "created_at",
    header: "Fecha creacion",
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
