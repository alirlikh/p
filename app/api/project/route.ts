import { projects } from "@/data";

export async function GET() {
  return Response.json(projects);
}
