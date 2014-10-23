
var
    _      = require('lodash'),
    assert = require('assert'),
    Github = require('github')
    ;

var Jthooks = module.exports = function Jthooks(opts)
{
    assert(opts && _.isObject(opts), 'you must pass an options object to the constructor');
    assert(opts.auth && _.isObject(opts.auth), 'you must pass an `auth` object option');
    this.options = opts;

    this.client = new Github(
    {
        version: "3.0.0",
        timeout: 5000
    });
};

Jthooks.prototype.options = null;
Jthooks.prototype.client = null;

Jthooks.prototype.authenticate  = function()
{
    this.client.authenticate(this.options.auth);
};

Jthooks.prototype.setWebhook = function(opts, callback)
{
    assert(opts && _.isObject(opts), 'you must pass an options object to create()');
    assert(opts.url && _.isString(opts.url), 'you must pass a valid url in the `url` option field');
    assert(opts.secret && _.isString(opts.secret), 'you must pass a shared secret in the `secret` option field');
    assert(opts.user && _.isString(opts.user), 'you must pass the repo owner in `user`');
    assert(opts.repo && _.isString(opts.repo), 'you must pass the name of the repo in `repo`');

    var self = this;
    self.exists(opts, function(err, hook)
    {
        if (err) return callback(err);
        if (hook)
            return self.update(hook, opts, callback);
        self.create(opts, callback);
    })
};

Jthooks.prototype.update = function(hook, opts, callback)
{
    var newHook =
    {
        repo: hook.repo,
        user: hook.user,
        name: hook.name,
        active: ('active' in opts ? opts.active : true),
        events: ('events' in opts ? opts.events : [ 'push' ]),
        config:
        {
            content_type: 'json',
            secret: opts.secret,
            url: opts.url
        },
    };

    this.authenticate();
    this.client.repos.updateHook(newHook, function(err, result)
    {
        callback(err, result);
    });
};

Jthooks.prototype.create  = function(opts, callback)
{
    assert(opts && _.isObject(opts), 'you must pass an options object to create()');
    assert(opts.url && _.isString(opts.url), 'you must pass a valid url in the `url` option field');
    assert(opts.secret && _.isString(opts.secret), 'you must pass a shared secret in the `secret` option field');
    assert(opts.user && _.isString(opts.user), 'you must pass the repo owner in `user`');
    assert(opts.repo && _.isString(opts.repo), 'you must pass the name of the repo in `repo`');

    var hookOpts =
    {
        repo: opts.repo,
        user: opts.user,
        name:   'web',
        active: true,
        events: [ 'push' ],
        config:
        {
            content_type: 'json',
            secret: opts.secret,
            url: opts.url
        },
    };

    this.authenticate();
    this.client.repos.createHook(hookOpts, function(err, result)
    {
        if (err) return callback(err);
        console.log(result);
        callback();
    });
};

Jthooks.prototype.exists = function(opts, callback)
{
    assert(opts && _.isObject(opts), 'you must pass an options object to create()');
    assert(opts.user && _.isString(opts.user), 'you must pass the repo owner in `user`');
    assert(opts.repo && _.isString(opts.repo), 'you must pass the name of the repo in `repo`');
    assert(opts.url && _.isString(opts.url), 'you must pass a valid url in the `url` option field');

    var self = this;

    self.hooks(opts, function(err, hooks)
    {
        if (err) return callback(err);
        for (var i = 0; i < hooks.length; i++)
        {
            var hook = hooks[i];
            if (hook.url === opts.url)
                return callback(null, hook);
            // that check might need to be looser
        }

        callback(null, false); // not found
    });
};

Jthooks.prototype.hooks = function(opts, callback)
{
    assert(opts && _.isObject(opts), 'you must pass an options object to create()');
    assert(opts.user && _.isString(opts.user), 'you must pass the repo owner in `user`');
    assert(opts.repo && _.isString(opts.repo), 'you must pass the name of the repo in `repo`');

    this.authenticate();
    this.client.repos.getHooks(opts, callback);
};
