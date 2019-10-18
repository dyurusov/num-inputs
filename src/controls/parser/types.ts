export type ValueType = string | number | undefined | null;

export type ParsedType = number | undefined | null;

export interface ParserInterface {
  parse(value: ValueType): ParsedType;
}
