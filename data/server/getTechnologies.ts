import backendApi from "@/utils/backendApi";

const getTechnology = async () => {
  const response = await backendApi(`/technology`, {
    method: "GET",
  });

  // if (response.status !== 200) {
  //   throw new Error(response.message.at(0));
  // }

  return response!;
};

export default getTechnology;
