'use server'

export default async function createLoginRequest(data: { type: string; email: string }) {
  const resp = await fetch(`${process.env.NEXT_PUBLIC_API_PATH}/v1/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  const jsonResponse = await resp.json()

  if (!resp.ok || resp.status !== 201) {
    throw new Error(jsonResponse.message)
  }

  return jsonResponse
}
