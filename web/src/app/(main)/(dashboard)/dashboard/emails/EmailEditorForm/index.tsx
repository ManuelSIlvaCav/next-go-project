'use client'

import { useJwt } from '@/components/providers/JwtProvider'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ApiParams } from '@/lib/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRef, useState } from 'react'
import { EditorRef } from 'react-email-editor'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { EmailGeneralTemplate } from '../../admin/email-templates/List/columns'
import { EmailTemplate } from '../List/columns'
import EmailEditorComponent from './email-editor'

const FormSchema = z.object({
  type: z.string(),
  name: z.string(),
  subject: z.string(),
})

async function postData(
  apiParams: ApiParams,
  body: {
    id?: string
    name: string
    subject: string
    design: string
    html: string
  },
): Promise<EmailTemplate> {
  console.log('Posting', {
    url: `${process.env.NEXT_PUBLIC_API_PATH}/v1/email_templates`,
    body,
  })
  // Fetch data from your API here.
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_PATH}/v1/email_templates`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${apiParams.jwt}`,
    },
    body: JSON.stringify(body),
  })
  const data = await response.json()

  /* {id: '9',
      name: 'A cute little name2',
      subject: 'Test Subject',
      body: 'body',
      meta_data: [Object],
      created_at: '2024-12-01T15:16:45.802732Z',
      updated_at: '2024-12-01T15:16:45.802732Z'} */
  console.log('data', data)

  return data.emailTemplate
}

export type EmailEditorViewProps = {
  emailTemplate?: EmailTemplate | EmailGeneralTemplate | null
  onSubmit?: (data: EmailTemplate) => void
}

export default function EmailEditorForm(props: EmailEditorViewProps) {
  const { name = '', subject = '', design = null } = props.emailTemplate || {}

  const jwtContext = useJwt()

  const emailEditorRef = useRef<EditorRef>(null)

  const [editorParams] = useState({
    design,
  })

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name,
      subject,
    },
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function onSubmitExportHtml(callback: (data: any) => void) {
    console.log('onSubmitExportHtml inside', {
      ref: emailEditorRef,
    })
    const unlayer = emailEditorRef.current?.editor
    unlayer?.exportHtml(
      (data) => {
        const { design, html } = data
        const createData = {
          design: JSON.stringify(design),
          html,
        }
        console.log('createData', createData)
        callback(createData)
      },
      { inlineStyles: true },
    )
  }

  function onFormSubmit(formData: z.infer<typeof FormSchema>) {
    onSubmitExportHtml((data) => {
      const createData = { ...formData, ...data }

      console.log('data', { createData })
      postData({ jwt: jwtContext.jwt }, createData).then((result) => {
        toast('Email template created', {
          position: 'top-right',
        })
        props.onSubmit?.(result)
      })
    })
  }

  return (
    <div className="flex flex-col justify-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onFormSubmit, (errors) => {
            console.error(errors)
          })}
          className="w-2/3 space-y-6"
        >
          <FormField
            control={form.control}
            name="type"
            defaultValue=""
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de email</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-[280px]">
                      <SelectValue placeholder="Seleccione el tipo de email" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Tipo de Email</SelectLabel>
                      <SelectItem value="user_created">Nuevo Usuario</SelectItem>
                      <SelectItem value="userlogin">Login Usuario</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />
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
                  <Input placeholder="A simple subject for the receiver" {...field} />
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

      <EmailEditorComponent ref={emailEditorRef} value={editorParams.design} />
    </div>
  )
}
