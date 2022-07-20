import * as z from "zod"
import { Decimal } from "decimal.js"
import { TransactionKind } from "@prisma/client"
import { CompleteCategory, RelatedCategoryModel, CompleteAccount, RelatedAccountModel } from "./index"

// Helper schema for Decimal fields
z
  .instanceof(Decimal)
  .or(z.string())
  .or(z.number())
  .refine((value) => {
    try {
      return new Decimal(value)
    } catch (error) {
      return false
    }
  })
  .transform((value) => new Decimal(value))

export const TransactionModel = z.object({
  id: z.string(),
  name: z.string(),
  amount: z.number(),
  kind: z.nativeEnum(TransactionKind),
  date: z.date(),
  createdAt: z.date(),
  updatedAt: z.date(),
  categoryId: z.string(),
  accountId: z.string(),
})

export interface CompleteTransaction extends z.infer<typeof TransactionModel> {
  category: CompleteCategory
  account: CompleteAccount
}

/**
 * RelatedTransactionModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedTransactionModel: z.ZodSchema<CompleteTransaction> = z.lazy(() => TransactionModel.extend({
  category: RelatedCategoryModel,
  account: RelatedAccountModel,
}))
