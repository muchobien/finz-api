import * as z from "zod"
import { CompleteUser, RelatedUserModel, CompleteTransaction, RelatedTransactionModel } from "./index"

export const AccountModel = z.object({
  id: z.string(),
  name: z.string(),
  color: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  userId: z.string(),
})

export interface CompleteAccount extends z.infer<typeof AccountModel> {
  owner: CompleteUser
  trransactions: CompleteTransaction[]
}

/**
 * RelatedAccountModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedAccountModel: z.ZodSchema<CompleteAccount> = z.lazy(() => AccountModel.extend({
  owner: RelatedUserModel,
  trransactions: RelatedTransactionModel.array(),
}))
