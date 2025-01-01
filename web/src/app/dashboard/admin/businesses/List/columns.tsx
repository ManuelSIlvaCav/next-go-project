"use client";

import { DataTableRowActions } from "@/components/data-table-examples/data-table-row-actions";
import { ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Business = {
  id: string;
  legalName: string;
  identifier: string;
  createdAt: string;
};

export const columns: ColumnDef<Business>[] = [
  {
    accessorKey: "legal_name",
    header: "Empresa",
  },
  {
    accessorKey: "identifier",
    header: "Rut",
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
