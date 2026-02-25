import backendApi from "@/utils/backendApi";
import { IProject } from "../static/project";

const getProject = async () => {
  const response = await backendApi<IProject>(`/project`, {
    method: "GET",
  });

  // if (response.status !== 200) {
  //   throw new Error(response.message.at(0));
  // }

  return response!;
};

export default getProject;
