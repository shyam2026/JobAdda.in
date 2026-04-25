import { auth } from "@/auth";

export default async function TestAuthPage() {
  const session = await auth();
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Auth Test</h1>
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </div>
  );
}
