import { z } from 'zod'
import { createSubjects } from "@openauthjs/openauth"

export const subjects = createSubjects({
  user: z.object({
    id: z.string(),
    email: z.string(),
    name: z.string(),
    providers: z.array(z.object({
      provider: z.string(),
      tokenset: z.object({
        access: z.string(),
        refresh: z.string(),
        expiry: z.number(),
        raw: z.record(z.any())
      }),
    })),
    pfp: z.string(),
  }),
})