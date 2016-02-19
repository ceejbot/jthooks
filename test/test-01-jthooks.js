/*global describe:true, it:true, before:true, after:true */
'use strict';

var
	demand   = require('must'),
	sinon    = require('sinon'),
	Jthooks  = require('../index')
	;

describe('jthooks', function()
{
	var goodOpts = { auth: { type: 'oauth', token: 'deadbeef' } };

	it('exports a single function', function(done)
	{
		Jthooks.must.be.a.function();
		done();
	});

	it('requires an options object', function(done)
	{
		function shouldThrow() { return new Jthooks(); }
		shouldThrow.must.throw(/options/);
		done();
	});

	it('requires an auth option', function(done)
	{
		function shouldThrow() { return new Jthooks({}); }
		shouldThrow.must.throw(/auth/);
		done();
	});

	it('can be constructed', function(done)
	{
		var j = new Jthooks(goodOpts);
		j.must.be.instanceof(Jthooks);
		j.options.must.eql(goodOpts);
		done();
	});

	it('authenticate() calls authenticate on the client', function(done)
	{
		var j = new Jthooks(goodOpts);
		j.client.authenticate = sinon.spy();
		j.authenticate();
		j.client.authenticate.called.must.be.true();
		j.client.authenticate.calledWith(goodOpts.auth).must.be.true();
		done();
	});
});
