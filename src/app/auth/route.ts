export async function GET() {
  return new Response(JSON.stringify({ auth: true }), {
    status: 200,
    headers: {
      "Content-Type": "application/json"
    }
  });
}
