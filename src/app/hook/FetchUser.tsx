
export const FetchUser = async (TypeValue: string, Domain: string) => {
  const res = await fetch(`https://${Domain}/user/DetailsUser`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ TypeValue })
  })
  const data = await res.json()
  return data.user
}