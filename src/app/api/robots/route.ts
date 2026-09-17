// route.ts

import { getAppConfiguration } from "@/api/AppConfig";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const config = await getAppConfiguration().catch((err) => {
    console.error("Error in getting App Config in robots=>", err);
    return undefined;
  });
  const robots = config?.data?.robots;

  return new Response(robots, {
    headers: { "Content-Type": "text/plain" },
  });
}
