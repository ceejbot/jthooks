# jthooks

Create a github webhook from the command line. Pronounced "ji-thooks", as one would say if pronouncing "githooks" with a soft G, instead of the more common hard-G "gih-thooks".

[![on npm](http://img.shields.io/npm/v/jthooks.svg?style=flat)](https://www.npmjs.org/package/jthooks)  [![Tests](http://img.shields.io/travis/ceejbot/jthooks.svg?style=flat)](http://travis-ci.org/ceejbot/jthooks)  ![Coverage](http://img.shields.io/badge/coverage-71%25-red.svg?style=flat)   [![Dependencies](http://img.shields.io/david/ceejbot/jthooks.svg?style=flat)](https://david-dm.org/ceejbot/jthooks)

## Usage

First, create a Github oauth token that has permission to read & write webhooks. Full admin permission is not required. Keep a record of the token somewhere secure.

```shell
jthooks [add|remove] user/repo https://example.com/hook shared-sekrit

Commands:
  add <repo> <hook> <secret>  add a hook to the given repo with the shared
                              secret
  remove <repo> <hook>        delete the given webhook; can pass id instead of
                              url

Options:
  --auth, -a   auth token (can also be set in GITHUB_AUTH_TOKEN or
               GITHUB_API_TOKEN)
  --url, -u    full URL of github API to use (optional)
  --quiet, -q  only log errors
  --id         id of existing hook to update (optional)
  --help       show this help                                          [boolean]

Examples:
  jthooks add foo/bar https://example.com/hook sooper-sekrit -a auth-token   add a webhook
  jthooks remove foo/bar https://example.com/hook  remove a hook by url
  jthooks remove foo/bar 123456                    remove a hook by id
```

If you want to update an existing webhook, run the script with `--id`. Otherwise the script will attempt to find an existing hook with the same url & update that in place. If no match is found, a hook is created.

Set the `--url` option if you're not running against github.com but instead wish to change a repo on your Github Enterprise installation.

## TODO

Delete a hook.

More than merely cursory tests.

## License

ISC; see included LICENSE file.
