'use strict';

angular.module('tabcorpApp')
  .factory('Result', function () {
    function Result(input) {
      var value = input.split(':');
      this.firstRunnerUp = value[1];
      this.secondRunnerUp = value[2];
      this.thirdRunnerUp = value[3];
    }

    return Result;
  });
