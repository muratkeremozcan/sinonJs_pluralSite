import getPrices from './currency.js';
// ignore the chai, sinon errors, the html imports these for you. These tests run in the browser
const expect = chai.expect;

describe('Currency Tests', () => {
  let xhr, requests;
  beforeEach(() => {
    xhr = sinon.useFakeXMLHttpRequest();

    requests = [];

    xhr.onCreate = (xhr) => {
      requests.push(xhr);
    };
  });

  afterEach(() => {
    xhr.restore && xhr.restore();
  });
  it('Should return the same price when converting to USD', (done) => {


    const cb = (price) => { // the callback is going to receive the price
      try{
        expect(price).to.equal('10.00'); // expecting that the price '10' gets converted to string '10.00'
        done(); // if no assertion errors, call done. Let's mocha know that the ASYNC test is done, it can move to the next item
      } catch(e) { // if there is an assertion error, catch it
        done(e); // return error and let mocha know the ASYNC test is done
      }
    };
    getPrices(10, 'USD', cb); // cb is the callback getPrices will call once it's done fetching the data

    const request = requests[0];
    request.respond(200, {'Content-Type': 'application/json'},
      '{ "rates": {"USD": 1} }');

  });
});