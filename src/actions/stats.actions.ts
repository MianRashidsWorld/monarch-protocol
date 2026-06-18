"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

const allocateSchema = z.object({
  str: z.coerce.number().int().min(0),
  intel: z.coerce.number().int().min(0),
  agi: z.coerce.number().int().min(0),
  wil: z.coerce.number().int().min(0),
});

export type AllocateState = { error?: string; success?: boolean };

export async function allocateStats(
  _prev: AllocateState,
  formData: FormData
): Promise<AllocateState> {
  const parsed = allocateSchema.safeParse({
    str: formData.get("str"),
    intel: formData.get("intel"),
    agi: formData.get("agi"),
    wil: formData.get("wil"),
  });

  if (!parsed.success) return { error: "Invalid values." };

  const { str, intel, agi, wil } = parsed.data;
  const totalAllocated = str + intel + agi + wil;

  if (totalAllocated === 0) return { error: "Allocate at least 1 point." };

  return await prisma.$transaction(async (tx) => {
    const character = await tx.character.findUniqueOrThrow({ where: { id: 1 } });

    if (totalAllocated > character.unallocatedPoints) {
      return { error: `You only have ${character.unallocatedPoints} points to allocate.` };
    }

    await tx.stats.update({
      where: { characterId: 1 },
      data: { str: { increment: str }, intel: { increment: intel }, agi: { increment: agi }, wil: { increment: wil } },
    });

    await tx.character.update({
      where: { id: 1 },
      data: { unallocatedPoints: { decrement: totalAllocated } },
    });

    await tx.questLog.create({
      data: {
        characterId: 1,
        event: "STAT_ALLOCATED",
        note: `STR+${str} INT+${intel} AGI+${agi} WIL+${wil}`,
      },
    });

    revalidatePath("/stats");
    revalidatePath("/dashboard");

    return { success: true };
  });
}
