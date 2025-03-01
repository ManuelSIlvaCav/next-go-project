import { Suspense } from 'react'
import EmailEditor, { EditorRef, EmailEditorProps } from 'react-email-editor'

export type EmailEditorComponentProps = {
  ref: React.RefObject<EditorRef | null>
  value: unknown
} & EmailEditorProps

export default function EmailEditorComponent(props: EmailEditorComponentProps) {
  const options: EmailEditorProps['options'] = {
    id: 'editor',
    displayMode: 'email',
    version: 'latest',
    mergeTags: {
      user: {
        name: 'Usuario',
        mergeTags: {
          first_name: {
            name: 'First Name',
            value: '{{first_name}}',
            sample: 'John',
          },
          last_name: {
            name: 'Last Name',
            value: '{{last_name}}',
            sample: 'Doe',
          },
        },
      },
      actions: {
        name: 'Actions',
        mergeTags: {
          login: {
            name: 'Login',
            value: '{{login}}',
            sample: 'https://example.com/login',
          },
        },
      },
    },
    appearance: {
      panels: {
        tools: {
          dock: 'right',
        },
      },
    },
  }

  const onReady: EmailEditorProps['onReady'] = () => {
    // editor is ready
    // you can load your template here;
    // the design json can be obtained by calling
    if (props.ref.current?.editor && props.value && Object.keys(props.value).length > 0) {
      // @ts-ignore
      props.ref.current.editor.loadDesign(JSON.parse(props.value))
    }
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EmailEditor
        ref={props.ref}
        minHeight={800}
        options={options}
        editorId="1"
        onReady={onReady}
        onLoad={onReady}
      />
    </Suspense>
  )
}
