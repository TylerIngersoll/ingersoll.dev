import { createPinia } from "pinia";
import { useContentStore } from "@/store";

// Define the mock function
const mockGetEntry = jest.fn();

// Mock the contentful client and methods
jest.mock("contentful", () => ({
  createClient: jest.fn(() => ({ getEntry: mockGetEntry })),
}));

// Mock the local JSON content
jest.mock("@/data/content.json", () => ({
  content: [{ id: 1, name: "Mocked Content" }],
}));

const mockConsoleError = jest
  .spyOn(console, "error")
  .mockImplementation(() => {});

describe("content store", () => {
  let pinia;
  let originalNodeEnv;

  beforeEach(() => {
    jest.clearAllMocks();
    pinia = createPinia();
    originalNodeEnv = process.env.NODE_ENV;
  });

  afterEach(() => {
    jest.resetAllMocks();
    process.env.NODE_ENV = originalNodeEnv;
  });

  it("loads content from Contentful in production mode and handles success", async () => {
    process.env.NODE_ENV = "production";

    const mockedData = {
      fields: {
        siteContent: {
          content: [{ id: 1, name: "Mocked Content from Contentful" }],
        },
      },
    };

    mockGetEntry.mockResolvedValueOnce(mockedData);

    const store = useContentStore(pinia);
    await store.loadContent();

    expect(store.content).toEqual([
      { id: 1, name: "Mocked Content from Contentful" },
    ]);
  });

  it("loads content from local json in production mode if Contentful call fails", async () => {
    process.env.NODE_ENV = "production";

    mockGetEntry.mockRejectedValueOnce(new Error("Failed to fetch"));

    const store = useContentStore(pinia);
    await store.loadContent();

    expect(store.content).toEqual([{ id: 1, name: "Mocked Content" }]);
  });

  it("logs error if Contentful configurations are missing", async () => {
    process.env.NODE_ENV = "production";

    delete process.env.VUE_APP_CONTENTFUL_SPACE;

    const store = useContentStore(pinia);
    await store.loadContent();

    expect(mockConsoleError).toHaveBeenCalledWith(
      "Failed to fetch content from Contentful:",
      expect.any(Error)
    );
  });

  it("loads content from local json in non-production mode", async () => {
    process.env.NODE_ENV = "development";

    const store = useContentStore(pinia);
    await store.loadContent();

    expect(store.content).toEqual([{ id: 1, name: "Mocked Content" }]);
  });
});

afterAll(() => {
  mockConsoleError.mockRestore();
});
