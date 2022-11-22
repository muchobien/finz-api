import '@app/schema/account.js';
import '@app/schema/category.js';
import '@app/schema/transaction.js';
import '@app/schema/user.js';
import { builder } from '@app/builder.js';

export const schema = builder.toSchema();
