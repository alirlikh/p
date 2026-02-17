import backendApi from "@/utils/backendApi";
import { IExperience } from "../static/experince";

const getExperience = async () => {
  const response = await backendApi<IExperience>(`/experience`, {
    method: "GET",
  });

  // if (response.status !== 200) {
  //   throw new Error(response.message.at(0));
  // }

  return response!;
};

export default getExperience;
