'use strict';

angular.module('tabcorpApp')
  .controller('MainCtrl', function ($scope, localStorageService, dividendService, Bet, Result) {
    var betsInStore = localStorageService.get('bets');

    $scope.bets = betsInStore || [];
    $scope.error = '';

    $scope.$watch('bets', function () {
      localStorageService.set('bets', $scope.bets);
    }, true);

    $scope.addBet = function () {
      $scope.error = '';
      if (!verifyBet()) {
        $scope.error = 'Error : Invalid Bet Placed';
        return;
      }
      var bet = new Bet($scope.bet);
      $scope.bets.push(bet);
      $scope.bet = '';
    };

    $scope.removeBet = function (index) {
      $scope.bets.splice(index, 1);
    };

    $scope.declareResult = function () {
      $scope.error = '';
      if (!verifyResult()) {
        $scope.error = 'Error : Invalid Result';
        return;
      }
      $scope.publishedResult = new Result($scope.result);
      $scope.dividend = dividendService.calculate($scope.bets, $scope.publishedResult);
    };

    $scope.clearAllBets = function () {
      $scope.bets = [];
    };

    $scope.haveBets = function () {
      return $scope.bets.length > 0;
    };
    var verifyResult = function () {
      var expression = /(R|r):(\d:){2,}\d/i;
      return expression.test($scope.result)
    };

    var verifyBet = function () {
      var expression = /(W|w|E|e|P|p|Q|q):((\d,\d:)|\d:)\d/i;
      return expression.test($scope.bet)
    };
  });
