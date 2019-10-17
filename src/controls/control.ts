import { ChangeTracker } from './change-tracker';
import { ParserInterface } from './parser/types';
import { DomBuilderInterface } from './dom-builder/types';
import { ValueType, InputInterface } from './types';


export class Control extends ChangeTracker implements InputInterface {
  protected _hostElement?: HTMLElement;
  protected _value: ValueType = null;
  protected _text = '';


  constructor(
    element: HTMLElement | string,
    protected readonly parser: ParserInterface,
    protected readonly domBuilder: DomBuilderInterface,
  ) {
    super();
    this.domBuilder.bindOwner(this);
    this._hostElement = (element instanceof HTMLElement ? element : document.getElementById(element)) || undefined;
    this.mount();
  }


  mount(): void {
    if (this.hostElement && !this.domBuilder.isMounted) {
      this.domBuilder.mount(this.hostElement);
    }
  }

  destroy(): void {
    if (this.domBuilder.isMounted) {
      this.clearListeners();
      this.domBuilder.unmount();
    }
  }


  get hostElement(): HTMLElement | undefined {
    return this._hostElement;
  }

  get isMounted(): boolean {
    return this.domBuilder.isMounted;
  }

  get isValid(): boolean {
    return this._value !== undefined;
  }


  get value(): ValueType {
    return this._value;
  }

  set value(value: ValueType) {
    this.trackChanges(() => {
      const parsedValue = this.parser.parse(value);
      if ((parsedValue === undefined) || (parsedValue === null)) {
        this._value = null;
        this._text = '';
      } else {
        this._value = parsedValue;
        this._text = this._value.toString();
      }
    });
  }


  get text(): string {
    return this._text;
  }

  set text(text: string) {
    this.trackChanges(() => {
      this._text = text;
      this._value = this.parser.parse(text);
    });
  }


  protected trackChanges(setter: () => void): void {
    return super.trackChanges(setter, [
      'value',
      'text',
      'isValid',
    ]);
  }
}
