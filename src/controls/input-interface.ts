import { ValueType, Event, EventListener } from './types';

export interface InputInterface {
  readonly value: ValueType;
  text: string;
  isValid: boolean;
  readonly hostElement?: HTMLElement;

  on(event: Event, handler: EventListener): void;
}
