import {
  mockPrisma,
  mockRevalidatePath,
  mockAuthenticated,
  mockUnauthenticated,
  createFormData,
  TEST_USER,
  TEST_STUDY_LIST,
  TEST_STUDY_ITEM,
} from "../helpers/mocks";

import {
  createStudyItem,
  toggleStudyItem,
  deleteStudyItem,
  updateStudyItem,
} from "@/app/(app)/dashboard/[slug]/actions";

beforeEach(() => {
  vi.clearAllMocks();
});

// ── createStudyItem ─────────────────────────────────────────
describe("createStudyItem", () => {
  it("returns error when unauthenticated", async () => {
    mockUnauthenticated();
    const result = await createStudyItem(
      "list-1",
      "my-slug",
      createFormData({ title: "Item" }),
    );
    expect(result).toEqual({ error: "Not authenticated" });
  });

  it("returns error when list not found", async () => {
    mockAuthenticated();
    mockPrisma.studyList.findFirst.mockResolvedValue(null);

    const result = await createStudyItem(
      "nonexistent",
      "my-slug",
      createFormData({ title: "Item" }),
    );
    expect(result).toEqual({ error: "Study list not found" });
  });

  it("returns error when list not owned by user", async () => {
    mockAuthenticated();
    mockPrisma.studyList.findFirst.mockResolvedValue(null); // userId filter excludes it

    const result = await createStudyItem(
      "list-1",
      "my-slug",
      createFormData({ title: "Item" }),
    );
    expect(result).toEqual({ error: "Study list not found" });
  });

  it("returns error when title is empty", async () => {
    mockAuthenticated();
    mockPrisma.studyList.findFirst.mockResolvedValue(TEST_STUDY_LIST);

    const result = await createStudyItem(
      "list-1",
      "my-slug",
      createFormData({ title: "" }),
    );
    expect(result).toEqual({ error: "Title is required" });
  });

  it("creates item at next position", async () => {
    mockAuthenticated();
    mockPrisma.studyList.findFirst.mockResolvedValue(TEST_STUDY_LIST);
    mockPrisma.studyItem.findFirst.mockResolvedValue({ position: 2 });
    mockPrisma.studyItem.create.mockResolvedValue(TEST_STUDY_ITEM);

    await createStudyItem(
      "list-1",
      "my-slug",
      createFormData({
        title: "New Item",
        notes: "Notes",
        url: "https://x.com",
      }),
    );

    expect(mockPrisma.studyItem.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        title: "New Item",
        notes: "Notes",
        url: "https://x.com",
        position: 3,
        studyListId: "list-1",
      }),
    });
  });

  it("sets position 0 when list is empty", async () => {
    mockAuthenticated();
    mockPrisma.studyList.findFirst.mockResolvedValue(TEST_STUDY_LIST);
    mockPrisma.studyItem.findFirst.mockResolvedValue(null);
    mockPrisma.studyItem.create.mockResolvedValue(TEST_STUDY_ITEM);

    await createStudyItem(
      "list-1",
      "my-slug",
      createFormData({ title: "First Item" }),
    );

    expect(mockPrisma.studyItem.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        position: 0,
      }),
    });
  });

  it("trims title, notes, and url", async () => {
    mockAuthenticated();
    mockPrisma.studyList.findFirst.mockResolvedValue(TEST_STUDY_LIST);
    mockPrisma.studyItem.findFirst.mockResolvedValue(null);
    mockPrisma.studyItem.create.mockResolvedValue(TEST_STUDY_ITEM);

    await createStudyItem(
      "list-1",
      "my-slug",
      createFormData({
        title: "  Trimmed  ",
        notes: "  Notes  ",
        url: "  https://x.com  ",
      }),
    );

    expect(mockPrisma.studyItem.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        title: "Trimmed",
        notes: "Notes",
        url: "https://x.com",
      }),
    });
  });

  it("revalidates both paths", async () => {
    mockAuthenticated();
    mockPrisma.studyList.findFirst.mockResolvedValue(TEST_STUDY_LIST);
    mockPrisma.studyItem.findFirst.mockResolvedValue(null);
    mockPrisma.studyItem.create.mockResolvedValue(TEST_STUDY_ITEM);

    await createStudyItem(
      "list-1",
      "my-slug",
      createFormData({ title: "Item" }),
    );

    expect(mockRevalidatePath).toHaveBeenCalledWith("/dashboard/my-slug");
    expect(mockRevalidatePath).toHaveBeenCalledWith("/dashboard");
  });
});

// ── toggleStudyItem ─────────────────────────────────────────
describe("toggleStudyItem", () => {
  it("returns error when unauthenticated", async () => {
    mockUnauthenticated();
    const result = await toggleStudyItem("item-1", "my-slug");
    expect(result).toEqual({ error: "Not authenticated" });
  });

  it("returns error when item not found", async () => {
    mockAuthenticated();
    mockPrisma.studyItem.findUnique.mockResolvedValue(null);

    const result = await toggleStudyItem("nonexistent", "my-slug");
    expect(result).toEqual({ error: "Item not found" });
  });

  it("returns error when item owned by different user", async () => {
    mockAuthenticated();
    mockPrisma.studyItem.findUnique.mockResolvedValue({
      ...TEST_STUDY_ITEM,
      studyList: { userId: "other-user" },
    });

    const result = await toggleStudyItem("item-1", "my-slug");
    expect(result).toEqual({ error: "Item not found" });
  });

  it("toggles false to true", async () => {
    mockAuthenticated();
    mockPrisma.studyItem.findUnique.mockResolvedValue({
      ...TEST_STUDY_ITEM,
      completed: false,
    });
    mockPrisma.studyItem.update.mockResolvedValue(TEST_STUDY_ITEM);

    const result = await toggleStudyItem("item-1", "my-slug");

    expect(result).toEqual({ success: true });
    expect(mockPrisma.studyItem.update).toHaveBeenCalledWith({
      where: { id: "item-1" },
      data: { completed: true },
    });
  });

  it("toggles true to false", async () => {
    mockAuthenticated();
    mockPrisma.studyItem.findUnique.mockResolvedValue({
      ...TEST_STUDY_ITEM,
      completed: true,
    });
    mockPrisma.studyItem.update.mockResolvedValue(TEST_STUDY_ITEM);

    const result = await toggleStudyItem("item-1", "my-slug");

    expect(result).toEqual({ success: true });
    expect(mockPrisma.studyItem.update).toHaveBeenCalledWith({
      where: { id: "item-1" },
      data: { completed: false },
    });
  });
});

// ── deleteStudyItem ─────────────────────────────────────────
describe("deleteStudyItem", () => {
  it("returns error when unauthenticated", async () => {
    mockUnauthenticated();
    const result = await deleteStudyItem("item-1", "my-slug");
    expect(result).toEqual({ error: "Not authenticated" });
  });

  it("returns error when item not found or not owned", async () => {
    mockAuthenticated();
    mockPrisma.studyItem.findUnique.mockResolvedValue(null);

    const result = await deleteStudyItem("nonexistent", "my-slug");
    expect(result).toEqual({ error: "Item not found" });
  });

  it("deletes item and revalidates", async () => {
    mockAuthenticated();
    mockPrisma.studyItem.findUnique.mockResolvedValue(TEST_STUDY_ITEM);
    mockPrisma.studyItem.delete.mockResolvedValue(TEST_STUDY_ITEM);

    const result = await deleteStudyItem("item-1", "my-slug");

    expect(result).toEqual({ success: true });
    expect(mockPrisma.studyItem.delete).toHaveBeenCalledWith({
      where: { id: "item-1" },
    });
    expect(mockRevalidatePath).toHaveBeenCalledWith("/dashboard/my-slug");
    expect(mockRevalidatePath).toHaveBeenCalledWith("/dashboard");
  });
});

// ── updateStudyItem ─────────────────────────────────────────
describe("updateStudyItem", () => {
  it("returns error when unauthenticated", async () => {
    mockUnauthenticated();
    const result = await updateStudyItem(
      "item-1",
      "my-slug",
      createFormData({ title: "Updated" }),
    );
    expect(result).toEqual({ error: "Not authenticated" });
  });

  it("returns error when item not found or not owned", async () => {
    mockAuthenticated();
    mockPrisma.studyItem.findUnique.mockResolvedValue(null);

    const result = await updateStudyItem(
      "nonexistent",
      "my-slug",
      createFormData({ title: "Updated" }),
    );
    expect(result).toEqual({ error: "Item not found" });
  });

  it("returns error when title is empty", async () => {
    mockAuthenticated();
    mockPrisma.studyItem.findUnique.mockResolvedValue(TEST_STUDY_ITEM);

    const result = await updateStudyItem(
      "item-1",
      "my-slug",
      createFormData({ title: "" }),
    );
    expect(result).toEqual({ error: "Title is required" });
  });

  it("updates item fields", async () => {
    mockAuthenticated();
    mockPrisma.studyItem.findUnique.mockResolvedValue(TEST_STUDY_ITEM);
    mockPrisma.studyItem.update.mockResolvedValue(TEST_STUDY_ITEM);

    const result = await updateStudyItem(
      "item-1",
      "my-slug",
      createFormData({
        title: "Updated Title",
        notes: "Updated notes",
        url: "https://new.com",
      }),
    );

    expect(result).toEqual({ success: true });
    expect(mockPrisma.studyItem.update).toHaveBeenCalledWith({
      where: { id: "item-1" },
      data: {
        title: "Updated Title",
        notes: "Updated notes",
        url: "https://new.com",
      },
    });
    expect(mockRevalidatePath).toHaveBeenCalledWith("/dashboard/my-slug");
  });
});
