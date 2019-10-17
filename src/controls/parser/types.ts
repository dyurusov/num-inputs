export type ValueType = string | number | undefined | null;

/**
 *  - number for correctly parsed value
 *  - null for empty parsed value
 *  - undefined for incorect value
 */
export type ParsedType = number | undefined | null;

export interface ParserInterface {
  parse(value: ValueType): ParsedType;
}
