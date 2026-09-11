import backendApi from "@/utils/backendApi";

const getEducation = async () => {
  try {
    const response = await backendApi(`/education`, {
      method: "GET",
    });

    if (!response || !Array.isArray(response)) {
      throw new Error('Invalid response format from education API');
    }

    return response;
  } catch (error) {
    console.error('Error fetching education:', error);
    throw new Error('Failed to fetch education');
  }
};

export default getEducation;
