export type Event = string;
export type EventListener = (newValue: any) => void;
export type EventUnsubscriber = () => void;


export type ValueType = number | null | undefined | string;

export enum EventTypes {
  valueChanged = 'valueChanged',
  textChanged = 'textChanged',
  isValidChanged = 'isValidChanged',
};
export type EventType = keyof EventTypes | string;


export type EventListeners = Map<EventType, Array<EventListener>>;
