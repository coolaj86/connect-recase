# connect-recase

Convert your API back and forth between snake_case and camelCase.

`{ "popularCatchphrase": "it's morphin' time!" }` => `{ "popular_catchphrase": "it's morphin' time!" }`

If your API is designed to be consumed by Ruby, Python, Go, or other modern web frameworks,
it will be easier for consumers if you serve them `snake_case_properties`, y'know.

It's no secret that machines can parse snake_case easier than camelCase.
And guess what: so can humans! It's easier to read. It's easier to regex. It's empirically better.

But we live in the JavaScript world and the convention is so strongly camelCase that there's no use
in fighting it.


## Normal Use

```bash
npm install --save connect-recase
```

```javascript
var recase = require('connect-recase')()
app.use('/api', recase);

// some resource
app.use('/api/some-resource', function (req, res) {
  console.log(req.body);
  res.send({ popularCatchphrase: "it's morphin' time!" });
});
```

If you test getting the resource, it will come in snake_case:

```bash
curl https://local.daplie.com/api/some-resource

{ "popular_catchphrase": "it's morphin' time!" }
```

If you test posting some data, it will come in snake_case:

```bash
curl https://local.daplie.com/api/some-resource \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{ "user_data": { "display_name": "Johnny Lingo", "profile_url": "https://aj.daplie.com" } }'
  
# you'll see this in your console.log
{ "userData": { "displayName": "Johnny Lingo", "profileUrl": "https://aj.daplie.com" } }
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
