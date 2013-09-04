Marionette.Callbacks
====================

Marionette Callback support for async calls

## What is it?

Marionette callbacks are used when initializing an app or module. Problem is if the initiilizer has an async call in it then this task may not be finished when .start() is run.

This class is used to override marionette callbacks and be able to define an initializer that contains an async task you want to finish before .start() is called.

example:

```javascript

// Override the start method to make sure we wait until initializers are done before starting
Marionette.Application.prototype.start = function (options){
  var _this = this
  this.triggerMethod("initialize:before, options");
  $.when(this._initCallbacks.run(options, this))
    .done(function(){
      _this.triggerMethod("initialize:after", options);
      _this.triggerMethod("start", options);
    }
}

// Add a public method as a helper
Marionette.Application.prototype.addSyncCallback = function(initializer, deferred) {
  return this._initCallbacks.addSync(initializer, deferred);
}

var App = new Marionette.Application;

// Override the exisiting Callbacks
App._initCallbacks = new Callbacks;

// Add a initializer that you want to make sure it finishes before .start()
var $deferred = $.Deferred();
App.addSyncCallBack(function(){
  var name = $.post('/echo/json/', {json:JSON.stringify({'name':"Matt Baker"})});
  name.done(function(){
    //NOW resolve deferred and finish this init step
    $deferred.resolve();
  })
}, $deferred)

```
