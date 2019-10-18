import Utils from '../utils';


describe('utils', () => {
  describe('parseNumeric', () => {
    const parse = Utils.parseNumeric;
    it('should parse numerics unchaged', () => {
      expect(parse(1)).toBe(1);
      expect(parse(-1)).toBe(-1);
      expect(parse(-1)).toBe(-1);
      expect(parse(-0)).toBe(0);
      expect(parse(+0)).toBe(0);
      expect(parse(+0.4)).toBe(0.4);
    });
  
    it('should parse NaN, undefined and null as null', () => {
      expect(parse(NaN)).toBe(null);
      expect(parse(null)).toBe(null);
      expect(parse(undefined)).toBe(null);
    });
  
    it('should parse empty strings as null', () => {
      expect(parse('')).toBe(null);
      expect(parse('  ')).toBe(null);
      expect(parse('\n\t')).toBe(null);
    })
  
    it('should parse numeric like strings as valid number', () => {
      expect(parse('1')).toBe(1);
      expect(parse('   1 \n')).toBe(1);
      expect(parse('-1')).toBe(-1);
      expect(parse('000')).toBe(0);
      expect(parse('-000')).toBe(0);
      expect(parse('+1')).toBe(1);
      expect(parse('+0010')).toBe(10);
      expect(parse('0010')).toBe(10);
      expect(parse('-0010')).toBe(-10);
      expect(parse('.001')).toBe(0.001);
      expect(parse('-.1')).toBe(-0.1);
      expect(parse('.1000')).toBe(0.1);
      expect(parse('0.1')).toBe(0.1);
      expect(parse('+0.1')).toBe(0.1);
      expect(parse('-0.1')).toBe(-0.1);
      expect(parse('-00010.09100')).toBe(-10.091);
      expect(parse('-1.')).toBe(-1);
      expect(parse('-1.000')).toBe(-1);
      expect(parse('0.0')).toBe(0);
      expect(parse('-0.0')).toBe(0);
    })
  
    it('should not parse non-numeric like strings as undefined', () => {
      expect(parse('wee')).toBe(undefined);
      expect(parse(' ee ')).toBe(undefined);
      expect(parse('123,55')).toBe(undefined);
      expect(parse('1-34')).toBe(undefined);
      expect(parse('12 3')).toBe(undefined);
      expect(parse('12\n3')).toBe(undefined);
      expect(parse('1.2.3')).toBe(undefined);
      expect(parse('1. 23')).toBe(undefined);
      expect(parse('+')).toBe(undefined);
      expect(parse('+-')).toBe(undefined);
      expect(parse('+-23')).toBe(undefined);
    });
  })
});
