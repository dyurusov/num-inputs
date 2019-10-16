export type NullableNumber = number | null | undefined;

export enum Events {
  valueChanged = 'valueChanged',
  textChanged = 'textChanged',
  isValidChanged = 'isValidChanged',
};
// export type EventName = EventNames | string;

export type EventListener = (newValue: any) => void;

export type EventListeners = { [key in Events]?: Array<EventListener> };
