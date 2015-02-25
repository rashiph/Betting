'use strict';

angular.module('tabcorpApp')
  .factory('Bet', function () {
    function Bet(input) {
      var value = input.split(':');
      this.product = value[0].toUpperCase();
      this.selection = value[1];
      this.stake = value[2];
    }

    return Bet;
  });