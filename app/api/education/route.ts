import { educations } from "@/data";

export async function GET() {
  return Response.json(educations);
}
