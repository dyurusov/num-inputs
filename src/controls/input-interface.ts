import { ValueType, EventType, EventListener } from './types';

export interface InputInterface {
  readonly value: ValueType;
  text: string;
  isValid: boolean;
  readonly hostElement?: HTMLElement;

  on(event: EventType | string, handler: EventListener): void;
}
