#!/usr/bin/env node

var Jthooks = require('./index');
var argv = require('yargs')
        .alias('r', 'repo')
        .describe('r', 'repo to add the hook to; in `owner/repo` format')
        .require('r')
        .alias('u', 'url')
        .describe('u', 'full URL to post to')
        .require('u')
        .alias('s', 'secret')
        .describe('s', 'shared secret')
        .require('s')
        .usage('jthooks -r foo/bar -u https://example.com/hook -s sooper-sekrit')
        .help('help', 'show this help')
        .argv;
