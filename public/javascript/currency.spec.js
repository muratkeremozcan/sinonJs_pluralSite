import getPrices from './currency.js';
// ignore the chai, sinon errors, the html imports these for you. These tests run in the browser
const expect = chai.expect;

describe('Currency Tests', () => {
  let xhr, requests;
  beforeEach(() => {
    // we do not want to hit the real API (because of costs) , so we have to create a fake request
    xhr = sinon.useFakeXMLHttpRequest(); //  sinon.useFakeXMLHttpRequest() replaces XMLHttpRequest of the browser with Sinon's xhr . Also returns an object to use for more information
    // the fake xhr object has several properties: URL, http method/verb, headers, body, username, password
    requests = [];

    xhr.onCreate = (xhr) => { // in order to work with fake request, you need to capture them with xhr.onCreate
      requests.push(xhr); // here the requests are captured in the requests array
    };
  });

  afterEach(() => {
    xhr.restore && xhr.restore(); // need to restore the xhr object . Similar to stub best practice, cleaning up
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

    const request = requests[0]; // create a request by grabbing the first object in the requests array

    // the fake xhr object also gives you 2 functions
    // .error to simulate a fake network error
    // .respond to respond with status, header, body
    // request.setStatus(200);
    // request.setResponseHeaders({'Content-Type': 'application/json'});
    // request.setResponseBody('{ "rates": {"USD": 1} }');
    // request.respond();

    request.respond(200, {'Content-Type': 'application/json'}, '{ "rates": {"USD": 1} }'); // tell the request how to respond

  });
});