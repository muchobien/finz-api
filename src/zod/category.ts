import * as z from "zod"
import { CompleteTransaction, RelatedTransactionModel } from "./index"

export const CategoryModel = z.object({
  id: z.string(),
  name: z.string(),
  color: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompleteCategory extends z.infer<typeof CategoryModel> {
  transactions: CompleteTransaction[]
}

/**
 * RelatedCategoryModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedCategoryModel: z.ZodSchema<CompleteCategory> = z.lazy(() => CategoryModel.extend({
  transactions: RelatedTransactionModel.array(),
}))
