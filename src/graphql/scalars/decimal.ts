import Decimal from 'decimal.js';
import { GraphQLScalarType, GraphQLScalarTypeConfig, Kind } from 'graphql';

const config: GraphQLScalarTypeConfig<null | string | number | Decimal, string> = {
  name: 'Decimal',
  description: 'An arbitrary-precision Decimal type',
  serialize(value) {
    return String(value);
  },
  parseValue(value) {
    return new Decimal(value as Decimal.Value);
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.INT || ast.kind === Kind.FLOAT || ast.kind === Kind.STRING) {
      return new Decimal(ast.value);
    }
    return null;
  },
};

export const DecimalResolver = new GraphQLScalarType(config);

export const DecimalDefinition = 'scalar Decimal';
