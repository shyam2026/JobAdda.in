import { handlers } from "./src/auth";
import { NextRequest } from "next/server";

// Set environment variables if needed
process.env.NEXTAUTH_URL = "http://localhost:3000";

async function test() {
  const req = new NextRequest("http://localhost:3000/api/auth/session");
  try {
    const res = await handlers.GET(req);
    console.log("Status:", res.status);
    console.log("Headers:", Object.fromEntries(res.headers.entries()));
    const body = await res.text();
    console.log("Body length:", body.length);
    console.log("Body:", body);
  } catch (err) {
    console.error("Handler error:", err);
  }
}

test();
