'use strict';

module.exports = function (opts) {
  var escapeRegexp;
  var recase;
  var cancelParam;
  var prefixes;

  opts = opts || {};

  cancelParam = opts.cancelParam || 'camel';
  prefixes = opts.prefixes || [];

  function restfulSnakify(req, res, next) {
    if (req.query[cancelParam] && cancelParam) {
      next();
      return;
    }

    if (!escapeRegexp) {
      // lazy load, ftw. See https://github.com/iojs/io.js/issues/1083
      escapeRegexp = require('escape-string-regexp');
      recase = require('recase').Recase.create(opts);
    }
    // The webhooks, oauth and such should remain untouched
    // as to be handled by the appropriate middlewares,
    // but our own api should be transformed
    // + '$' /\/api(\/|$)/

    function matchesPrefix(prefix) {
      return new RegExp('^' + escapeRegexp(prefix) + '(\\/|$)').test(req.url) ;
    }

    if (!prefixes.some(matchesPrefix)) {
      next();
      return;
    }

    if ('object' === typeof req.body && !(req.body instanceof Buffer)) {
      req.body = recase.camelCopy(req.body);
    }

    // Surprise! express is already using _oldJson, so I had to namespace this more carefully :-D
    if (!res.__snakeOldJson) {
    }
    res.__snakeOldJson__ = res.json;
    res.json = function (data) {
      if ('object' === typeof data && !(data instanceof Buffer)) {
        res.__snakeOldJson__(recase.snakeCopy(data));
      } else {
        res.__snakeOldJson__(data);
      }
    };
    next();
    return;
  }

  return restfulSnakify;
};
