import { ChangeTracker } from './change-tracker';
import { ParserInterface } from './parser/types';
// import { DomBuilderInterface } from './dom-builder/types';

export class Control extends ChangeTracker {
  // constructor(element: HTMLElement | string, protected readonly parser: ParserInterface, protected readonly builder: DomBuilderInterface) {
  constructor(protected readonly parser: ParserInterface) {
    super();
  }
}
