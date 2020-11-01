import Atom from '../classes/Atom';
import Template from '../classes/Template';
import faker from 'faker';

describe('Atom', () => {
  describe('#constructor', () => {
    it('should create an atom', () => {
      const key = faker.lorem.word();
      const value = faker.lorem.word();

      const atom = new Atom(key, value);

      expect(atom.getKey()).toBe(key);
      expect(atom.getValue()).toBe(value);
    });

    describe('should not create an atom', () => {
      it('with a missing key', () => {
        expect(() => {
          new Atom(null, faker.lorem.word());
        }).toThrowError();

        expect(() => {
          new Atom('', faker.lorem.word());
        }).toThrowError();
      });

      it('with a missing value', () => {
        expect(() => {
          new Atom(faker.lorem.word(), null);
        }).toThrowError();

        expect(() => {
          new Atom(faker.lorem.word(), '');
        }).toThrowError();
      });
    });

    it('should allow a Template as value', () => {
      const template = new Template(faker.lorem.word());

      const atom = new Atom(faker.lorem.word(), template);

      expect(atom.getValue()).toBe(template.getValue());
    })
  });

  describe('#getKey', () => {
    it('should return the key', () => {
      let key = faker.lorem.word();
      const atom = new Atom(key, faker.lorem.word());

      expect(atom.getKey()).toEqual(key);
    });
  })

  describe('#getValue', () => {
    it('should return the value', () => {
      let value = faker.lorem.word();
      const atom = new Atom(faker.lorem.word(), value);

      expect(atom.getValue()).toEqual(value);
    });
  })

  describe('#validate', () => {
    it('should validate key', () => {
      expect(() => {
        Atom.validate('', faker.lorem.word());
      }).toThrowError();
    });

    it('should validate value', () => {
      expect(() => {
        Atom.validate(faker.lorem.word(), '');
      }).toThrowError()
    })
  });
});
