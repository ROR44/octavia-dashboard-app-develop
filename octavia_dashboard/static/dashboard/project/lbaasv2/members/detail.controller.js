/*
 * Copyright 2016 IBM Corp.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
(function() {
  'use strict';

  angular
    .module('horizon.dashboard.project.lbaasv2.members')
    .controller('MemberDetailController', MemberDetailController);

  MemberDetailController.$inject = [
    'horizon.app.core.openstack-service-api.lbaasv2',
    'horizon.dashboard.project.lbaasv2.members.actions.rowActions',
    '$routeParams',
    'horizon.dashboard.project.lbaasv2.loadbalancers.service',
    'horizon.dashboard.project.lbaasv2.members.service'
  ];

  /**
   * @ngdoc controller
   * @name MemberDetailController
   *
   * @description
   * Controller for the LBaaS v2 member detail page.
   *
   * @param api The LBaaS v2 API service.
   * @param rowActions The pool members row actions service.
   * @param $routeParams The angular $routeParams service.
   * @param loadBalancersService The LBaaS v2 load balancers service.
   * @param membersService The LBaaS v2 members service.
   * @returns undefined
   */

  function MemberDetailController(
      api, rowActions, $routeParams, loadBalancersService, membersService
  ) {
    var ctrl = this;

    ctrl.actions = rowActions.init($routeParams.loadbalancerId, $routeParams.poolId).actions;
    ctrl.loadbalancerId = $routeParams.loadbalancerId;
    ctrl.listenerId = $routeParams.listenerId;
    ctrl.poolId = $routeParams.poolId;
    ctrl.operatingStatus = loadBalancersService.operatingStatus;
    ctrl.provisioningStatus = loadBalancersService.provisioningStatus;

    init();

    ////////////////////////////////

    function init() {
      api.getMember($routeParams.poolId, $routeParams.memberId).success(memberSuccess);
      api.getPool($routeParams.poolId).success(set('pool'));
      api.getListener($routeParams.listenerId).success(set('listener'));
      api.getLoadBalancer($routeParams.loadbalancerId).success(set('loadbalancer'));
    }

    function set(property) {
      return angular.bind(null, function setProp(property, value) {
        ctrl[property] = value;
      }, property);
    }

    function memberSuccess(response) {
      ctrl.member = response;
      membersService.associateMemberStatuses(
          ctrl.loadbalancerId,
          ctrl.listenerId,
          ctrl.poolId,
          [ctrl.member]);
    }

  }

})();
