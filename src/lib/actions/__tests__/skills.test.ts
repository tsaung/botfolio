import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getSkills,
  createSkill,
  updateSkill,
  deleteSkill,
  reorderSkills,
  getPublicSkills,
} from "../skills";

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

describe("Skills Server Actions", () => {
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

  // --- getSkills ---
  describe("getSkills", () => {
    it("should return skills for authenticated user", async () => {
      const mockData = [{ id: "1", name: "Skill 1", user_id: "user-1" }];

      mockGetUser.mockResolvedValue({
        data: { user: { id: "user-1" } },
        error: null,
      });
      mockOrder.mockReturnValue({ data: mockData, error: null });

      const result = await getSkills();

      expect(mockFrom).toHaveBeenCalledWith("skills");
      expect(mockSelect).toHaveBeenCalledWith("*");
      expect(mockEq).toHaveBeenCalledWith("user_id", "user-1");
      expect(mockOrder).toHaveBeenCalledWith("sort_order", { ascending: true });
      expect(result).toEqual(mockData);
    });
  });

  // --- createSkill ---
  describe("createSkill", () => {
    it("should create a skill successfully", async () => {
      const input = { name: "New Skill", category: "Tech" };
      const created = { ...input, id: "new-id", user_id: "user-1" };

      mockGetUser.mockResolvedValue({
        data: { user: { id: "user-1" } },
        error: null,
      });
      mockSingle.mockReturnValue({ data: created, error: null });

      const result = await createSkill(input as any);

      expect(mockFrom).toHaveBeenCalledWith("skills");
      expect(mockInsert).toHaveBeenCalledWith(
        expect.objectContaining({
          user_id: "user-1",
          name: "New Skill",
        }),
      );
      expect(result).toEqual(created);
    });
  });

  // --- updateSkill ---
  describe("updateSkill", () => {
    it("should update a skill successfully", async () => {
      const input = { name: "Updated Skill" };
      const updated = { ...input, id: "1", user_id: "user-1" };

      mockGetUser.mockResolvedValue({
        data: { user: { id: "user-1" } },
        error: null,
      });
      mockSingle.mockReturnValue({ data: updated, error: null });

      const result = await updateSkill("1", input as any);

      expect(mockFrom).toHaveBeenCalledWith("skills");
      expect(mockUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "Updated Skill",
        }),
      );
      expect(result).toEqual(updated);
    });
  });

  // --- deleteSkill ---
  describe("deleteSkill", () => {
    it("should delete a skill successfully", async () => {
      mockGetUser.mockResolvedValue({
        data: { user: { id: "user-1" } },
        error: null,
      });

      await deleteSkill("1");

      expect(mockFrom).toHaveBeenCalledWith("skills");
      expect(mockDelete).toHaveBeenCalled();
      expect(mockEq).toHaveBeenCalledWith("id", "1");
    });
  });

  // --- reorderSkills ---
  describe("reorderSkills", () => {
    it("should update sort_order for multiple skills", async () => {
      const items = [{ id: "1", sort_order: 1 }];

      mockGetUser.mockResolvedValue({
        data: { user: { id: "user-1" } },
        error: null,
      });

      await reorderSkills(items);

      expect(mockFrom).toHaveBeenCalledWith("skills");
      expect(mockUpdate).toHaveBeenCalledTimes(1);
    });
  });

  // --- getPublicSkills ---
  describe("getPublicSkills", () => {
    it("should return skills for target user", async () => {
      const mockData = [
        { id: "1", name: "Public Skill", user_id: "target-user" },
      ];

      mockOrder.mockReturnValue({ data: mockData, error: null });

      const result = await getPublicSkills("target-user");

      expect(mockFrom).toHaveBeenCalledWith("skills");
      expect(mockSelect).toHaveBeenCalledWith("*");
      expect(mockEq).toHaveBeenCalledWith("user_id", "target-user");
      expect(mockOrder).toHaveBeenCalledWith("sort_order", { ascending: true });
      expect(result).toEqual(mockData);
    });
  });
});
