const expect = require('chai').expect;
const httpMocks = require('node-mocks-http');
const sinon = require('sinon');
const controller = require('../server/controllers/user.controller');
const model = require('../server/models').user;
const wishlist = require('../server/models').wishlist;

describe('When creating a user', () => {
  // SANDBOX VERSION : creating a fake server
  const sandbox = sinon.createSandbox({
    useFakeTimers: true
  });
  // SANDBOX VERSION does not need it, because sandbox creates a new timer
  // let timer = {}; // variable to hold the timer

  afterEach(() => { 
    // wishlist.create.restore && wishlist.create.restore(); // restoring all stubs after the tests: wishlist, model, timer
    // model.create.restore && model.create.restore(); // check if .restore is a valid property, if it is then call .restore()  . This way If restore is not a property, then we don't get an error for calling a function that doesn't exist
    // timer.restore && timer.restore();

    // SANDBOX VERSION: you can replace the above 3 lines with this
    sandbox.restore(); // you can restore all spies, stubs, mocks or fakes gets cleaned up. Ensures there is never a rogue function running loose
  });

  it('should have a customerSince field', () => {
    const req = httpMocks.createRequest({
      body: {
        firstName: 'test',
        lastName: 'tester',
        email: 'test@test.com'
      }
    });

    const res = httpMocks.createResponse();

    // stub out the Wishlist.create() function
    // const myStub = sinon.stub(objectToStub, 'methodToStub').resolves('value / array / object / function')
    // const newList = sinon.stub(wishlist, 'create');

    // SANDBOX VERSION
    const newList = sandbox.stub(wishlist, 'create');

    newList.resolves({
      dataValues: {
        id: 1
      }
    });

    // spy on the user.create() function
    // const userCreate = sinon.spy(model, 'create');

    // SANDBOX VERSION
    const userCreate = sandbox.spy(model, 'create');

    return controller.create(req, res).then(() => { // call the function on the controller that's going the create the new 'use strict';
      expect(userCreate.calledWith(sinon.match({ // assert that userCreate spy was called with the right arguments
        customerSince: sinon.match.date // sinon matcher   . Checks that customerSince field is of date type
      }))).to.eql(true);
      // expect(userCreate.calledWith({ // assert that userCreate spy was called with the right arguments
      //   firstName: 'test',
      //   lastName: 'tester',
      //   email: 'test@test.com',
      //   wishlistId: 1,
      //   customerSince: sinon.match.date // sinon matcher   . Checks that customerSince field is of date type
      // })).to.eql(true);
    });

  });

  it('Should set the customer since field to new Date', () => {
    // SANDBOX VERSION does not need it, because sandbox creates a new timer
    // timer = sinon.useFakeTimers(); // faking the timer : const timer = sinon.useFakeTimer()

    const req = httpMocks.createRequest({
      body: {
        firstName: 'test',
        lastName: 'tester',
        email: 'test@test.com'
      }
    });

    const res = httpMocks.createResponse();

    // const newList = sinon.stub(wishlist, 'create');

    // SANDBOX VERSION
    const newList = sandbox.stub(wishlist, 'create');

    newList.resolves({
      dataValues: {
        id: 1
      }
    });

    // spy on the user.create() function
    // const userCreate = sinon.spy(model, 'create');

    // SANDBOX VERSION
    const userCreate = sandbox.spy(model, 'create');

    return controller.create(req, res).then(() => {
      expect(userCreate.args[0][0].customerSince).to.eql(new Date()); // we replaced the previous check for code that checks the actual current value
    }); // this checks that userCreate function is called with an object and one of the parameters of that object is customerSince field. We are verifying it is set to any new date
  });
});