const expect = require('chai').expect;
const httpMocks = require('node-mocks-http');
const sinon = require('sinon');
const controller = require('../server/controllers/book.controller');
const model = require('../server/models').book;
const transaction = require('../server/models').transaction;

describe('Books controller', () => {
  const sandbox = sinon.createSandbox(); // creating the sandbox. Sandbox has the ability to create spies, stubs and mocks
  afterEach(() => {
    // model.findById.restore && model.findById.restore();
    // SANDBOX VERSION
    sandbox.restore(); // with the sandbox.restore(), you don't have to check if the restore is function before calling it
  });

  describe('When getting a list of books', () => {
    it('Should return 4 books', () => {
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();

      // sinon.stub(objectToStub, 'methodToStub').resolves('value / array / object / function')
      sinon.stub(model, 'all').resolves([{}, {}, {}, {}]);  // the objects can be empty because we are only checking the count
      return controller.list(req, res).then(() => {
        return expect(res._getData().length).to.eql(4);
      });
    });
  });

  describe('When creating a book', () => {
    it('Should add the book to the database', () => {
      const book = {
        title: 'Test Book',
        author: 'John Q Public',
        publicationDate: '2018-01-01',
        isbn: '1234567890'
      };
      const req = httpMocks.createRequest({ // httMocks fakes http calls
        body: book // fake request object
      });

      const res = httpMocks.createResponse(); // fake response object

      sinon.spy(model, 'create'); // sinon.spy(objectToSpyOn, 'methodToSpyOn')

      return controller.create(req, res).then(() => { // simulating a post call with .create
        // return expect(res._getData().dataValues.title).to.eql(book.title);
        // return expect(model.create.called).to.be.true; // expect(mySpy.called).to.be.true . This was checking just that it was called
        expect(model.create.args[0][0].title).to.equal('Test Book'); // expect(mySpy.args[0][0].to.equal('argValueAtCoordinate')  . This is checking it's called and the specific value of the property
        // return expect(model.create.called).to.be.true;
      });
    });
  });

  describe('When getting a specific book', () => {
    describe('and the book does not exist', () => {
      it('Should return a 404', () => {
        const req = httpMocks.createRequest({
          params: {
            id: 7
          }
        });

        const res = httpMocks.createResponse();

        // // sinon.stub(objectToStub, 'methodToStub').resolves('value / array / object / function')
        // const find = sinon.stub(model, 'findById'); // stubbing the findById() function of model, which getById is using on crud.js
        // find.withArgs(7).resolves(null); // configure the stub for the case of id 7 being passed in. Null will simulate not being able to find it

        // SANDBOX VERSION
        const find = sandbox.stub(model, 'findById'); // replaced sinon with sandbox variable. You still are creating a stub, but you are placing that stub into your sandbox
        find.withArgs(7).resolves(null); // configure the stub for the case of id 7 being passed in. Null will simulate not being able to find it

        return controller.getById(req, res).then(() => {
          return expect(res.statusCode).to.eql(404);
        });
      });
      afterEach(() => {
        model.findById.restore(); // after setting up the stub, you need to clean it per test to avoid the error 'TypeError: Attempted to wrap findById which is already wrapped'
      });
    });
    describe('and the book exists', () => {
      it('Should return 200', () => {
        const req = httpMocks.createRequest({
          params: {
            id: 7
          }
        });

        const res = httpMocks.createResponse();

        // sinon.stub(objectToStub, 'methodToStub').resolves('value / array / object / function')
        // const find = sinon.stub(model, 'findById'); // stubbing the findById() function of model, which getById is using on crud.js

        // SANDBOX VERSION
        const find = sandbox.stub(model, 'findById'); // replaced sinon with sandbox variable. You still are creating a stub, but you are placing that stub into your sandbox

        find.resolves({
          id: 7
        }); // configure the stub to resolve when id: 7 is passed in

        return controller.getById(req, res).then(() => {
          return expect(res.statusCode).to.equal(200);
        });
      });
      afterEach(() => {
        model.findById.restore(); // after setting up the stub, you need to clean it per test to avoid the error 'TypeError: Attempted to wrap findById which is already wrapped'
      });
    });
  });

  describe('When purchasing a book', () => {
    it('Should add a transaction ', () => {
      const req = httpMocks.createRequest({
        body: {
          amount: 10.97,
          user_id: 23
        },
        params: {
          id: 1
        }
      });

      const res = httpMocks.createResponse();

      // const myMock = sinon.mock(objectToMock)
      const tx = sinon.mock(transaction); // mock for transaction
      // myMock.expects('methodToMock').once().withArgs(n).resolves()
      tx.expects('create').once().withArgs({
        id: 1,
        user_id: 23,
        amount: 10.97
      }).resolves({}); // to make the mock from a normal function into a promise

      return controller.purchase(req, res).then(() => { // call  the system under test
        tx.verify(); // verify
      });
    });
  });
});