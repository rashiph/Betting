'use strict';

angular.module('tabcorpApp')
  .controller('MainCtrl', function ($scope, localStorageService, Bet, Result, Products) {
    var betsInStore = localStorageService.get('bets');

    $scope.bets = betsInStore || [];

    $scope.$watch('bets', function () {
      localStorageService.set('bets', $scope.bets);
    }, true);

    $scope.addBet = function () {
      var bet = new Bet($scope.bet);
      $scope.bets.push(bet);
      $scope.bet = '';
    };

    $scope.removeBet = function (index) {
      $scope.bets.splice(index, 1);
    };

    $scope.declareResult = function () {
      var result = new Result($scope.result);
      generateDividend(result);
    };

    var generateDividend = function (result) {
      calculateDividendOfWinPool(result);
      calculateDividendOfPlacePool(result);
      calculateDividendOfExactaPool(result);
      calculateDividendOfQuinellaPool(result);
    };

    var calculateDividendOfWinPool = function (result) {
      var winPool = getPoolBy(Products.WIN);
      var total = totalStakeAmount(winPool);
      var commission = ((total * 15 ) / 100).toFixed(2);

      $scope.dividendOfWinPool = calculateDividend(winPool, [result.firstRunnerUp], total - commission);
    };

    var calculateDividendOfPlacePool = function (result) {
      var placePool = getPoolBy(Products.PLACE);
      var total = totalStakeAmount(placePool);
      var commission = ((total * 12 ) / 100).toFixed(2);
      var splitAmount = ((total - commission ) / 3).toFixed(2);

      $scope.dividendOfPlacePoolForFirstRunnerUp = calculateDividend(placePool, [result.firstRunnerUp], splitAmount);
      $scope.dividendOfPlacePoolForSecondRunnerUp = calculateDividend(placePool, [result.secondRunnerUp], splitAmount);
      $scope.dividendOfPlacePoolForThirdRunnerUp = calculateDividend(placePool, [result.thirdRunnerUp], splitAmount);
    };

    var calculateDividendOfExactaPool = function (result) {
      var exactaPool = getPoolBy(Products.EXACTA);
      var total = totalStakeAmount(exactaPool);
      var commission = ((total * 18 ) / 100).toFixed(2);

      $scope.dividendOfExactaPool = calculateDividend(exactaPool, [result.firstRunnerUp + ',' + result.secondRunnerUp], total - commission);
    };

    var calculateDividendOfQuinellaPool = function (result) {
      var quinellaPool = getPoolBy(Products.QUINELLA);
      var total = totalStakeAmount(quinellaPool);
      var commission = ((total * 18 ) / 100).toFixed(2);

      $scope.dividendOfQuinellaPool = calculateDividend(quinellaPool, [result.firstRunnerUp + ',' + result.secondRunnerUp, result.secondRunnerUp + ',' + result.firstRunnerUp], total - commission);
    };

    var calculateDividend = function (pool, runners, poolCollection) {
      var winningBets = _.filter(pool, function (bet) {
        return _.contains(runners, bet.selection);
      });

      var totalStakeOnWinningHorse = totalStakeAmount(winningBets);
      if (totalStakeOnWinningHorse === 0) {
        return 0;
      }
      return (poolCollection / totalStakeOnWinningHorse).toFixed(2);
    };

    var totalStakeAmount = function (pool) {
      return _.reduce(pool, function (sum, bet) {
        return sum + parseInt(bet.stake);
      }, 0);
    };

    var getPoolBy = function (product) {
      return _.filter($scope.bets, function (bet) {
        return bet.product === product;
      });
    };
  });
