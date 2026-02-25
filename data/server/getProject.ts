import backendApi from "@/utils/backendApi";

const getProject = async () => {
  const response = await backendApi(`/project`, {
    method: "GET",
  });

  // if (response.status !== 200) {
  //   throw new Error(response.message.at(0));
  // }

  return response!;
};

export default getProject;
