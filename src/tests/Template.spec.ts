import Atom from '../classes/Atom';
import Template from '../classes/Template';
import faker from 'faker';

describe('Template', () => {
  describe('#constructor', () => {
    it('should initialize a Template', () => {
      const atomKeys = Array(Math.ceil(Math.random() * 15)).fill(null).map(() => faker.lorem.word());
      const templateString = atomKeys.map((atomKey) => `{{${atomKey}}}`).join('_');
      const template = new Template(templateString);

      expect(template.getTemplate()).toBe(templateString);
    });

    it('should initialize a Template with an empty list of atoms', () => {
      const template = new Template(faker.lorem.word());

      expect(Object.entries(template.getAtoms).length).toEqual(0);
    });

    it('should initialize a Template with its atoms', () => {
      const atomKeys = Array(Math.ceil(Math.random() * 6)).fill(null).map(() => faker.lorem.word());
      const atoms = atomKeys.reduce((prev, curr) => ({
        ...prev,
        [curr]: new Atom(curr, faker.lorem.word()),
      }), {});

      const template = new Template(faker.lorem.word(), atoms);
      const templateAtoms = template.getAtoms();

      Object.entries(atoms).forEach(([key, atom]) => {
        expect(Object.keys(templateAtoms).indexOf(key)).toBeGreaterThan(-1);
        expect(Object.values(templateAtoms).indexOf(atom)).toBeGreaterThan(-1);
      });
    });

    it('should not allow an empty template string', () => {
      expect(() => {
        new Template();
      }).toThrowError();

      expect(() => {
        new Template(null);
      }).toThrowError();

      expect(() => {
        new Template('');
      }).toThrowError();
    });

    it('should not allow invalid initial atoms', () => {
      const atoms = {
        [faker.lorem.word()]: faker.lorem.word(),
      };

      expect(() => {
        new Template(faker.lorem.word(), atoms);
      }).toThrowError();
    });
  });

  describe('#getTemplate', () => {
    it('should return the template string', () => {
      const templateString = faker.lorem.word();
      const template = new Template(templateString);

      expect(template.getTemplate()).toBe(templateString);
    });

    it('should remain the same after setting atoms', () => {
      const templateString = faker.lorem.word();
      const template = new Template(templateString);

      expect(template.getTemplate()).toBe(templateString);

      template.setAtom(faker.lorem.word(), faker.lorem.word());

      expect(template.getTemplate()).toBe(templateString);
    });
  });

  describe('#setTemplate', () => {
    it('should update the template', () => {
      const templateString = faker.lorem.word();
      const newTemplateString = faker.lorem.word();
      const template = new Template(templateString);

      expect(template.getTemplate()).toBe(templateString);

      template.setTemplate(newTemplateString);

      expect(template.getTemplate()).not.toBe(templateString);
      expect(template.getTemplate()).toBe(newTemplateString);
    });

    it('should not allow an invalid or null template', () => {
      const templateString = faker.lorem.word();
      const template = new Template(templateString);

      expect(() => {
        template.setTemplate();
      }).toThrowError();

      expect(() => {
        template.setTemplate(null);
      }).toThrowError();

      expect(() => {
        template.setTemplate('');
      }).toThrowError();
    });
  });

  describe('#setAtom', () => {
    it('should set an Atom', () => {
      const atomKey = faker.lorem.word();
      const atomValue = faker.lorem.word();
      const atom = new Atom(atomKey, atomValue);
      const template = new Template(faker.lorem.word());

      template.setAtom(atom);

      const atoms = template.getAtoms();

      expect(Object.keys(atoms).indexOf(atomKey)).toBeGreaterThan(-1);
      expect(Object.values(atoms).indexOf(atom)).toBeGreaterThan(-1);
    });

    it('should set a string-string pair', () => {
      const atomKey = faker.lorem.word();
      const atomValue = faker.lorem.word();
      const template = new Template(faker.lorem.word());

      template.setAtom(atomKey, atomValue);

      const atoms = template.getAtoms();

      expect(Object.keys(atoms).indexOf(atomKey)).toBeGreaterThan(-1);
      expect(Object.values(atoms).findIndex((atom) => atom.getValue() === atomValue)).toBeGreaterThan(-1);
    });

    it('should set a string-template pair', () => {
      const atomKey = faker.lorem.word();
      const atomValue = new Template(faker.lorem.word());
      const template = new Template(faker.lorem.word());

      template.setAtom(atomKey, atomValue);

      const atoms = template.getAtoms();

      expect(Object.keys(atoms).indexOf(atomKey)).toBeGreaterThan(-1);
      expect(Object.values(atoms).findIndex((atom) => atom.getValue() === atomValue.getValue())).toBeGreaterThan(-1);
    });
  });

  describe('#getValue', () => {
    let atomKey;
    let atomValue;
    let templateString;
    let otherTemplateString;
    let otherAtomKey;
    let otherAtomValue;

    beforeEach(() => {
      atomKey = faker.lorem.word();
      atomValue = faker.lorem.word();
      otherAtomKey = faker.lorem.word();
      otherAtomValue = faker.lorem.word();

      templateString = `{{${atomKey}}}`;
      otherTemplateString = `{{${otherAtomKey}}}_{{${atomKey}}}`;
    });

    it('returns the correct value', () => {
      const template = new Template(templateString);
      template.setAtom(atomKey, atomValue);

      expect(template.getValue()).toBe(atomValue);
    });

    it('returns the unassigned atoms as they are', () => {
      templateString = `{{${atomKey}}}_{{${otherAtomKey}}}`;

      const template = new Template(templateString);
      template.setAtom(atomKey, atomValue);

      expect(template.getValue()).toBe(`${atomValue}_{{${otherAtomKey}}}`);
    });

    it('returns the updated string when updating the template string', () => {
      templateString = `{{${atomKey}}}_{{${otherAtomKey}}}`;

      const template = new Template(templateString);
      template.setAtom(atomKey, atomValue);
      template.setAtom(otherAtomKey, otherAtomValue);

      expect(template.getValue()).toBe(`${atomValue}_${otherAtomValue}`);

      template.setTemplate(otherTemplateString);
      expect(template.getValue()).toBe(`${otherAtomValue}_${atomValue}`);
    });

    it('defines a template atom value to determine the value', () => {
      const template = new Template(templateString);
      const otherTemplate = new Template(otherTemplateString);

      otherTemplate.setAtom(otherAtomKey, otherAtomValue);
      otherTemplate.setAtom(atomKey, atomValue);

      template.setAtom(atomKey, otherTemplate);

      expect(template.getValue()).toBe(otherTemplate.getValue());
    });

    it('updates the value when a template atom changes', () => {
      const template = new Template(templateString);
      const otherTemplate = new Template(otherTemplateString);

      otherTemplate.setAtom(otherAtomKey, otherAtomValue);
      otherTemplate.setAtom(atomKey, atomValue);

      template.setAtom(atomKey, otherTemplate);

      const templateValue = template.getValue();

      expect(templateValue).toBe(otherTemplate.getValue());

      otherTemplate.setAtom(otherAtomKey, atomValue);

      expect(template.getValue()).not.toBe(templateValue);
      expect(template.getValue()).toBe(`${atomValue}_${atomValue}`);
    });
  });

  describe('#getAtoms', () => {
    it('returns the specified atoms', () => {
      const atoms = Array(5).fill(null).map(() => [faker.lorem.word(), faker.lorem.word()]);

      const template = new Template(faker.lorem.word());

      atoms.forEach(([atomKey, atomValue]) => {
        template.setAtom(atomKey, atomValue);
      });

      const templateAtoms = Object.keys(template.getAtoms());

      expect(templateAtoms).toHaveLength(atoms.length);

      expect(templateAtoms.filter((atomKey) => atoms.find(([atom]) => atom === atomKey))).toHaveLength(atoms.length);
    });
  });
});
