import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  reorderProjects,
  getPublicProjects,
} from "../projects";

// --- Mocks ---

const {
  mockFrom,
  mockSelect,
  mockInsert,
  mockUpdate,
  mockDelete,
  mockEq,
  mockOrder,
  mockSingle,
  mockGetUser,
} = vi.hoisted(() => {
  return {
    mockFrom: vi.fn(),
    mockSelect: vi.fn(),
    mockInsert: vi.fn(),
    mockUpdate: vi.fn(),
    mockDelete: vi.fn(),
    mockEq: vi.fn(),
    mockOrder: vi.fn(),
    mockSingle: vi.fn(),
    mockGetUser: vi.fn(),
  };
});

vi.mock("@/lib/db/server", () => ({
  createClient: vi.fn(() => ({
    auth: { getUser: mockGetUser },
    from: mockFrom,
  })),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

vi.mock("next/server", () => ({
  after: vi.fn((fn: () => void) => fn()),
}));

vi.mock("@/lib/rag/portfolio-sync", () => ({
  syncProjectsToKnowledge: vi.fn(),
  syncExperiencesToKnowledge: vi.fn(),
  syncSkillsToKnowledge: vi.fn(),
  syncAllPortfolioData: vi.fn(),
}));

describe("Projects Server Actions", () => {
  beforeEach(() => {
    vi.resetAllMocks();

    const chainable = {
      select: mockSelect,
      insert: mockInsert,
      update: mockUpdate,
      delete: mockDelete,
      eq: mockEq,
      order: mockOrder,
      single: mockSingle,
    };

    mockFrom.mockReturnValue(chainable);
    mockSelect.mockReturnValue(chainable);
    mockInsert.mockReturnValue(chainable);
    mockUpdate.mockReturnValue(chainable);
    mockDelete.mockReturnValue(chainable);
    mockEq.mockReturnValue(chainable);
    mockOrder.mockReturnValue({ data: [], error: null });
    mockSingle.mockReturnValue({ data: null, error: null });
  });

  // --- getProjects ---
  describe("getProjects", () => {
    it("should return projects for authenticated user", async () => {
      const mockData = [
        { id: "1", title: "Project 1", user_id: "user-1" },
        { id: "2", title: "Project 2", user_id: "user-1" },
      ];

      mockGetUser.mockResolvedValue({
        data: { user: { id: "user-1" } },
        error: null,
      });
      mockOrder.mockReturnValue({ data: mockData, error: null });

      const result = await getProjects();

      expect(mockFrom).toHaveBeenCalledWith("projects");
      expect(mockSelect).toHaveBeenCalledWith("*");
      expect(mockEq).toHaveBeenCalledWith("user_id", "user-1");
      expect(mockOrder).toHaveBeenCalledWith("sort_order", { ascending: true }); // Verify sort order
      expect(result).toEqual(mockData);
    });
  });

  // --- createProject ---
  describe("createProject", () => {
    it("should create a project successfully", async () => {
      const input = { title: "New Project", description: "Desc" };
      const created = { ...input, id: "new-id", user_id: "user-1" };

      mockGetUser.mockResolvedValue({
        data: { user: { id: "user-1" } },
        error: null,
      });
      mockSingle.mockReturnValue({ data: created, error: null });

      const result = await createProject(input as any);

      expect(mockFrom).toHaveBeenCalledWith("projects");
      expect(mockInsert).toHaveBeenCalledWith(
        expect.objectContaining({
          user_id: "user-1",
          title: "New Project",
        }),
      );
      expect(result).toEqual(created);
    });
  });

  // --- reorderProjects ---
  describe("reorderProjects", () => {
    it("should update sort_order for multiple projects", async () => {
      const items = [
        { id: "1", sort_order: 1 },
        { id: "2", sort_order: 2 },
      ];

      mockGetUser.mockResolvedValue({
        data: { user: { id: "user-1" } },
        error: null,
      });

      // Mock update to succeed
      // mockUpdate.mockReturnValue({ error: null }); // REMOVED: Breaks chain
      // Default chainable is fine.

      mockEq.mockReturnValue({ eq: mockEq }); // Chained eq

      await reorderProjects(items);

      expect(mockFrom).toHaveBeenCalledWith("projects");
      expect(mockUpdate).toHaveBeenCalledTimes(2);
    });
  });

  // --- getPublicProjects ---
  describe("getPublicProjects", () => {
    it("should return only published projects for target user", async () => {
      const mockData = [
        {
          id: "1",
          title: "Public Project",
          status: "published",
          user_id: "target-user",
        },
      ];

      mockOrder.mockReturnValue({ data: mockData, error: null });

      const result = await getPublicProjects("target-user");

      expect(mockFrom).toHaveBeenCalledWith("projects");
      expect(mockSelect).toHaveBeenCalledWith("*");
      expect(mockEq).toHaveBeenCalledWith("status", "published");
      expect(mockEq).toHaveBeenCalledWith("user_id", "target-user");
      expect(mockOrder).toHaveBeenCalledWith("sort_order", { ascending: true });
      expect(result).toEqual(mockData);
    });
  });
});
