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
  });


  describe('widget', () => {
    it('should append content to container on mounting', () => {
      new NumericInput(container);
      const widget = document.querySelector('.number-input-widget');
      expect(widget).toBeInTheDocument();
      const widgetInput = document.querySelector('.number-input-widget input');
      expect(widgetInput).toBeInTheDocument();
    });

    it('should handle focus and blur events', () => {
      new NumericInput(container);
      const widget = document.querySelector('.number-input-widget');
      const widgetInput = widget && widget.querySelector('input');
      expect(widgetInput).not.toHaveFocus();
      expect(widget).not.toHaveClass('has-focus');
      widgetInput && widgetInput.focus();
      expect(widgetInput).toHaveFocus();
      expect(widget).toHaveClass('has-focus');
      widgetInput && widgetInput.blur();
      expect(widgetInput).not.toHaveFocus();
      expect(widget).not.toHaveClass('has-focus');
    });

    it('should handle valid/invalid value', () => {
      const input = new NumericInput(container);
      const widget = document.querySelector('.number-input-widget');
      expect(widget).not.toHaveClass('is-invalid');
      input.text = '123';
      expect(widget).not.toHaveClass('is-invalid');
      input.text = 'abc';
      expect(widget).toHaveClass('is-invalid');
      input.text = '123';
      expect(widget).not.toHaveClass('is-invalid');
    });

    it('should reflect control change', () => {
      const input = new NumericInput(container);
      const widget = document.querySelector('.number-input-widget');
      const widgetInput = widget && widget.querySelector('input');
      expect(widgetInput && widgetInput.value).toBe('');

      input.value = 2;
      expect(widgetInput && widgetInput.value).toBe('2');

      input.text = 'rr';
      expect(widgetInput && widgetInput.value).toBe('rr');
    });
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

      input.value = '45.77.90';
      expect(input.value).toBe(null);
      expect(input.text).toBe('');
      expect(input.isValid).toBe(true);

      input.value = '-1.4t';
      expect(input.value).toBe(null);
      expect(input.text).toBe('');
      expect(input.isValid).toBe(true);

      input.value = null;
      expect(input.value).toBe(null);
      expect(input.text).toBe('');
      expect(input.isValid).toBe(true);

      input.value = '+03.12';
      expect(input.value).toBe(3.12);
      expect(input.text).toBe('3.12');
      expect(input.isValid).toBe(true);

      input.value = '-3.12';
      expect(input.value).toBe(-3.12);
      expect(input.text).toBe('-3.12');
      expect(input.isValid).toBe(true);

      input.value = 'null';
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

      input.text = '45.56df';
      expect(input.value).toBe(undefined);
      expect(input.text).toBe('45.56df');
      expect(input.isValid).toBe(false);

      input.text = '-f45.56df';
      expect(input.value).toBe(undefined);
      expect(input.text).toBe('-f45.56df');
      expect(input.isValid).toBe(false);

      input.text = '45';
      expect(input.value).toBe(45);
      expect(input.text).toBe('45');
      expect(input.isValid).toBe(true);

      input.text = '-545.56.8';
      expect(input.value).toBe(undefined);
      expect(input.text).toBe('-545.56.8');
      expect(input.isValid).toBe(false);

      input.text = '45.';
      expect(input.value).toBe(45);
      expect(input.text).toBe('45.');
      expect(input.isValid).toBe(true);

      input.text = '003';
      expect(input.value).toBe(3);
      expect(input.text).toBe('003');
      expect(input.isValid).toBe(true);
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
      expect(valueChangedListener.mock.calls.length).toBe(0);
      expect(textChangedListener.mock.calls.length).toBe(0);
      expect(isValidChangedListener.mock.calls.length).toBe(0);

      input.value = 2;
      expect(valueChangedListener.mock.calls.length).toBe(1);
      expect(valueChangedListener.mock.calls[0].length).toBe(1);
      expect(valueChangedListener.mock.calls[0][0]).toBe(2);
      expect(textChangedListener.mock.calls.length).toBe(1);
      expect(textChangedListener.mock.calls[0].length).toBe(1);
      expect(textChangedListener.mock.calls[0][0]).toBe('2');
      expect(isValidChangedListener.mock.calls.length).toBe(0);
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
      expect(textChangedListener.mock.calls[1][0]).toBe('wwe');
      expect(isValidChangedListener.mock.calls.length).toBe(1);
      expect(isValidChangedListener.mock.calls[0].length).toBe(1);
      expect(isValidChangedListener.mock.calls[0][0]).toBe(false);

      input.text = '-3.06r';
      expect(valueChangedListener.mock.calls.length).toBe(2);
      expect(textChangedListener.mock.calls.length).toBe(3);
      expect(textChangedListener.mock.calls[2].length).toBe(1);
      expect(textChangedListener.mock.calls[2][0]).toBe('-3.06r');
      expect(isValidChangedListener.mock.calls.length).toBe(1);
    });

    it('should not emit events on the same text change', () => {
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
