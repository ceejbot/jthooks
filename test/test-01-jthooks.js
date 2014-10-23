'use strict';

var
    Lab      = require('lab'),
    lab      = exports.lab = Lab.script(),
    describe = lab.describe,
    it       = lab.it,
    demand   = require('must'),
    Jthooks = require('../index')
    ;

describe('jthooks', function()
{
    var goodOpts =
    {
        auth: { type: "oauth", token: 'deadbeef' }
    };

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
});
