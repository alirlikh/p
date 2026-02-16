import { cache } from "react";
import backendApi from "@/utils/backendApi";
import { ITechnology } from "../static/technology";

const getTechnology = cache(async () => {
  const response = await backendApi<ITechnology>(`/technology`, {
    method: "GET",
  });

  // if (response.status !== 200) {
  //   throw new Error(response.message.at(0));
  // }

  return response!;
});

export default getTechnology;
