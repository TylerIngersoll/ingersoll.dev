import axios from "axios";

export const getApiData = async (apiUrl) => {
  let apiData;
  try {
    const axiosGet = await axios.get(apiUrl);
    apiData = axiosGet.data;
  } catch (e) {
    console.error(e);
  }
  return apiData;
};
