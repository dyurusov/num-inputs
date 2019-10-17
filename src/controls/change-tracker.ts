import { Event, EventListener, EventUnsubscriber } from './types';

type Value = number | string | boolean | null | undefined; // primitive types only
type Snapshort = { [key: string]: Value };
type Attributes = Array<string>;


export class ChangeTracker {
  constructor(private readonly listeners = new Map<string, Array<EventListener>>()) {};

  public on(event: Event, listener: EventListener): EventUnsubscriber {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    (this.listeners.get(event) || []).push(listener)
    return (): void => {
      this.listeners.set(event, (this.listeners.get(event) || []).filter(item => item !== listener));
    }
  }

  public clearListeners(): void {
    this.listeners.clear();
  }

  protected trackChanges(setter: () => void, attrs: Attributes): void {
    const prevSnapshot = this.takeSnapshotFor(attrs);
    setter();
    const newSnapshot = this.takeSnapshotFor(attrs);
    this.emitChangedEventsFor(attrs, prevSnapshot, newSnapshot);
  }

  private takeSnapshotFor(attrs: Attributes): Snapshort {
    const snapshot: Snapshort = {};
    attrs.forEach(attr => {
      snapshot[attr] = (this as any)[attr];
    });
    return snapshot;
  }

  private emitChangedEventsFor(attrs: Attributes, prevSnapshot: Snapshort, newSnapshot: Snapshort): void {
    attrs.forEach(attr => {
      if (prevSnapshot[attr] !== newSnapshot[attr]) {
        this.emit(`${attr}Changed`, newSnapshot[attr]);
      }
    });
  }

  private emit(event: Event, newValue: any): void {
    (this.listeners.get(event) || []).forEach(listener => listener(newValue));
  }
}
