import backendApi from "@/utils/backendApi";

const getExperience = async () => {
  const response = await backendApi(`/experience`, {
    method: "GET",
  });

  // if (response.status !== 200) {
  //   throw new Error(response.message.at(0));
  // }

  return response!;
};

export default getExperience;
