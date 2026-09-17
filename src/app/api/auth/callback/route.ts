import { getCoockieExpiryDate } from "@/helpers";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("access_token");
  const redirect_uri = request.cookies.get("redirect_uri");
  if (token) {
    // Set the cookie
    const response = new Response(null, {
      status: 302, // Redirect status code
      headers: {
        Location: redirect_uri?.value ?? "/", // Redirect to the root
        "Set-Cookie": `access_token=${token}; Path=/; expires=${getCoockieExpiryDate()}`, // Set the cookie
      },
    });
    return response;
  } else {
    // Handle the case when there is no token
    return new Response("No access token provided", { status: 400 });
  }
}
