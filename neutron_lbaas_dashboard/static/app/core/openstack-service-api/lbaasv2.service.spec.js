/*
 * Copyright 2015 IBM Corp.
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

  describe('LBaaS v2 API', function() {
    var testCall, service;
    var apiService = {};
    var toastService = {};

    beforeEach(module('horizon.mock.openstack-service-api', function($provide, initServices) {
      testCall = initServices($provide, apiService, toastService);
    }));

    beforeEach(module('horizon.app.core.openstack-service-api'));

    beforeEach(inject(['horizon.app.core.openstack-service-api.lbaasv2', function(lbaasv2API) {
      service = lbaasv2API;
    }]));

    it('defines the service', function() {
      expect(service).toBeDefined();
    });

    var tests = [
      {
        "func": "getLoadBalancers",
        "method": "get",
        "path": "/api/lbaas/loadbalancers/",
        "error": "Unable to retrieve load balancers."
      },
      {
        "func": "getLoadBalancer",
        "method": "get",
        "path": "/api/lbaas/loadbalancers/1234",
        "error": "Unable to retrieve load balancer.",
        "testInput": [
          '1234'
        ]
      },
      {
        "func": "getListeners",
        "method": "get",
        "path": "/api/lbaas/listeners/",
        "data": {
          "params": {
            "loadbalancerId": "1234"
          }
        },
        "error": "Unable to retrieve listeners.",
        "testInput": [
          "1234"
        ]
      },
      {
        "func": "getListeners",
        "method": "get",
        "path": "/api/lbaas/listeners/",
        "data": {},
        "error": "Unable to retrieve listeners."
      },
      {
        "func": "getListener",
        "method": "get",
        "path": "/api/lbaas/listeners/1234",
        "data": {
          "params": {
            "includeChildResources": true
          }
        },
        "error": "Unable to retrieve listener.",
        "testInput": [
          '1234',
          true
        ]
      },
      {
        "func": "getListener",
        "method": "get",
        "path": "/api/lbaas/listeners/1234",
        "data": {},
        "error": "Unable to retrieve listener.",
        "testInput": [
          '1234',
          false
        ]
      },
      {
        "func": "getPool",
        "method": "get",
        "path": "/api/lbaas/pools/1234",
        "error": "Unable to retrieve pool.",
        "testInput": [
          '1234'
        ]
      },
      {
        "func": "getMembers",
        "method": "get",
        "path": "/api/lbaas/pools/1234/members/",
        "error": "Unable to retrieve members.",
        "testInput": [
          '1234'
        ]
      },
      {
        "func": "getMember",
        "method": "get",
        "path": "/api/lbaas/pools/1234/members/5678",
        "error": "Unable to retrieve member.",
        "testInput": [
          '1234',
          '5678'
        ]
      },
      {
        "func": "getHealthMonitor",
        "method": "get",
        "path": "/api/lbaas/healthmonitors/1234",
        "error": "Unable to retrieve health monitor.",
        "testInput": [
          '1234'
        ]
      },
      {
        "func": "createLoadBalancer",
        "method": "post",
        "path": "/api/lbaas/loadbalancers/",
        "error": "Unable to create load balancer.",
        "data": { "name": "loadbalancer-1" },
        "testInput": [
          { "name": "loadbalancer-1" }
        ]
      },
      {
        "func": "editLoadBalancer",
        "method": "put",
        "path": "/api/lbaas/loadbalancers/1234",
        "error": "Unable to update load balancer.",
        "data": { "name": "loadbalancer-1" },
        "testInput": [
          "1234",
          { "name": "loadbalancer-1" }
        ]
      },
      {
        "func": "editListener",
        "method": "put",
        "path": "/api/lbaas/listeners/1234",
        "error": "Unable to update listener.",
        "data": { "name": "listener-1" },
        "testInput": [
          "1234",
          { "name": "listener-1" }
        ]
      }
    ];

    // Iterate through the defined tests and apply as Jasmine specs.
    angular.forEach(tests, function(params) {
      it('defines the ' + params.func + ' call properly', function() {
        var callParams = [apiService, service, toastService, params];
        testCall.apply(this, callParams);
      });
    });

  });

})();
