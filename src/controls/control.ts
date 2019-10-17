import { ChangeTracker } from './change-tracker';
import { ParserInterface } from './parser/types';
import { DomBuilderInterface } from './dom-builder/types';

export class Control extends ChangeTracker {
  constructor(protected readonly parser: ParserInterface, protected readonly domBuilder: DomBuilderInterface) {
    super();
  }
}
