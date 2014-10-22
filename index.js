
var
    _      = require('lodash'),
    assert = require('assert'),
    Github = require('github')
    ;

var Hooksible = module.exports = function Hooksible(opts)
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

Hooksible.prototype.options = null;
Hooksible.prototype.client = null;

Hooksible.prototype.create  = function(opts, callback)
{
    assert(opts && _.isObject(opts), 'you must pass an options object to create()');
    assert(opts.url && _.isString(opts.url), 'you must pass a valid url in the `url` option field');
    assert(opts.secret && _.isString(opts.secret), 'you must pass a shared secret in the `secret` option field');
    assert(opts.owner && _.isString(opts.owner), 'you must pass the repo owner in `owner`');
    assert(opts.repo && _.isString(opts.repo), 'you must pass the name of the repo in `repo`');

    var hookOpts =
    {
        repo: opts.repo,
        user: opts.owner,
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

Hooksible.prototype.authenticate  = function()
{
    this.client.authenticate(this.options.auth);
};
