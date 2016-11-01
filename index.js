
var
	isObject = require('lodash.isobject'),
	assert   = require('assert'),
	Github   = require('github')
	;

var Jthooks = module.exports = function Jthooks(opts)
{
	assert(opts && isObject(opts), 'you must pass an options object to the constructor');
	assert(opts.auth && isObject(opts.auth), 'you must pass an `auth` object option');
	this.options = opts;

	this.client = new Github({
		version: '3.0.0',
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
	var self = this;
	var func = (opts.id ? 'hook' : 'exists');

	self[func](opts, function(err, hook)
	{
		if (err) return callback(err);
		if (hook)
			return self.update(hook, opts, callback);
		self.create(opts, callback);
	});
};

Jthooks.prototype.removeWebhook = function(opts, callback)
{
	var self = this;

	if (opts.id)
		return self.remove(opts, callback);

	self.exists(opts, function(err, hook)
	{
		if (err) return callback(err);
		if (!hook) return callback();
		var opts = {
			id: hook.id,
			repo: opts.repo,
			owner: opts.owner
		};
		self.remove(opts, callback);
	});
};

Jthooks.prototype.update = function update(hook, opts, callback)
{
	var newHook = {
		id:     hook.id,
		repo:   opts.repo,
		owner:   opts.owner,
		name:   hook.name,
		active: ('active' in opts ? opts.active : true),
		events: ('events' in opts ? opts.events : ['push']),
		config: {
			content_type: 'json',
			secret: opts.secret,
			url: opts.url
		},
	};

	this.authenticate();
	this.client.repos.editHook(newHook, function(err, result)
	{
		callback(err, false, result);
	});
};

Jthooks.prototype.create  = function create(opts, callback)
{
	var hookOpts = {
		repo: opts.repo,
		owner: opts.owner,
		name:   'web',
		active: true,
		events: ['push'],
		config: {
			content_type: 'json',
			secret: opts.secret,
			url: opts.url
		},
	};

	this.authenticate();
	this.client.repos.createHook(hookOpts, function(err, result)
	{
		callback(err, true, result);
	});
};

Jthooks.prototype.exists = function exists(opts, callback)
{
	var self = this;

	self.hooks(opts, function(err, hooks)
	{
		if (err) return callback(err);
		for (var i = 0; i < hooks.length; i++)
		{
			var hook = hooks[i];
			if (hook.config.url === opts.url)
				return callback(null, hook);
			// that check might need to be looser
		}

		callback(null, false); // not found
	});
};

Jthooks.prototype.hook = function hook(opts, callback)
{
	this.authenticate();
	this.client.repos.getHook(opts, callback);
};

Jthooks.prototype.hooks = function hooks(opts, callback)
{
	this.authenticate();
	this.client.repos.getHooks(opts, callback);
};

Jthooks.prototype.remove = function remove(opts, callback)
{
	this.authenticate();
	var hook = {
		id:     opts.id,
		repo:   opts.repo,
		owner:   opts.owner,
	};

	this.authenticate();
	this.client.repos.deleteHook(hook, function(err, result)
	{
		callback(err, { id: opts.id });
	});
};
