'use strict';

angular.module('tabcorpApp')
  .service('dividendService', function (localStorageService, Bet, Result, Products) {
    var dividend = {};

    var dividendService = {};

    dividendService.calculate = function (bets, result) {
      calculateDividendOfWinPool(bets, result);
      calculateDividendOfPlacePool(bets, result);
      calculateDividendOfExactaPool(bets, result);
      calculateDividendOfQuinellaPool(bets, result);
      return dividend;
    };

    var calculateDividendOfWinPool = function (bets, result) {
      var winPool = getPoolBy(bets, Products.WIN);
      var total = totalStakeAmount(winPool);
      var commission = ((total * 15 ) / 100).toFixed(2);

      dividend['dividendOfWinPool'] = calculateDividend(winPool, [result.firstRunnerUp], total - commission);
    };

    var calculateDividendOfPlacePool = function (bets, result) {
      var placePool = getPoolBy(bets, Products.PLACE);
      var total = totalStakeAmount(placePool);
      var commission = ((total * 12 ) / 100).toFixed(2);
      var splitAmount = ((total - commission ) / 3).toFixed(2);

      dividend['dividendOfPlacePoolForFirstRunnerUp'] = calculateDividend(placePool, [result.firstRunnerUp], splitAmount);
      dividend['dividendOfPlacePoolForSecondRunnerUp'] = calculateDividend(placePool, [result.secondRunnerUp], splitAmount);
      dividend['dividendOfPlacePoolForThirdRunnerUp']= calculateDividend(placePool, [result.thirdRunnerUp], splitAmount);
    };

    var calculateDividendOfExactaPool = function (bets, result) {
      var exactaPool = getPoolBy(bets, Products.EXACTA);
      var total = totalStakeAmount(exactaPool);
      var commission = ((total * 18 ) / 100).toFixed(2);

      dividend['dividendOfExactaPool'] = calculateDividend(exactaPool, [result.firstRunnerUp + ',' + result.secondRunnerUp], total - commission);
    };

    var calculateDividendOfQuinellaPool = function (bets, result) {
      var quinellaPool = getPoolBy(bets, Products.QUINELLA);
      var total = totalStakeAmount(quinellaPool);
      var commission = ((total * 18 ) / 100).toFixed(2);

      dividend['dividendOfQuinellaPool'] = calculateDividend(quinellaPool, [result.firstRunnerUp + ',' + result.secondRunnerUp, result.secondRunnerUp + ',' + result.firstRunnerUp], total - commission);
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

    var getPoolBy = function (bets, product) {
      return _.filter(bets, function (bet) {
        return bet.product === product;
      });
    };

    return dividendService;
  });
