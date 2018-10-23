App = {
  web3Provider: null,
  contracts: {},

  init: function() {
    // Load cloths.
    $.getJSON('clothes.json', function(data) {
      console.log(data)
      var clothRow = $('#clothRow');
      var clothTemplate = $('#clothTemplate');

      for (var i = 0; i < data.length; i ++) {
        clothTemplate.find('.panel-title').text(data[i].name);
        clothTemplate.find('img').attr('src', data[i].picture);
        clothTemplate.find('.btn-buy').attr('data-id', data[i].id);

        clothRow.append(clothTemplate.html());
      }
    });

    return App.initWeb3();
  },

  initWeb3: function() {
    // Is there an injected web3 instance?
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
    } else {
      // If no injected web3 instance is detected, fall back to Ganache
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  initContract: function() {
    $.getJSON('Shop.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var ShopArtifact = data;
      App.contracts.Shop = TruffleContract(ShopArtifact);

      // Set the provider for our contract
      App.contracts.Shop.setProvider(App.web3Provider);

      // Use our contract to retrieve and mark the adopted cloths
      return App.markBuyed();
    });

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-buy', App.handleBuy);
  },

  markBuyed: function(buyers, account) {
    var shopInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.error(error);
        return
      }

      var account = accounts[0];

      App.contracts.Shop.deployed().then(function(instance) {
        shopInstance = instance;

        return shopInstance.getBuyers.call();
      }).then(function(buyers) {
        buyers.forEach((buyer, i) => {
          if (buyer === account) {
            $('.panel-cloth').eq(i).find('button').text('Success').attr('disabled', true);
          } else if (buyers[i] !== '0x0000000000000000000000000000000000000000') {
            $('.panel-cloth').eq(i).find('button')
              .text('Bought')
              .attr('disabled', true);
            $('.panel-cloth').eq(i).find('.buyer-name')
              .text('Buyer: ' + buyer);
          }
        })
      }).catch(console.error);
    })
  },

  handleBuy: function(event) {
    event.preventDefault();

    var clothId = parseInt($(event.target).data('id'));

    var shopInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.error(error);
        return
      }

      var account = accounts[0];

      App.contracts.Shop.deployed().then(function(instance) {
        shopInstance = instance;

        // Execute adopt as a transaction by sending account
        return shopInstance.buy(clothId, {from: account});
      }).then(function(result) {
        return App.markBuyed();
      }).catch(console.error);
    });
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
