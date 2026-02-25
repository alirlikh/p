import { IEducation } from "../static/education";
import backendApi from "@/utils/backendApi";

const getEducation = async () => {
  const response = await backendApi<IEducation>(`/education`, {
    method: "GET",
  });

  // if (response.status !== 200) {
  //   throw new Error(response.message.at(0));
  // }

  return response!;
};

export default getEducation;
