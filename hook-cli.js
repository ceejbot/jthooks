#!/usr/bin/env node

var chalk   = require('chalk');
var Jthooks = require('./index');
var url     = require('url');
var argv    = require('yargs')
	.alias('r', 'repo')
	.describe('r', 'repo to add the hook to; in `owner/repo` format')
	.require('r')
	.alias('h', 'hook')
	.describe('h', 'full hook URL to post to')
	.require('h')
	.alias('s', 'secret')
	.describe('s', 'shared secret')
	.require('s')
	.alias('a', 'auth')
	.describe('a', 'auth token (can also be set in GITHUB_AUTH_TOKEN)')
	.alias('u', 'url')
	.describe('u', 'full URL of github API to use (optional)')
	.describe('id', 'id of existing hook to update (optional)')
	.usage('jthooks -r foo/bar -h https://example.com/hook -s sooper-sekrit -a auth-token')
	.help('help', 'show this help')
	.argv;

var authtoken = process.env.GITHUB_AUTH_TOKEN || argv.auth;
if (!authtoken)
{
	console.log(argv.help());
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

var matches = argv.repo.match(/([^\/]*)\/(.*)$/);
var hookOpts = {
	user:   matches[1],
	repo:   matches[2],
	secret: argv.secret,
	url:    argv.hook,
	id:     argv.id
};

console.log('Adding webhook to repo ' + chalk.blue(argv.repo) + '...');
jthooks.setWebhook(hookOpts, function(err, isNew, result)
{
	if (err)
	{
		console.log(chalk.red('Error!'), err.message);
		console.log(JSON.stringify(err));
		process.exit(1);
	}

	console.log('Hook id ' + chalk.green(result.id) + (isNew ? ' added' : ' updated') + '; test url is');
	console.log(chalk.green(result.test_url));
	process.exit();
});
