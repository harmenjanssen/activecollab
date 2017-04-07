
const _ = require('lodash');
const path = require('path');
const request = require('request');

/**
 * @constructor ActiveCollabJS
 */
const ActiveCollabJS = function() {
  if (!(this instanceof ActiveCollabJS)) {
    return new ActiveCollabJS();
  }
};


/**
 * Init API - get api token by username && password
 *
 * @typedef {Object} AuthInfo
 * @property {String} username      :: User email (login)
 * @property {String} password      :: User password
 * @property {String} client_name   :: Application name
 * @property {String} client_vendor :: Application owner
 * @property {String} [host=Cloud]  :: ActiveCollab host
 *
 * @callback issueToken~response
 * @param {Object} error              :: Request error
 * @param {Object} response           :: Response JSON object
 *
 * @param {AuthInfo} params           :: initial parameters
 * @param {Function} callback         :: issueToken~response
 * @return {issueToken~response}      :: callback
 */
ActiveCollabJS.prototype.init = function(params, callback) {
  // Save properties
  _.assign(this, { host: 'https://my.activecollab.com/api/v1/' }, params);

  let parameters = {
    json: true,
    body: params,
    method: 'POST'
  };

  this.api('/issue-token', parameters, (err, res) => {
    if (err) {
      return callback(err);
    }

    if (res.is_ok) {
      this.token = res.token;
    } else {
      // Auth error
      return callback(res);
    }

    callback(null, res);
  });
};


/**
 * Request wrapper
 * @param  {String}   method          :: official api method path
 * @param  {Object}   params          :: api call parameters
 * @param  {Function} callback        :: issueToken~response
 * @return {issueToken~response}      :: callback
 */
ActiveCollabJS.prototype.__request = function(method, params, callback) {
  let url = this.host + path.join('api/v1/', method);

  request(url, params, (err, res, body) => callback(err, body));
};


/**
 * Api call wrapper
 * @param  {String}   method          :: official api method path
 * @param  {Object}   params          :: api call parameters
 * @param  {Function} callback        :: issueToken~response
 * @return {issueToken~response}      :: callback
 */
ActiveCollabJS.prototype.api = function(method, params = {}, callback) {
  if (typeof params === 'function') {
    [params, callback] = [{}, params];
  }

  if (typeof callback !== 'function') {
    callback = () => {};
    console.info('Callback not found!');
  }

  let headers = _.assign(params.headers || {}, {
    'X-Angie-AuthApiToken': this.token
  });

  let settings = _.assign(params, {
    method: params.method || 'GET',
    headers: headers
  });

  this.__request(method, settings, callback);
};


module.exports = ActiveCollabJS;
