"use server";

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma/client";
import { revalidatePath } from "next/cache";

export async function createStudyItem(
  studyListId: string,
  slug: string,
  formData: FormData,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  // Verify ownership
  const list = await prisma.studyList.findFirst({
    where: { id: studyListId, userId: user.id },
  });

  if (!list) {
    return { error: "Study list not found" };
  }

  const title = formData.get("title") as string;
  const notes = (formData.get("notes") as string) || null;
  const url = (formData.get("url") as string) || null;

  if (!title || title.trim().length === 0) {
    return { error: "Title is required" };
  }

  // Get next position
  const lastItem = await prisma.studyItem.findFirst({
    where: { studyListId },
    orderBy: { position: "desc" },
  });

  await prisma.studyItem.create({
    data: {
      title: title.trim(),
      notes: notes?.trim() || null,
      url: url?.trim() || null,
      position: (lastItem?.position ?? -1) + 1,
      studyListId,
    },
  });

  revalidatePath(`/dashboard/${slug}`);
  revalidatePath("/dashboard");
  return { success: true };
}

export async function toggleStudyItem(itemId: string, slug: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const item = await prisma.studyItem.findUnique({
    where: { id: itemId },
    include: { studyList: { select: { userId: true } } },
  });

  if (!item || item.studyList.userId !== user.id) {
    return { error: "Item not found" };
  }

  await prisma.studyItem.update({
    where: { id: itemId },
    data: { completed: !item.completed },
  });

  revalidatePath(`/dashboard/${slug}`);
  revalidatePath("/dashboard");
  return { success: true };
}

export async function deleteStudyItem(itemId: string, slug: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const item = await prisma.studyItem.findUnique({
    where: { id: itemId },
    include: { studyList: { select: { userId: true } } },
  });

  if (!item || item.studyList.userId !== user.id) {
    return { error: "Item not found" };
  }

  await prisma.studyItem.delete({ where: { id: itemId } });

  revalidatePath(`/dashboard/${slug}`);
  revalidatePath("/dashboard");
  return { success: true };
}

export async function updateStudyItem(
  itemId: string,
  slug: string,
  formData: FormData,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const item = await prisma.studyItem.findUnique({
    where: { id: itemId },
    include: { studyList: { select: { userId: true } } },
  });

  if (!item || item.studyList.userId !== user.id) {
    return { error: "Item not found" };
  }

  const title = formData.get("title") as string;
  const notes = (formData.get("notes") as string) || null;
  const url = (formData.get("url") as string) || null;

  if (!title || title.trim().length === 0) {
    return { error: "Title is required" };
  }

  await prisma.studyItem.update({
    where: { id: itemId },
    data: {
      title: title.trim(),
      notes: notes?.trim() || null,
      url: url?.trim() || null,
    },
  });

  revalidatePath(`/dashboard/${slug}`);
  return { success: true };
}
