const expect = require('chai').expect;
const httpMocks = require('node-mocks-http');
const controller = require('./user.controller');
const model = require('../models').user;
const wishlist = require('../models').wishlist;
const sinon = require('sinon');

describe('When creating a user', () => {
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
    const newList = sinon.stub(wishlist, 'create');
    newList.resolves({
      dataValues: {
        id: 1
      }
    });

    // spy on the user.create() function
    const userCreate = sinon.spy(model, 'create');
    return controller.create(req, res).then(() => { // call the function on the controller that's going the create the new 'use strict';
      expect(userCreate.calledWith(sinon.match({ // assert that userCreate spy was called with the right arguments
        customerSince: sinon.match.date // sinon matcher   . This field should be a date
      }))).to.eql(true);
      // expect(userCreate.calledWith({ // assert that userCreate spy was called with the right arguments
      //   firstName: 'test',
      //   lastName: 'tester',
      //   email: 'test@test.com',
      //   wishlistId: 1,
      //   customerSince: sinon.match.date // sinon matcher   . This field should be a date
      // })).to.eql(true);
    });

  });
});