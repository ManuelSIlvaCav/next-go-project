'use client'

import { ColumnDef } from '@tanstack/react-table'

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Business = {
  id: string
  legalName: string
  identifier: string
  createdAt: string
}

export const columns: ColumnDef<Business>[] = [
  {
    accessorKey: 'first_name',
    header: 'Nombre',
  },
  {
    accessorKey: 'last_name',
    header: 'Apellido',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
]
