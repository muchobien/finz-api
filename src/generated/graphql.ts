import type { Prisma } from '@prisma/client';
import type { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import type { MercuriusContext } from 'mercurius';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => Promise<import('mercurius-codegen').DeepPartial<TResult>> | import('mercurius-codegen').DeepPartial<TResult>;
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: Date;
  /** A date string, such as 2007-12-03, compliant with the `full-date` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  Date: Date;
  /** Represents NULL values */
  Void: void;
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: Prisma.JsonValue;
  _FieldSet: any;
};

export type Role = 'ADMIN' | 'USER' | 'UNKNOWN';

export type Account = {
  __typename?: 'Account';
  id: Scalars['ID'];
  name: Scalars['String'];
  color?: Maybe<Scalars['String']>;
  balance: Scalars['Float'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  transactions: Array<Transaction>;
};

export type Query = {
  __typename?: 'Query';
  account: Account;
  accounts: Array<Account>;
  transaction: Transaction;
  transactions: Array<Transaction>;
  user: User;
  users: Array<User>;
  category: Category;
  categories: Array<Category>;
};

export type QueryaccountArgs = {
  id: Scalars['ID'];
};

export type QuerytransactionArgs = {
  id: Scalars['ID'];
};

export type QueryuserArgs = {
  id: Scalars['ID'];
};

export type QuerycategoryArgs = {
  id: Scalars['ID'];
};

export type AccountInput = {
  name: Scalars['String'];
  color: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createAccount: Account;
  updateAccount: Account;
  deleteAccount?: Maybe<Scalars['Void']>;
  createTransaction: Transaction;
  updateTransaction: Transaction;
  deleteTransaction?: Maybe<Scalars['Void']>;
  updateUser: User;
  deleteUser?: Maybe<Scalars['Void']>;
  register: Authenticated;
  login: Authenticated;
  refreshToken: Credential;
  createCategory: Category;
  updateCategory: Category;
  deleteCategory?: Maybe<Scalars['Void']>;
};

export type MutationcreateAccountArgs = {
  input: AccountInput;
};

export type MutationupdateAccountArgs = {
  id: Scalars['ID'];
  input: AccountInput;
};

export type MutationdeleteAccountArgs = {
  id: Scalars['ID'];
};

export type MutationcreateTransactionArgs = {
  input: TransactionInput;
};

export type MutationupdateTransactionArgs = {
  id: Scalars['ID'];
  input: TransactionInput;
};

export type MutationdeleteTransactionArgs = {
  id: Scalars['ID'];
};

export type MutationupdateUserArgs = {
  id: Scalars['ID'];
  input: UserInput;
};

export type MutationdeleteUserArgs = {
  id: Scalars['ID'];
};

export type MutationregisterArgs = {
  input: AuthInput;
};

export type MutationloginArgs = {
  input: AuthInput;
};

export type MutationcreateCategoryArgs = {
  input: CategoryInput;
};

export type MutationupdateCategoryArgs = {
  id: Scalars['ID'];
  input: CategoryInput;
};

export type MutationdeleteCategoryArgs = {
  id: Scalars['ID'];
};

export type TransactionKind = 'INCOME' | 'EXPENSE' | 'TRANSFER';

export type Transaction = {
  __typename?: 'Transaction';
  id: Scalars['ID'];
  name: Scalars['String'];
  amount: Scalars['Float'];
  date: Scalars['Date'];
  kind: TransactionKind;
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  category: Category;
};

export type TransactionInput = {
  name: Scalars['String'];
  amount: Scalars['Float'];
  date: Scalars['Date'];
  kind: TransactionKind;
  categoryId: Scalars['ID'];
  accountId: Scalars['ID'];
};

export type User = {
  __typename?: 'User';
  id: Scalars['ID'];
  email: Scalars['String'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  settings: Scalars['JSON'];
  accounts: Array<Account>;
};

export type Credential = {
  __typename?: 'Credential';
  accessToken: Scalars['String'];
  refreshToken: Scalars['String'];
  tokenKind: Scalars['String'];
};

export type Authenticated = {
  __typename?: 'Authenticated';
  user: User;
  credential: Credential;
};

export type UserInput = {
  email: Scalars['String'];
};

export type AuthInput = {
  provider: Provider;
  email: Scalars['String'];
  token: Scalars['String'];
};

export type Provider = 'APPLE' | 'GOOGLE' | 'LOCAL';

export type Category = {
  __typename?: 'Category';
  id: Scalars['ID'];
  name: Scalars['String'];
  color?: Maybe<Scalars['String']>;
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
};

export type CategoryInput = {
  name: Scalars['String'];
  color?: InputMaybe<Scalars['String']>;
};

export type ResolverTypeWrapper<T> = Promise<T> | T;

export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo,
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (
  obj: T,
  context: TContext,
  info: GraphQLResolveInfo,
) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  DateTime: ResolverTypeWrapper<Scalars['DateTime']>;
  Date: ResolverTypeWrapper<Scalars['Date']>;
  Void: ResolverTypeWrapper<Scalars['Void']>;
  JSON: ResolverTypeWrapper<Scalars['JSON']>;
  Role: Role;
  Account: ResolverTypeWrapper<Account>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  String: ResolverTypeWrapper<Scalars['String']>;
  Float: ResolverTypeWrapper<Scalars['Float']>;
  Query: ResolverTypeWrapper<{}>;
  AccountInput: AccountInput;
  Mutation: ResolverTypeWrapper<{}>;
  TransactionKind: TransactionKind;
  Transaction: ResolverTypeWrapper<Transaction>;
  TransactionInput: TransactionInput;
  User: ResolverTypeWrapper<User>;
  Credential: ResolverTypeWrapper<Credential>;
  Authenticated: ResolverTypeWrapper<Authenticated>;
  UserInput: UserInput;
  AuthInput: AuthInput;
  Provider: Provider;
  Category: ResolverTypeWrapper<Category>;
  CategoryInput: CategoryInput;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  DateTime: Scalars['DateTime'];
  Date: Scalars['Date'];
  Void: Scalars['Void'];
  JSON: Scalars['JSON'];
  Account: Account;
  ID: Scalars['ID'];
  String: Scalars['String'];
  Float: Scalars['Float'];
  Query: {};
  AccountInput: AccountInput;
  Mutation: {};
  Transaction: Transaction;
  TransactionInput: TransactionInput;
  User: User;
  Credential: Credential;
  Authenticated: Authenticated;
  UserInput: UserInput;
  AuthInput: AuthInput;
  Category: Category;
  CategoryInput: CategoryInput;
  Boolean: Scalars['Boolean'];
};

export type authDirectiveArgs = {
  requires?: Maybe<Role>;
};

export type authDirectiveResolver<
  Result,
  Parent,
  ContextType = MercuriusContext,
  Args = authDirectiveArgs,
> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date';
}

export interface VoidScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Void'], any> {
  name: 'Void';
}

export interface JSONScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSON'], any> {
  name: 'JSON';
}

export type AccountResolvers<
  ContextType = MercuriusContext,
  ParentType extends ResolversParentTypes['Account'] = ResolversParentTypes['Account'],
> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  color?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  balance?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  transactions?: Resolver<Array<ResolversTypes['Transaction']>, ParentType, ContextType>;
  isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<
  ContextType = MercuriusContext,
  ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query'],
> = {
  account?: Resolver<ResolversTypes['Account'], ParentType, ContextType, RequireFields<QueryaccountArgs, 'id'>>;
  accounts?: Resolver<Array<ResolversTypes['Account']>, ParentType, ContextType>;
  transaction?: Resolver<
    ResolversTypes['Transaction'],
    ParentType,
    ContextType,
    RequireFields<QuerytransactionArgs, 'id'>
  >;
  transactions?: Resolver<Array<ResolversTypes['Transaction']>, ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<QueryuserArgs, 'id'>>;
  users?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType>;
  category?: Resolver<ResolversTypes['Category'], ParentType, ContextType, RequireFields<QuerycategoryArgs, 'id'>>;
  categories?: Resolver<Array<ResolversTypes['Category']>, ParentType, ContextType>;
};

export type MutationResolvers<
  ContextType = MercuriusContext,
  ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation'],
> = {
  createAccount?: Resolver<
    ResolversTypes['Account'],
    ParentType,
    ContextType,
    RequireFields<MutationcreateAccountArgs, 'input'>
  >;
  updateAccount?: Resolver<
    ResolversTypes['Account'],
    ParentType,
    ContextType,
    RequireFields<MutationupdateAccountArgs, 'id' | 'input'>
  >;
  deleteAccount?: Resolver<
    Maybe<ResolversTypes['Void']>,
    ParentType,
    ContextType,
    RequireFields<MutationdeleteAccountArgs, 'id'>
  >;
  createTransaction?: Resolver<
    ResolversTypes['Transaction'],
    ParentType,
    ContextType,
    RequireFields<MutationcreateTransactionArgs, 'input'>
  >;
  updateTransaction?: Resolver<
    ResolversTypes['Transaction'],
    ParentType,
    ContextType,
    RequireFields<MutationupdateTransactionArgs, 'id' | 'input'>
  >;
  deleteTransaction?: Resolver<
    Maybe<ResolversTypes['Void']>,
    ParentType,
    ContextType,
    RequireFields<MutationdeleteTransactionArgs, 'id'>
  >;
  updateUser?: Resolver<
    ResolversTypes['User'],
    ParentType,
    ContextType,
    RequireFields<MutationupdateUserArgs, 'id' | 'input'>
  >;
  deleteUser?: Resolver<
    Maybe<ResolversTypes['Void']>,
    ParentType,
    ContextType,
    RequireFields<MutationdeleteUserArgs, 'id'>
  >;
  register?: Resolver<
    ResolversTypes['Authenticated'],
    ParentType,
    ContextType,
    RequireFields<MutationregisterArgs, 'input'>
  >;
  login?: Resolver<ResolversTypes['Authenticated'], ParentType, ContextType, RequireFields<MutationloginArgs, 'input'>>;
  refreshToken?: Resolver<ResolversTypes['Credential'], ParentType, ContextType>;
  createCategory?: Resolver<
    ResolversTypes['Category'],
    ParentType,
    ContextType,
    RequireFields<MutationcreateCategoryArgs, 'input'>
  >;
  updateCategory?: Resolver<
    ResolversTypes['Category'],
    ParentType,
    ContextType,
    RequireFields<MutationupdateCategoryArgs, 'id' | 'input'>
  >;
  deleteCategory?: Resolver<
    Maybe<ResolversTypes['Void']>,
    ParentType,
    ContextType,
    RequireFields<MutationdeleteCategoryArgs, 'id'>
  >;
};

export type TransactionResolvers<
  ContextType = MercuriusContext,
  ParentType extends ResolversParentTypes['Transaction'] = ResolversParentTypes['Transaction'],
> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  amount?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  date?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  kind?: Resolver<ResolversTypes['TransactionKind'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  category?: Resolver<ResolversTypes['Category'], ParentType, ContextType>;
  isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserResolvers<
  ContextType = MercuriusContext,
  ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User'],
> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  settings?: Resolver<ResolversTypes['JSON'], ParentType, ContextType>;
  accounts?: Resolver<Array<ResolversTypes['Account']>, ParentType, ContextType>;
  isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CredentialResolvers<
  ContextType = MercuriusContext,
  ParentType extends ResolversParentTypes['Credential'] = ResolversParentTypes['Credential'],
> = {
  accessToken?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  refreshToken?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  tokenKind?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AuthenticatedResolvers<
  ContextType = MercuriusContext,
  ParentType extends ResolversParentTypes['Authenticated'] = ResolversParentTypes['Authenticated'],
> = {
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  credential?: Resolver<ResolversTypes['Credential'], ParentType, ContextType>;
  isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CategoryResolvers<
  ContextType = MercuriusContext,
  ParentType extends ResolversParentTypes['Category'] = ResolversParentTypes['Category'],
> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  color?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = MercuriusContext> = {
  DateTime?: GraphQLScalarType;
  Date?: GraphQLScalarType;
  Void?: GraphQLScalarType;
  JSON?: GraphQLScalarType;
  Account?: AccountResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Transaction?: TransactionResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  Credential?: CredentialResolvers<ContextType>;
  Authenticated?: AuthenticatedResolvers<ContextType>;
  Category?: CategoryResolvers<ContextType>;
};

export type DirectiveResolvers<ContextType = MercuriusContext> = {
  auth?: authDirectiveResolver<any, any, ContextType>;
};

export type Loader<TReturn, TObj, TParams, TContext> = (
  queries: Array<{
    obj: TObj;
    params: TParams;
  }>,
  context: TContext & {
    reply: import('fastify').FastifyReply;
  },
) => Promise<Array<import('mercurius-codegen').DeepPartial<TReturn>>>;
export type LoaderResolver<TReturn, TObj, TParams, TContext> =
  | Loader<TReturn, TObj, TParams, TContext>
  | {
      loader: Loader<TReturn, TObj, TParams, TContext>;
      opts?: {
        cache?: boolean;
      };
    };
export interface Loaders<TContext = import('mercurius').MercuriusContext & { reply: import('fastify').FastifyReply }> {
  Account?: {
    id?: LoaderResolver<Scalars['ID'], Account, {}, TContext>;
    name?: LoaderResolver<Scalars['String'], Account, {}, TContext>;
    color?: LoaderResolver<Maybe<Scalars['String']>, Account, {}, TContext>;
    balance?: LoaderResolver<Scalars['Float'], Account, {}, TContext>;
    createdAt?: LoaderResolver<Scalars['DateTime'], Account, {}, TContext>;
    updatedAt?: LoaderResolver<Scalars['DateTime'], Account, {}, TContext>;
    transactions?: LoaderResolver<Array<Transaction>, Account, {}, TContext>;
  };

  Transaction?: {
    id?: LoaderResolver<Scalars['ID'], Transaction, {}, TContext>;
    name?: LoaderResolver<Scalars['String'], Transaction, {}, TContext>;
    amount?: LoaderResolver<Scalars['Float'], Transaction, {}, TContext>;
    date?: LoaderResolver<Scalars['Date'], Transaction, {}, TContext>;
    kind?: LoaderResolver<TransactionKind, Transaction, {}, TContext>;
    createdAt?: LoaderResolver<Scalars['DateTime'], Transaction, {}, TContext>;
    updatedAt?: LoaderResolver<Scalars['DateTime'], Transaction, {}, TContext>;
    category?: LoaderResolver<Category, Transaction, {}, TContext>;
  };

  User?: {
    id?: LoaderResolver<Scalars['ID'], User, {}, TContext>;
    email?: LoaderResolver<Scalars['String'], User, {}, TContext>;
    createdAt?: LoaderResolver<Scalars['DateTime'], User, {}, TContext>;
    updatedAt?: LoaderResolver<Scalars['DateTime'], User, {}, TContext>;
    settings?: LoaderResolver<Scalars['JSON'], User, {}, TContext>;
    accounts?: LoaderResolver<Array<Account>, User, {}, TContext>;
  };

  Credential?: {
    accessToken?: LoaderResolver<Scalars['String'], Credential, {}, TContext>;
    refreshToken?: LoaderResolver<Scalars['String'], Credential, {}, TContext>;
    tokenKind?: LoaderResolver<Scalars['String'], Credential, {}, TContext>;
  };

  Authenticated?: {
    user?: LoaderResolver<User, Authenticated, {}, TContext>;
    credential?: LoaderResolver<Credential, Authenticated, {}, TContext>;
  };

  Category?: {
    id?: LoaderResolver<Scalars['ID'], Category, {}, TContext>;
    name?: LoaderResolver<Scalars['String'], Category, {}, TContext>;
    color?: LoaderResolver<Maybe<Scalars['String']>, Category, {}, TContext>;
    createdAt?: LoaderResolver<Scalars['DateTime'], Category, {}, TContext>;
    updatedAt?: LoaderResolver<Scalars['DateTime'], Category, {}, TContext>;
  };
}
declare module 'mercurius' {
  interface IResolvers extends Resolvers<import('mercurius').MercuriusContext> {}
  interface MercuriusLoaders extends Loaders {}
}
