import backendApi from "@/utils/backendApi";

const getExperience = async () => {
  try {
    const response = await backendApi(`/experience`, {
      method: "GET",
    });

    if (!response || !Array.isArray(response)) {
      throw new Error('Invalid response format from experience API');
    }

    return response;
  } catch (error) {
    console.error('Error fetching experience:', error);
    throw new Error('Failed to fetch experience');
  }
};

export default getExperience;
