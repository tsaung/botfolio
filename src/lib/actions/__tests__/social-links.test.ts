import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getSocialLinks,
  createSocialLink,
  updateSocialLink,
  deleteSocialLink,
  reorderSocialLinks,
  getPublicSocialLinks,
} from "../social-links";

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

describe("Social Links Server Actions", () => {
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

  // --- getSocialLinks ---
  describe("getSocialLinks", () => {
    it("should return social links for authenticated user", async () => {
      const mockData = [{ id: "1", platform: "Twitter", user_id: "user-1" }];

      mockGetUser.mockResolvedValue({
        data: { user: { id: "user-1" } },
        error: null,
      });
      mockOrder.mockReturnValue({ data: mockData, error: null });

      const result = await getSocialLinks();

      expect(mockFrom).toHaveBeenCalledWith("social_links");
      expect(mockSelect).toHaveBeenCalledWith("*");
      expect(mockEq).toHaveBeenCalledWith("user_id", "user-1");
      expect(mockOrder).toHaveBeenCalledWith("sort_order", { ascending: true });
      expect(result).toEqual(mockData);
    });
  });

  // --- createSocialLink ---
  describe("createSocialLink", () => {
    it("should create a social link successfully", async () => {
      const input = { platform: "Twitter", url: "https://x.com" };
      const created = { ...input, id: "new-id", user_id: "user-1" };

      mockGetUser.mockResolvedValue({
        data: { user: { id: "user-1" } },
        error: null,
      });
      mockSingle.mockReturnValue({ data: created, error: null });

      const result = await createSocialLink(input as any);

      expect(mockFrom).toHaveBeenCalledWith("social_links");
      expect(mockInsert).toHaveBeenCalledWith(
        expect.objectContaining({
          user_id: "user-1",
          platform: "Twitter",
        }),
      );
      expect(result).toEqual(created);
    });
  });

  // --- updateSocialLink ---
  describe("updateSocialLink", () => {
    it("should update a social link successfully", async () => {
      const input = { url: "https://x.com/new" };
      const updated = { ...input, id: "1", user_id: "user-1" };

      mockGetUser.mockResolvedValue({
        data: { user: { id: "user-1" } },
        error: null,
      });
      mockSingle.mockReturnValue({ data: updated, error: null });

      const result = await updateSocialLink("1", input as any);

      expect(mockFrom).toHaveBeenCalledWith("social_links");
      expect(mockUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          url: "https://x.com/new",
        }),
      );
      expect(result).toEqual(updated);
    });
  });

  // --- deleteSocialLink ---
  describe("deleteSocialLink", () => {
    it("should delete a social link successfully", async () => {
      mockGetUser.mockResolvedValue({
        data: { user: { id: "user-1" } },
        error: null,
      });

      await deleteSocialLink("1");

      expect(mockFrom).toHaveBeenCalledWith("social_links");
      expect(mockDelete).toHaveBeenCalled();
      expect(mockEq).toHaveBeenCalledWith("id", "1");
    });
  });

  // --- reorderSocialLinks ---
  describe("reorderSocialLinks", () => {
    it("should update sort_order for multiple social links", async () => {
      const items = [{ id: "1", sort_order: 1 }];

      mockGetUser.mockResolvedValue({
        data: { user: { id: "user-1" } },
        error: null,
      });

      await reorderSocialLinks(items);

      expect(mockFrom).toHaveBeenCalledWith("social_links");
      expect(mockUpdate).toHaveBeenCalledTimes(1);
    });
  });

  // --- getPublicSocialLinks ---
  describe("getPublicSocialLinks", () => {
    it("should return social links for target user", async () => {
      const mockData = [
        { id: "1", platform: "LinkedIn", user_id: "target-user" },
      ];

      mockOrder.mockReturnValue({ data: mockData, error: null });

      const result = await getPublicSocialLinks("target-user");

      expect(mockFrom).toHaveBeenCalledWith("social_links");
      expect(mockSelect).toHaveBeenCalledWith("*");
      expect(mockEq).toHaveBeenCalledWith("user_id", "target-user");
      expect(mockOrder).toHaveBeenCalledWith("sort_order", { ascending: true });
      expect(result).toEqual(mockData);
    });
  });
});
