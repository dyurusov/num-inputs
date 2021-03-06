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
  });


  describe('parseExpression', () => {
    const parse = Utils.parseExpression;

    it('should parse empty string as null', () => {
      expect(parse('')).toBe(null);
      expect(parse('   ')).toBe(null);
    })

    it('should parse valid numbers', () => {
      expect(parse('1')).toBe(1);
      expect(parse('-01.4050')).toBe(-1.405);
    })

    it('should parse as valid numbers', () => {
      expect(parse('-1 + 1')).toBe(0);
      expect(parse('1 + 1')).toBe(2);
      expect(parse('1 + (1)')).toBe(2);
      expect(parse('(1) + 1')).toBe(2);
      expect(parse('(-1) + 1')).toBe(0);
      expect(parse('(-1) + (-1)')).toBe(-2);
      expect(parse('(-1) - (-1)')).toBe(0);
      expect(parse('1* 1 ')).toBe(1);
      expect(parse('-(-1) + (2 +4)/(-2)')).toBe(-2);
      expect(parse('5*96-4')).toBe(476);
      expect(parse('5*(96)-4')).toBe(476);
      expect(parse('5*(40+56)-4')).toBe(476);
      expect(parse('20/5')).toBe(4);
      expect(parse('40+56')).toBe(96);
      expect(parse('5*(40+56)')).toBe(480);
      expect(parse('5*(40+7*8)-20')).toBe(460);
      expect(parse('1-1/1')).toBe(0);
      expect(parse('1*1-1/1')).toBe(0);
      expect(parse('5*96-20/5')).toBe(476);
      expect(parse('5*(40+7*8)-20/5')).toBe(476);
      expect(parse('5*(40+7*8)-20/(5)')).toBe(476);
      expect(parse('5*(40+7*8)-20/(42-37)')).toBe(476);
      expect(parse('1.2 - 1.2/6')).toBe(1);
      expect(parse('(1+ (1.2- 4)/3.8 +78)/15 - 3*(34-78.9)')).toBeCloseTo(139.91754386);
      expect(parse('-(1+ (1.2- 4)/3.8 +78)/15 + 3*(34-78.9)')).toBeCloseTo(-139.91754386);
    })
  });


  describe('parseExpressionCondence', () => {
    const parse = Utils.parseExpressionCondence;

    it('should throw on invalid chars', () => {
      expect(() => parse('w')).toThrow();
      expect(() => parse('^')).toThrow();
      expect(() => parse('[')).toThrow();
      expect(() => parse(']')).toThrow();
      expect(() => parse('{')).toThrow();
      expect(() => parse('}')).toThrow();
      expect(() => parse('\\')).toThrow();
      expect(() => parse('!')).toThrow();
      expect(() => parse('@')).toThrow();
      expect(() => parse('$')).toThrow();
      expect(() => parse(':')).toThrow();
      expect(() => parse('_')).toThrow();
      expect(() => parse('=')).toThrow();
      expect(() => parse(',')).toThrow();
      expect(() => parse('>')).toThrow();
      expect(() => parse('<')).toThrow();
      expect(() => parse('?')).toThrow();
      expect(() => parse(';')).toThrow();
      expect(() => parse('|')).toThrow();
      expect(() => parse('"')).toThrow();
      expect(() => parse('|')).toThrow();
    });

    it('should throw on spaces within numbers', () => {
      expect(() => parse('1 2')).toThrow();
      expect(() => parse('1 .2')).toThrow();
      expect(() => parse('1. 3')).toThrow();
      expect(() => parse('1 .')).toThrow();
      expect(() => parse('. 2')).toThrow();
    })

    it('should throw on doubled actions', () => {
      expect(() => parse('+ +')).toThrow();
      expect(() => parse('-  +')).toThrow();
      expect(() => parse('/ +')).toThrow();
      expect(() => parse('*+')).toThrow();
      expect(() => parse('-  *')).toThrow();
      expect(() => parse('- /')).toThrow();
      expect(() => parse('--')).toThrow();
      expect(() => parse('/ / ')).toThrow();
    });

    it('should throw on immediately adjacent unsimilar brackets', () => {
      expect(() => parse('()')).toThrow();
      expect(() => parse(')(')).toThrow();
      expect(() => parse('(  )')).toThrow();
      expect(() => parse(')  (')).toThrow();
    });

    it('should throw on invalid number of openning and closing brackets', () => {
      expect(() => parse(')')).toThrow();
      expect(() => parse(') ( (')).toThrow();
      expect(() => parse('( (')).toThrow();
    });

    it('should throw on invalid number of openning and closing brackets', () => {
      expect(() => parse(')')).toThrow();
      expect(() => parse(') ( (')).toThrow();
      expect(() => parse('( (')).toThrow();
    });

    it('should throw on opening brackets without action before', () => {
      expect(() => parse('22 (4)')).toThrow();
      expect(() => parse('3.(3)')).toThrow();
    });

    it('should throw on closing brackets without action after', () => {
      expect(() => parse('(4)33')).toThrow();
      expect(() => parse('(3) .4')).toThrow();
    });

    it('should perform appropriate conversions', () => {
      expect(parse('- .123 + 45')).toBe('-.123+45');
      expect(parse('((-123 ) -( + 45))')).toBe('((-123)-(+45))');
    });
  });


  describe('parseExpressionHandleMultiplicationGroups', () => {
    const parse = Utils.parseExpressionHandleMultiplicationGroups;

    it('should parse correctly', () => {
      expect(parse('1+1')).toBe(2);
      expect(parse('-1+1')).toBe(0);
      expect(parse('(-1)+1')).toBe(0);
      expect(parse('1*1')).toBe(1);
      expect(parse('1*1-1/1')).toBe(0);
    });
  });


  describe('parseExpressionHandleBrackets', () => {
    const parse = Utils.parseExpressionHandleBrackets;

    it('should throw on * or / in the first position', () => {
      expect(() => parse('*123')).toThrow();
      expect(() => parse('/123')).toThrow();
    });

    it('should throw on +, -, * or / in the last position', () => {
      expect(() => parse('123+')).toThrow();
      expect(() => parse('123.-')).toThrow();
      expect(() => parse('123./')).toThrow();
      expect(() => parse('123.*')).toThrow();
    });
  });


  describe('findClosingBracket', () => {
    const find = Utils.findClosingBracket;

    it('should throw on start position without openning bracket', () => {
      expect(() => find('dsf', 1)).toThrow();
    });

    it('should throw on non-found closing bracket', () => {
      expect(() => find('d(sf', 1)).toThrow();
      expect(() => find('d( 44(sf)', 1)).toThrow();
    });

    it('should find corresponding closing bracket', () => {
      expect(find('d()4', 1)).toBe(2);
      expect(find('d(sf)4', 1)).toBe(4);
      expect(find('d (s()(()))f)4', 2)).toBe(10);
      expect(find('d(s()(( ) ))f)4', 5)).toBe(10);
    });
  });

  describe('parseExpressionMultiply', () => {
    const parse = Utils.parseExpressionMultiply;

    it('should multiply ans divide', () => {
      expect(parse('1*1')).toBe(1);
      expect(parse('2/2')).toBe(1);
      expect(parse('3*2*1')).toBe(6);
      expect(parse('3*2/1')).toBe(6);
      expect(parse('11*42/11')).toBe(42);
      expect(parse('11/11/1')).toBe(1);
      expect(parse('3*(-2)/1')).toBe(-6);
      expect(parse('3*2/(-1)*1')).toBe(-6);
      expect(parse('3*2/(-1)*(-1)')).toBe(6);
      expect(parse('3*2/(-1)')).toBe(-6);
      expect(parse('(-3)*2/(-1)')).toBe(6);
      expect(parse('1/0')).toBe(Infinity);
    });
  });


  describe('parseExpressionAdding', () => {
    const parse = Utils.parseExpressionAdding;

    it('should add and substract', () => {
      expect(parse('1+1')).toBe(2);
      expect(parse('2-2')).toBe(0);
      expect(parse('3-2+1')).toBe(2);
      expect(parse('3+2-1')).toBe(4);
      expect(parse('-3+2-1')).toBe(-2);
      expect(parse('+3+2-1')).toBe(4);
      expect(parse('+(-3)+2-1')).toBe(-2);
      expect(parse('11+42+(-11)')).toBe(42);
      expect(parse('(-11)-(-11)+1')).toBe(1);
      expect(parse('-1+1')).toBe(0);
    });
  });
});
