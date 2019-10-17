export type Event = string;
export type EventListener = (newValue: any) => void;
export type EventUnsubscriber = () => void;
export type EventSubscriber = (event: Event, listener: EventListener) => EventUnsubscriber;

export type ValueType = number | null | undefined | string;

export interface InputInterface {
  value: ValueType;
  text: string;
  readonly isValid: boolean;
  readonly hostElement?: HTMLElement;
  on: EventSubscriber;
}
