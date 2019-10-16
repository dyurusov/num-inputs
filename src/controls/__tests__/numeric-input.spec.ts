import NumericInput from '../numeric-input';


describe('NumericInput', () => {
  describe('initialization', () => {
    it('should use default values', () => {
      const input = new NumericInput();
      expect(input.value).toBe(null);
      expect(input.text).toBe('');
      expect(input.isValid).toBe(true);
    });
  });


  describe('properties assignment', () => {
    it('should set value properly', () => {
      const input = new NumericInput();

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
      const input = new NumericInput();

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
      const input = new NumericInput();
      input.on('valueChanged', valueChangedListener);
      input.on('textChanged', textChangedListener);
      input.on('isValidChanged', isValidChangedListener);

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
      const input = new NumericInput();
      input.value = 2;

      input.on('valueChanged', valueChangedListener);
      input.on('textChanged', textChangedListener);
      input.on('isValidChanged', isValidChangedListener);

      input.value = 2;
      expect(valueChangedListener.mock.calls.length).toBe(0);
      expect(textChangedListener.mock.calls.length).toBe(0);
      expect(isValidChangedListener.mock.calls.length).toBe(0);
    });
  });
});
