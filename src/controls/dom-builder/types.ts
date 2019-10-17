import { InputInterface } from '../types';


export interface DomBuilderInterface {
  mount(hostElement: HTMLElement): void;
  unmount(): void;
  readonly isMounted: boolean;
};

export type CssClassNames = {
  [cssClassName: string]: string,
};

export type Options = {
  classNames?: CssClassNames,
};

export type OwnerGetter = () => InputInterface;
