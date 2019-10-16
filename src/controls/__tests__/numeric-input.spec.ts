import NumericInput from '../numeric-input';
import { domElementFactory } from './dom.helper';
import '@testing-library/jest-dom/extend-expect';


const contanerId = 'container-id';
let container: any = undefined;

beforeEach(() => {
  container = domElementFactory(contanerId);
  document.body.appendChild(container);
});

afterEach(() => {
  if (container instanceof HTMLElement) {
    container.remove();
  }
  container = undefined;
});


describe('NumericInput', () => {
  describe('mounting', () => {
    it('should be mounted on existing DOM by elemnt', () => {
      const input = new NumericInput(container);
      expect(input.isMounted).toBe(true);
      expect(container).not.toBeEmpty();
      expect(container.innerHTML).not.toBe('');
      expect(input.hostElement).toBe(container);
    });

    it('should be mounted on existing DOM by elemnt id', () => {
      const input = new NumericInput(contanerId);
      expect(input.isMounted).toBe(true);
      const container = document.getElementById(contanerId);
      expect(container).not.toBeEmpty();
      expect(container && container.innerHTML).not.toBe('');
      expect(input.hostElement).toBe(container);
    });

    it('should not be mounted on nonexisting DOM by elemnt id', () => {
      const input = new NumericInput(`${contanerId}-1`);
      expect(input.isMounted).toBe(false);
      expect(container).toBeEmpty();
      expect(container.innerHTML).toBe('');
      expect(input.hostElement).toBeUndefined();
    });

    it.todo('should not mount on mounted container');
    it.todo('should append content to container on munting');
  });


  describe('destroy', () => {
    it('should remove host element content', () => {
      const input = new NumericInput(container);
      expect(input.isMounted).toBe(true);
      input.destroy();
      expect(input.isMounted).toBe(false);
      expect(input.hostElement).toBeDefined();
      const hostContainer = document.getElementById(contanerId);
      expect(hostContainer).toBeEmpty();
    })
  });


  describe('initialization', () => {
    it('should use default values', () => {
      const input = new NumericInput(container);
      expect(input.value).toBe(null);
      expect(input.text).toBe('');
      expect(input.isValid).toBe(true);
    });
  });


  describe('properties assignment', () => {
    it('should set value properly', () => {
      const input = new NumericInput(container);

      input.value = 0;
      expect(input.value).toBe(0);
      expect(input.text).toBe('0');
      expect(input.isValid).toBe(true);

      input.value = undefined;
      expect(input.value).toBe(null);
      expect(input.text).toBe('');
      expect(input.isValid).toBe(true);

      input.value = -40.78;
      expect(input.value).toBe(-40.78);
      expect(input.text).toBe('-40.78');
      expect(input.isValid).toBe(true);

      input.value = 45;
      expect(input.value).toBe(45);
      expect(input.text).toBe('45');
      expect(input.isValid).toBe(true);

      input.value = null;
      expect(input.value).toBe(null);
      expect(input.text).toBe('');
      expect(input.isValid).toBe(true);
    });


    it('should set text properly', () => {
      const input = new NumericInput(container);

      input.text = '0';
      expect(input.value).toBe(0);
      expect(input.text).toBe('0');
      expect(input.isValid).toBe(true);

      input.text = '';
      expect(input.value).toBe(null);
      expect(input.text).toBe('');
      expect(input.isValid).toBe(true);

      input.text = '-40.78';
      expect(input.value).toBe(-40.78);
      expect(input.text).toBe('-40.78');
      expect(input.isValid).toBe(true);

      input.text = '45';
      expect(input.value).toBe(45);
      expect(input.text).toBe('45');
      expect(input.isValid).toBe(true);

      input.text = '45.56df';
      expect(input.value).toBe(45.56);
      expect(input.text).toBe('45.56');
      expect(input.isValid).toBe(true);

      input.text = '-f45.56df';
      expect(input.value).toBe(undefined);
      expect(input.text).toBe('');
      expect(input.isValid).toBe(false);
    });
  });

  describe('events', () => {
    it('should emit events on value change', () => {
      const valueChangedListener = jest.fn();
      const textChangedListener = jest.fn();
      const isValidChangedListener = jest.fn();
      const input = new NumericInput(container);
      input.on('valueChanged', valueChangedListener);
      input.on('textChanged', textChangedListener);
      input.on('isValidChanged', isValidChangedListener);

      input.value = 'asd';
      expect(valueChangedListener.mock.calls.length).toBe(1);
      expect(valueChangedListener.mock.calls[0].length).toBe(1);
      expect(valueChangedListener.mock.calls[0][0]).toBe(undefined);
      expect(textChangedListener.mock.calls.length).toBe(0);
      expect(isValidChangedListener.mock.calls.length).toBe(1);
      expect(isValidChangedListener.mock.calls[0].length).toBe(1);
      expect(isValidChangedListener.mock.calls[0][0]).toBe(false);

      input.value = 2;
      expect(valueChangedListener.mock.calls.length).toBe(2);
      expect(valueChangedListener.mock.calls[1].length).toBe(1);
      expect(valueChangedListener.mock.calls[1][0]).toBe(2);
      expect(textChangedListener.mock.calls.length).toBe(1);
      expect(textChangedListener.mock.calls[0].length).toBe(1);
      expect(textChangedListener.mock.calls[0][0]).toBe('2');
      expect(isValidChangedListener.mock.calls.length).toBe(2);
      expect(isValidChangedListener.mock.calls[1].length).toBe(1);
      expect(isValidChangedListener.mock.calls[1][0]).toBe(true);
    });

    it('should not emit events on the same value change', () => {
      const valueChangedListener = jest.fn();
      const textChangedListener = jest.fn();
      const isValidChangedListener = jest.fn();
      const input = new NumericInput(container);
      input.value = 2;

      input.on('valueChanged', valueChangedListener);
      input.on('textChanged', textChangedListener);
      input.on('isValidChanged', isValidChangedListener);

      input.value = 2;
      expect(valueChangedListener.mock.calls.length).toBe(0);
      expect(textChangedListener.mock.calls.length).toBe(0);
      expect(isValidChangedListener.mock.calls.length).toBe(0);

      input.text = '2';
      expect(valueChangedListener.mock.calls.length).toBe(0);
      expect(textChangedListener.mock.calls.length).toBe(0);
      expect(isValidChangedListener.mock.calls.length).toBe(0);
    });

    it('should emit events on text change', () => {
      const valueChangedListener = jest.fn();
      const textChangedListener = jest.fn();
      const isValidChangedListener = jest.fn();
      const input = new NumericInput(container);
      input.on('valueChanged', valueChangedListener);
      input.on('textChanged', textChangedListener);
      input.on('isValidChanged', isValidChangedListener);

      input.text = '2';
      expect(valueChangedListener.mock.calls.length).toBe(1);
      expect(valueChangedListener.mock.calls[0].length).toBe(1);
      expect(valueChangedListener.mock.calls[0][0]).toBe(2);
      expect(textChangedListener.mock.calls.length).toBe(1);
      expect(textChangedListener.mock.calls[0].length).toBe(1);
      expect(textChangedListener.mock.calls[0][0]).toBe('2');
      expect(isValidChangedListener.mock.calls.length).toBe(0);

      input.text = 'wwe';
      expect(valueChangedListener.mock.calls.length).toBe(2);
      expect(valueChangedListener.mock.calls[1].length).toBe(1);
      expect(valueChangedListener.mock.calls[1][0]).toBe(undefined);
      expect(textChangedListener.mock.calls.length).toBe(2);
      expect(textChangedListener.mock.calls[1].length).toBe(1);
      expect(textChangedListener.mock.calls[1][0]).toBe('');
      expect(isValidChangedListener.mock.calls.length).toBe(1);
      expect(isValidChangedListener.mock.calls[0].length).toBe(1);
      expect(isValidChangedListener.mock.calls[0][0]).toBe(false);

      input.text = '-3.06r';
      expect(valueChangedListener.mock.calls.length).toBe(3);
      expect(valueChangedListener.mock.calls[2].length).toBe(1);
      expect(valueChangedListener.mock.calls[2][0]).toBe(-3.06);
      expect(textChangedListener.mock.calls.length).toBe(3);
      expect(textChangedListener.mock.calls[2].length).toBe(1);
      expect(textChangedListener.mock.calls[2][0]).toBe('-3.06');
      expect(isValidChangedListener.mock.calls.length).toBe(2);
      expect(isValidChangedListener.mock.calls[1].length).toBe(1);
      expect(isValidChangedListener.mock.calls[1][0]).toBe(true);
    });

    it('should not emit events on text change', () => {
      const valueChangedListener = jest.fn();
      const textChangedListener = jest.fn();
      const isValidChangedListener = jest.fn();
      const input = new NumericInput(container);
      input.text = '2';

      input.on('valueChanged', valueChangedListener);
      input.on('textChanged', textChangedListener);
      input.on('isValidChanged', isValidChangedListener);

      input.text = '2';
      expect(valueChangedListener.mock.calls.length).toBe(0);
      expect(textChangedListener.mock.calls.length).toBe(0);
      expect(isValidChangedListener.mock.calls.length).toBe(0);

      input.value = 2;
      expect(valueChangedListener.mock.calls.length).toBe(0);
      expect(textChangedListener.mock.calls.length).toBe(0);
      expect(isValidChangedListener.mock.calls.length).toBe(0);
    });
  });
});
