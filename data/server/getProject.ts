import backendApi from "@/utils/backendApi";

const getProject = async () => {
  try {
    const response = await backendApi(`/project`, {
      method: "GET",
    });

    if (!response || !Array.isArray(response)) {
      throw new Error('Invalid response format from project API');
    }

    return response;
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw new Error('Failed to fetch projects');
  }
};

export default getProject;
