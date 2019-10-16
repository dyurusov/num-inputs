export type NullableNumber = number | null | undefined;

export enum EventTypes {
  valueChanged = 'valueChanged',
  textChanged = 'textChanged',
  isValidChanged = 'isValidChanged',
};
export type EventType = keyof EventTypes | string;

export type EventListener = (newValue: any) => void;

export type EventListeners = Map<EventType, Array<EventListener>>;
// export class EventListeners extends Map<EventType, Array<EventListener>> {
// }

// export type EventListeners = { [key: EventType]: Array<EventListener>; };
// export type EventListeners = { [key in EventTypes]?: Array<EventListener> };
