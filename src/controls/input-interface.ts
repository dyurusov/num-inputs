import { NullableNumber, Events, EventListener } from './types';

export interface InputInterface {
  readonly value: NullableNumber;
  text: string;
  isValid: boolean;

  on(event: Events | string, handler: EventListener)
}
