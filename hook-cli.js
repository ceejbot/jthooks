#!/usr/bin/env node

/*eslint no-unused-vars: ["error", { "varsIgnorePattern": "argv" }]*/

var chalk   = require('chalk'),
	Jthooks = require('./index'),
	url     = require('url'),
	yargs   = require('yargs')
		.command('add <repo> <hook> <secret>', 'add a hook to the given repo with the shared secret', noop, addHook)
		.command('remove <repo> <hook>', 'delete the given webhook; can pass id instead of url', noop, removeHook)
		.option('auth', {
			alias: 'a',
			description: 'auth token (can also be set in GITHUB_AUTH_TOKEN or GITHUB_API_TOKEN)',
			global: true,
		})
		.option('url', {
			alias: 'u',
			description: 'full URL of github API to use (optional)',
			global: true
		})
		.option('quiet', {
			alias: 'q',
			description: 'only log errors',
			global: true,
		})
		.describe('id', 'id of existing hook to update (optional)')
		.usage('jthooks [add|remove] user/repo https://example.com/hook shared-sekrit')
		.example('jthooks add foo/bar https://example.com/hook sooper-sekrit -a auth-token', 'add a webhook')
		.example('jthooks remove foo/bar https://example.com/hook', 'remove a hook by url')
		.example('jthooks remove foo/bar 123456', 'remove a hook by id')
		.help('help', 'show this help');
var argv = yargs.argv;

function noop() { }

function makeLogger(argv)
{
	var logger = function(msg) { if (!argv.quiet) console.log(msg); };
	return logger;
}

function create(argv)
{
	var authtoken = process.env.GITHUB_AUTH_TOKEN || process.env.GITHUB_API_TOKEN || argv.auth;
	if (!authtoken)
	{
		yargs.showHelp();
		process.exit(1);
	}

	var options = {
		auth: {
			type: 'oauth',
			token: authtoken
		}
	};

	if (argv.url)
	{
		var api = url.parse();
		options.host = api.host;
		options.prototol = api.protocol;
		options.pathPrefix = api.path;
	}

	var jthooks = new Jthooks(options);
	return jthooks;
}

function addHook(argv)
{
	var jthooks = create(argv);
	var logger = makeLogger(argv);
	logger('Adding webhook to repo ' + chalk.blue(argv.repo) + '...');

	var pieces = argv.repo.split('/');
	var hookOpts = {
		user:   pieces[0],
		repo:   pieces[1],
		secret: argv.secret,
		url:    argv.hook,
		id:     argv.id
	};

	jthooks.setWebhook(hookOpts, function(err, isNew, result)
	{
		if (err)
		{
			console.log(chalk.red('Error!'), err.message);
			console.log(JSON.stringify(err));
			process.exit(1);
		}

		logger('Hook id ' + chalk.green(result.id) + (isNew ? ' added' : ' updated') + '; test url is');
		logger(chalk.green(result.test_url));
	});
}

function removeHook(argv)
{
	var jthooks = create(argv);
	var logger = makeLogger(argv);
	logger('Removing webhook from repo ' + chalk.blue(argv.repo) + '...');

	var pieces = argv.repo.split('/');
	var opts = {
		user:   pieces[0],
		repo:   pieces[1],
	};

	if (typeof argv.hook === 'number' || !argv.hook.match(/^https?:\/\//))
		opts.id = argv.hook;
	else
		opts.hook = argv.hook;

	jthooks.removeWebhook(opts, function(err, result)
	{
		if (err)
		{
			console.log(chalk.red('Error!'), err.message);
			console.log(JSON.stringify(err));
			process.exit(1);
		}

		logger('Hook id ' + chalk.red(result.id) + ' removed');
	});
}
