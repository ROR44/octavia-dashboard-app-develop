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
    .module('horizon.dashboard.project.lbaasv2.listeners')
    .factory('horizon.dashboard.project.lbaasv2.listeners.actions.delete', deleteService);

  deleteService.$inject = [
    '$q',
    '$location',
    '$route',
    'horizon.framework.widgets.modal.deleteModalService',
    'horizon.app.core.openstack-service-api.lbaasv2',
    'horizon.app.core.openstack-service-api.policy',
    'horizon.framework.widgets.toast.service',
    'horizon.framework.util.q.extensions',
    'horizon.framework.util.i18n.gettext'
  ];

  /**
   * @ngDoc factory
   * @name horizon.dashboard.project.lbaasv2.listeners.actions.deleteService
   * @description
   * Brings up the delete listeners confirmation modal dialog.
   * On submit, deletes selected listeners.
   * On cancel, does nothing.
   * @param $q The angular service for promises.
   * @param $location The angular $location service.
   * @param $route The angular $route service.
   * @param deleteModal The horizon delete modal service.
   * @param api The LBaaS v2 API service.
   * @param policy The horizon policy service.
   * @param toast The horizon message service.
   * @param qExtensions Horizon extensions to the $q service.
   * @param gettext The horizon gettext function for translation.
   * @returns The load balancers table delete service.
   */

  function deleteService(
    $q, $location, $route, deleteModal, api, policy, toast, qExtensions, gettext
  ) {
    var loadbalancerId, statePromise;
    var context = {
      labels: {
        title: gettext('Confirm Delete Listeners'),
        message: gettext('You have selected "%s". Please confirm your selection. Deleted ' +
                         'listeners are not recoverable.'),
        submit: gettext('Delete Listeners'),
        success: gettext('Deleted listeners: %s.'),
        error: gettext('The following listeners could not be deleted, possibly due to ' +
                       'existing pools: %s.')
      },
      deleteEntity: deleteItem,
      successEvent: 'success',
      failedEvent: 'error'
    };

    var service = {
      perform: perform,
      allowed: allowed,
      init: init
    };

    return service;

    //////////////

    function init(_loadbalancerId_, _statePromise_) {
      loadbalancerId = _loadbalancerId_;
      statePromise = _statePromise_;
      return service;
    }

    function perform(items) {
      if (!angular.isArray(items)) {
        items = [items];
      }
      deleteModal.open({ $emit: actionComplete }, items, context);
    }

    function allowed(/*item*/) {
      return $q.all([
        statePromise,
        // This rule is made up and should therefore always pass. I assume at some point there
        // will be a valid rule similar to this that we will want to use.
        policy.ifAllowed({ rules: [['neutron', 'delete_listener']] })
      ]);
    }

    function deleteItem(id) {
      return api.deleteListener(id, true);
    }

    function actionComplete(eventType) {
      if (eventType === context.failedEvent) {
        // Action failed, reload the page
        $route.reload();
      } else {
        // If the user is on the listeners table then just reload the page, otherwise they
        // are on the details page and we return to the table.
        var regex = new RegExp('project\/ngloadbalancersv2\/' + loadbalancerId + '(\/)?$');
        if (regex.test($location.path())) {
          $route.reload();
        } else {
          $location.path('project/ngloadbalancersv2/' + loadbalancerId);
        }
      }
    }

  }
})();
