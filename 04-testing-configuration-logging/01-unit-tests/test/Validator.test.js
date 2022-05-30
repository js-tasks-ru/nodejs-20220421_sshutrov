const Validator = require('../Validator');
const expect = require('chai').expect;

describe('testing-configuration-logging/unit-tests', () => {
  describe('Валидатор проверяет строковые поля', () => {
    const validator = new Validator({
      name: {
        type: 'string',
        min: 5,
        max: 10, 
      }
    });

    it('Проверка соответствия типу', () => {      
      const errors = validator.validate({ name: 17 });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('error').and.to.be.equal('expect string, got number');
    });

    it('Проверка минимальной длины', () => {
      const errors = validator.validate({ name: 'Lala' });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too short, expect 5, got 4');
    });

    it('Проверка максимальной длины', () => {
      const errors = validator.validate({ name: 'Lalalalalal' });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too long, expect 10, got 11');
    });
  });


  describe('Валидатор проверяет числовые поля', () => {
    const validator = new Validator({
      age: {
        type: 'number',
        min: 18,
        max: 27,
      }
    });

    it('Проверка соответствия типу', () => {      
      const errors = validator.validate({ age: '17' });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('error').and.to.be.equal('expect number, got string');
    });

    it('Проверка минимального значения', () => {
      const errors = validator.validate({ age: 17 });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('age');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too little, expect 18, got 17');
    });

    it('Проверка максимального значения', () => {
      const errors = validator.validate({ age: 28 });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('age');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too big, expect 27, got 28');
    });
  });
});