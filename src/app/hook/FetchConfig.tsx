export const fetchconfig = async (domain: string) => {
  const res = await fetch(`https://${domain}/config`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  })
  const data = await res.json()
  return data
}