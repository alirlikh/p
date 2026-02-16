import { technology } from "@/data";

export async function GET() {
  return Response.json(technology);
}
