# jthooks

Create a github webhook from the command line. Pronounced "ji-thooks", as one would say if pronouncing "githooks" with a soft G, instead of the more common hard-G "gih-thooks".

[![on npm](http://img.shields.io/npm/v/jthooks.svg?style=flat)](https://www.npmjs.org/package/jthooks)  [![Tests](http://img.shields.io/travis/ceejbot/jthooks.svg?style=flat)](http://travis-ci.org/ceejbot/jthooks)  ![Coverage](http://img.shields.io/badge/coverage-71%25-red.svg?style=flat)   [![Dependencies](http://img.shields.io/david/ceejbot/jthooks.svg?style=flat)](https://david-dm.org/ceejbot/jthooks)

## Usage

First, create a Github oauth token that has permission to read & write webhooks. Full admin permission is not required. Keep a record of the token somewhere secure.

```shell
jthooks -r foo/bar - https://example.com/hook -s sooper-sekrit -a github-auth-token

Options:
  -r, --repo    repo to add the hook to; in `owner/repo` format    [required]
  -h, --hook    full hook URL to post to                           [required]
  -s, --secret  shared secret                                      [required]
  -a, --auth    auth token (can also be set in GITHUB_AUTH_TOKEN)
  -u, --url     full URL of github API to use (optional)
  --id          id of existing hook to update (optional)
  --help        show this help
```

If you want to update an existing webhook, run the script with `--id`. Otherwise the script will attempt to find an existing hook with the same url & update that in place. If no match is found, a hook is created.

Set the `--url` option if you're not running against github.com but instead wish to change a repo on your Github Enterprise installation.

## License

ISC; see included LICENSE file.
