import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getExperiences,
  createExperience,
  updateExperience,
  deleteExperience,
  reorderExperiences,
  getPublicExperiences,
} from "../experiences";

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

describe("Experiences Server Actions", () => {
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

  // --- getExperiences ---
  describe("getExperiences", () => {
    it("should return experiences for authenticated user", async () => {
      const mockData = [{ id: "1", title: "Exp 1", user_id: "user-1" }];

      mockGetUser.mockResolvedValue({
        data: { user: { id: "user-1" } },
        error: null,
      });
      mockOrder.mockReturnValue({ data: mockData, error: null });

      const result = await getExperiences();

      expect(mockFrom).toHaveBeenCalledWith("experiences");
      expect(mockSelect).toHaveBeenCalledWith("*");
      expect(mockEq).toHaveBeenCalledWith("user_id", "user-1");
      expect(mockOrder).toHaveBeenCalledWith("sort_order", { ascending: true });
      expect(result).toEqual(mockData);
    });
  });

  // --- createExperience ---
  describe("createExperience", () => {
    it("should create an experience successfully", async () => {
      const input = { title: "New Exp", company: "Corp" };
      const created = { ...input, id: "new-id", user_id: "user-1" };

      mockGetUser.mockResolvedValue({
        data: { user: { id: "user-1" } },
        error: null,
      });
      mockSingle.mockReturnValue({ data: created, error: null });

      const result = await createExperience(input as any);

      expect(mockFrom).toHaveBeenCalledWith("experiences");
      expect(mockInsert).toHaveBeenCalledWith(
        expect.objectContaining({
          user_id: "user-1",
          title: "New Exp",
          company: "Corp",
        }),
      );
      expect(result).toEqual(created);
    });
  });

  // --- updateExperience ---
  describe("updateExperience", () => {
    it("should update an experience successfully", async () => {
      const input = { title: "Updated Exp" };
      const updated = { ...input, id: "1", user_id: "user-1" };

      mockGetUser.mockResolvedValue({
        data: { user: { id: "user-1" } },
        error: null,
      });
      mockSingle.mockReturnValue({ data: updated, error: null });

      const result = await updateExperience("1", input as any);

      expect(mockFrom).toHaveBeenCalledWith("experiences");
      expect(mockUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Updated Exp",
        }),
      );
      expect(mockEq).toHaveBeenCalledWith("id", "1");
      expect(result).toEqual(updated);
    });
  });

  // --- deleteExperience ---
  describe("deleteExperience", () => {
    it("should delete an experience successfully", async () => {
      mockGetUser.mockResolvedValue({
        data: { user: { id: "user-1" } },
        error: null,
      });

      // Allow delete chain to process
      // delete -> eq -> eq -> then (void)
      // Since chainable returned by eq doesn't have error prop, it works for check.

      await deleteExperience("1");

      expect(mockFrom).toHaveBeenCalledWith("experiences");
      expect(mockDelete).toHaveBeenCalled();
      expect(mockEq).toHaveBeenCalledWith("id", "1");
    });
  });

  // --- reorderExperiences ---
  describe("reorderExperiences", () => {
    it("should update sort_order for multiple experiences", async () => {
      const items = [
        { id: "1", sort_order: 1 },
        { id: "2", sort_order: 2 },
      ];

      mockGetUser.mockResolvedValue({
        data: { user: { id: "user-1" } },
        error: null,
      });

      await reorderExperiences(items);

      expect(mockFrom).toHaveBeenCalledWith("experiences");
      // Called twice (once per item)
      // In reorder function: from -> update -> eq -> eq
      expect(mockUpdate).toHaveBeenCalledTimes(2);
    });
  });

  // --- getPublicExperiences ---
  describe("getPublicExperiences", () => {
    it("should return experiences for a specific user", async () => {
      const mockData = [
        { id: "1", title: "Public Exp", user_id: "target-user" },
      ];

      mockOrder.mockReturnValue({ data: mockData, error: null });

      const result = await getPublicExperiences("target-user");

      expect(mockFrom).toHaveBeenCalledWith("experiences");
      expect(mockSelect).toHaveBeenCalledWith("*");
      expect(mockEq).toHaveBeenCalledWith("user_id", "target-user");
      expect(mockOrder).toHaveBeenCalledWith("sort_order", { ascending: true });
      expect(result).toEqual(mockData);
    });
  });
});
