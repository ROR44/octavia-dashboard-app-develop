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

  describe('LBaaS v2 Load Balancers Table Controller', function() {
    var controller, lbaasv2API, scope;
    var items = [];

    function fakeAPI() {
      return {
        success: function(callback) {
          callback({ items: items });
        }
      };
    }

    ///////////////////////

    beforeEach(module('horizon.framework.widgets.toast'));
    beforeEach(module('horizon.framework.conf'));
    beforeEach(module('horizon.framework.util'));
    beforeEach(module('horizon.app.core.openstack-service-api'));
    beforeEach(module('horizon.dashboard.project.lbaasv2'));

    beforeEach(module(function($provide) {
      $provide.value('$modal', {});
    }));

    beforeEach(inject(function($injector) {
      lbaasv2API = $injector.get('horizon.app.core.openstack-service-api.lbaasv2');
      controller = $injector.get('$controller');
      scope = $injector.get('$rootScope').$new();
      spyOn(lbaasv2API, 'getLoadBalancers').and.callFake(fakeAPI);
    }));

    function createController() {
      return controller('LoadBalancersTableController', { $scope: scope });
    }

    it('should initialize correctly', function() {
      var ctrl = createController();
      expect(ctrl.items).toEqual([]);
      expect(ctrl.src).toEqual(items);
      expect(ctrl.checked).toEqual({});
      expect(ctrl.batchActions).toBeDefined();
      expect(ctrl.rowActions).toBeDefined();
      expect(ctrl.operatingStatus).toBeDefined();
      expect(ctrl.provisioningStatus).toBeDefined();
    });

    it('should invoke lbaasv2 apis', function() {
      createController();
      expect(lbaasv2API.getLoadBalancers).toHaveBeenCalled();
    });

  });
})();
