# connect-recase

Convert your API back and forth from snake_case and camelCase.

## Reasoning

It's no secret. Machines can parse snake_case easier than camelCase.
And guess what: so can humans!

It's easier to read. It's easier to regex. It's empirically better.

But we live in the JavaScript world and the convention is so strongly camelCase that there's no use
in fighting it.

If your API is designed to be consumed by Ruby, Python, Go, or other modern web frameworks,
it will be easier for consumers if you serve them snake_case_properties, y'know.

## Normal Use

```bash
npm install --save connect-recase
```

```javascript
var recase = require('connect-recase')()
app.use('/api', recase);
```

## Getting Fancy

```javascript
var recase = require('connect-recase')({
  prefixes: ['/api']
, cancelParam: 'camel'
, exceptions: { Poorly_NamedProp: 'better_named_property' }
});
app.use(recase);
```

## API

### `prefixes`

only recase on endpoints that begin with these prefixes

Remember to put external APIs hooks such as for stripe, mailgun, twilio, facebook, etc on a different route
or include the `cancelParam` in your hook (unless you're not using a 3rd party lib to handle the hook).

defaults to `[]`

### `cancelParam`

The query parameter than causes `recase` to be skipped

`https://example.com/api/some-resource?camel=true`

Useful if a developer wants to use camelCase and for incoming API hooks

defaults to `camel`

### `exceptions`

gets passed to `recase` as properties that should explicitly mapped

`recase` defaults this to `{ XMLHttpRequest: 'xml_http_request' }`

## TODO

* exceptions to prefixes
* separate incoming and outgoing
