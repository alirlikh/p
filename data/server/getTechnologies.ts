import backendApi from "@/utils/backendApi";

const getTechnology = async () => {
  try {
    const response = await backendApi(`/technology`, {
      method: "GET",
    });

    if (!response || !Array.isArray(response)) {
      throw new Error('Invalid response format from technology API');
    }

    return response;
  } catch (error) {
    console.error('Error fetching technologies:', error);
    throw new Error('Failed to fetch technologies');
  }
};

export default getTechnology;
