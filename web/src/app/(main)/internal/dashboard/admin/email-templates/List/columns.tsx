'use client'

import { ColumnDef } from '@tanstack/react-table'

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type EmailGeneralTemplate = {
  id: string
  name: string
  subject: string
  design?: string
  html?: string
  createdAt: Date
  updatedAt: Date
}

export const columns: ColumnDef<EmailGeneralTemplate>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => <div className="w-[80px]">{row.getValue('id')}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: 'Nombre',
  },
  {
    accessorKey: 'created_at',
    header: 'Fecha creacion',
  },
]
