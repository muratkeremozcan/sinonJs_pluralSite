const expect = require('chai').expect;
const httpMocks = require('node-mocks-http'); // Mock 'http' objects for testing Express and Koa routing functions, but could be used for testing any Node.js web server applications that have code that requires mockups of the request and response objects. https://www.npmjs.com/package/node-mocks-http
const controller = require('./book.controller');
const model = require('../models').book;
const transaction = require('../models').transaction;
var sinon = require('sinon');


describe.only('Books controller', () => {
  describe('When getting a list of books', () => {
    it('Should return 4 books', () => {
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();

      // sinon.stub(objectToStub, 'methodToStub').resolves('value / array / object / function')
      sinon.stub(model, 'all').resolves([{}, {}, {}, {}]); // the objects can be empty because we are only checking the count
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

        // sinon.stub(objectToStub, 'methodToStub').resolves('value / array / object / function')
        const find = sinon.stub(model, 'findById'); // stubbing the findById() function of model, which getById is using on crud.js
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
        const find = sinon.stub(model, 'findById'); // stubbing the findById() function of model, which getById is using on crud.js
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