import { experiences } from "@/data";

export async function GET() {
  return Response.json(experiences);
}
