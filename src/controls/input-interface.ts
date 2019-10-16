import { NullableNumber, EventType, EventListener } from './types';

export interface InputInterface {
  readonly value: NullableNumber;
  text: string;
  isValid: boolean;
  readonly hostElement?: HTMLElement;

  on(event: EventType | string, handler: EventListener): void;
}
