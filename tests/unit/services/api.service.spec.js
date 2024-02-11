import axios from "axios";
import { getApiData } from "@/services/api.service";

jest.mock("axios");

describe("api.service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should successfully get data from the API", async () => {
    const mockData = { data: "sample data" };

    axios.get.mockResolvedValueOnce(mockData);

    const apiUrl = "https://sampleapi.com/data";
    const result = await getApiData(apiUrl);

    expect(result).toEqual(mockData.data);
    expect(axios.get).toHaveBeenCalledWith(apiUrl);
    expect(axios.get).toHaveBeenCalledTimes(1);
  });

  it("should handle API errors gracefully", async () => {
    const mockError = new Error("API error");
    axios.get.mockRejectedValueOnce(mockError);

    const apiUrl = "https://sampleapi.com/data";
    const result = await getApiData(apiUrl);

    expect(result).toBeUndefined();
    expect(axios.get).toHaveBeenCalledWith(apiUrl);
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(console.error).toHaveBeenCalledWith(mockError);
  });
});

beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(jest.fn());
});

afterAll(() => {
  console.error.mockRestore();
});
