import { NullableNumber, EventType, EventListener } from './types';

export interface InputInterface {
  readonly value: NullableNumber;
  text: string;
  isValid: boolean;

  on(event: EventType | string, handler: EventListener): void;
}
