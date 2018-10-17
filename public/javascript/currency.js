const getPrices = (price, currency, callback) => {
  var settings = {
    async: true,
    url: 'https://exchangeratesapi.io/api/latest?base=USD',
    method: 'GET'
  };

  $.ajax(settings).done(function (response) { // there is an XMLHttpRequest in the ajax call
    for (var key in response.rates) {
      if(key === currency){
        callback((response.rates[key] * price).toFixed(2));
      }
    }
  });
};
export default getPrices;