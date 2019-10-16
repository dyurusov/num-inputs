export type NullableNumber = number | null | undefined;

export enum EventTypes {
  valueChanged = 'valueChanged',
  textChanged = 'textChanged',
  isValidChanged = 'isValidChanged',
};
export type EventType = keyof EventTypes | string;

export type EventListener = (newValue: any) => void;

export type EventListeners = Map<EventType, Array<EventListener>>;
