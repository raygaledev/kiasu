"use server";

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma/client";
import { generateSlug } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export async function createStudyList(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const title = formData.get("title") as string;
  const description = (formData.get("description") as string) || null;

  if (!title || title.trim().length === 0) {
    return { error: "Title is required" };
  }

  let slug = generateSlug(title);

  // Ensure slug is unique for this user
  const existing = await prisma.studyList.findUnique({
    where: { userId_slug: { userId: user.id, slug } },
  });

  if (existing) {
    slug = `${slug}-${Date.now()}`;
  }

  await prisma.studyList.create({
    data: {
      title: title.trim(),
      description: description?.trim() || null,
      slug,
      isPublic: true,
      userId: user.id,
    },
  });

  revalidatePath("/dashboard");
  return { success: true };
}

export async function updateStudyList(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const description = (formData.get("description") as string) || null;

  if (!title || title.trim().length === 0) {
    return { error: "Title is required" };
  }

  // Verify ownership
  const existing = await prisma.studyList.findFirst({
    where: { id, userId: user.id },
  });

  if (!existing) {
    return { error: "Study list not found" };
  }

  let slug = existing.slug;
  if (title.trim() !== existing.title) {
    slug = generateSlug(title);
    const slugTaken = await prisma.studyList.findFirst({
      where: { userId: user.id, slug, id: { not: id } },
    });
    if (slugTaken) {
      slug = `${slug}-${Date.now()}`;
    }
  }

  await prisma.studyList.update({
    where: { id },
    data: {
      title: title.trim(),
      description: description?.trim() || null,
      slug,
    },
  });

  revalidatePath("/dashboard");
  return { success: true };
}

export async function deleteStudyList(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const existing = await prisma.studyList.findFirst({
    where: { id, userId: user.id },
  });

  if (!existing) {
    return { error: "Study list not found" };
  }

  // Cascade delete handles items automatically
  await prisma.studyList.delete({ where: { id } });

  revalidatePath("/dashboard");
  return { success: true };
}
