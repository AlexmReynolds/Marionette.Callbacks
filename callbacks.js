(function() {

    define(function(require) {
        var Callbacks, logger,
            _this = this;
        logger = require('logger');
        return Callbacks = (function() {

            function Callbacks() {
                var _this = this;
                this.reset = function() {
                    return Callbacks.prototype.reset.apply(_this, arguments);
                };
                this.run = function(options, context) {
                    return Callbacks.prototype.run.apply(_this, arguments);
                };
                this.addSync = function(callback, deferred) {
                    return Callbacks.prototype.addSync.apply(_this, arguments);
                };
                this.add = function(callback, contextOverride) {
                    return Callbacks.prototype.add.apply(_this, arguments);
                };
                this._deferred = $.Deferred();
                this._callbacks = [];
                this._$deferreds = [this._deferred];
            }

            Callbacks.prototype.add = function(callback, contextOverride) {
                this._callbacks.push({
                    cb: callback,
                    ctx: contextOverride
                });
                return this._deferred.done(function(context, options) {
                    if (contextOverride) {
                        context = contextOverride;
                    }
                    return callback.call(context, options);
                });
            };

            Callbacks.prototype.addSync = function(callback, deferred) {
                this._$deferreds.push(deferred);
                this._callbacks.push({
                    cb: callback
                });
                return this._deferred.done(function(context, options) {
                    return callback.call(context, options);
                });
            };

            Callbacks.prototype.run = function(options, context) {
                var _this = this;
                this._deferred.resolve(context, options);
                return $.when.apply($, this._$deferreds).done(function() {});
            };

            Callbacks.prototype.reset = function() {
                var callbacks;
                callbacks = this._callbacks;
                this._deferred = $.Deferred();
                this._callbacks = [];
                return _.each(callbacks, function(cb) {
                    return this.add(cb.cb, cb.ctx);
                }, this);
            };

            return Callbacks;

        })();
    });

}).call(this);
