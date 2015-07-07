"use latest";

var handlebars = require('handlebars');
var marked     = require('marked');

var db         = require('wt:eyJhbGciOiJIUzI1NiIsImtpZCI6IjEifQ.eyJqdGkiOiJlZjE4MzUzNWRkNGQ0ODJiOTBlN2E4MjA0ODNiMzkzMCIsImlhdCI6MTQzNjMwMTI2MCwiZHIiOjEsImNhIjpbIjg3NzIxMmJlNDJhYzQ2NjViZjc3MmY4YzFjZTZiNmE2Il0sImRkIjowLCJ0ZW4iOiJhdXRoMCIsImVjdHgiOiJRd1Z6ZXc0dmN6aUxzTnlCbERXT3U2RnR4WmdIT1N1YW83MFh0VGdVUk5QdUJzM2JSNWR6eGNnTER2L2hseVJSb1JPNG5LeXJUbUFhWmhwVXhSalVjNkNkRGhuMk1uU3pib3lhSlRxTlp3cz0uYjRPdDVCL0pzamh2Y3RIaVd5Wmh4Zz09IiwibWIiOjEsInBiIjoxLCJ1cmwiOiJodHRwczovL3d0LWRldjIuaXQuYXV0aDAuY29tOjg3MjEvYXBpL3J1bi9hdXRoMC13ZWJ0YXNrLWNvZGU_a2V5PWV5SmhiR2NpT2lKSVV6STFOaUlzSW10cFpDSTZJakVpZlEuZXlKcWRHa2lPaUpqTmpsaVlqZ3lNR000TlRnME5ETmtZV1U1WWpkbFlqWXlOVFZqT0RjeFlpSXNJbWxoZENJNk1UUXpOak13TVRJMk1Dd2laSElpT2pFc0ltTmhJanBiSWpCaU1ETTFNMkkwTmpaa09UUmlOMlZoTlRWbFlqYzNZbUppWVRobFlqUmhJaXdpWVRRM01EZGhZVEkzTXpsak5HTTRZamxoT0RrNU5UZ3pabVkwTjJFMk16VWlYU3dpWkdRaU9qQXNJblZ5YkNJNkltaDBkSEE2THk5alpHNHVZWFYwYURBdVkyOXRMM2RsWW5SaGMydHpMM04wYjNKbFgyTnZaR1ZmY3pNdWFuTWlMQ0owWlc0aU9pSmhkWFJvTUMxM1pXSjBZWE5yTFdOdlpHVWlMQ0p3WTNSNElqcDdJbTFsZEdodlpDSTZJa2RGVkNJc0luQmhkR2dpT2lJNE56Y3lNVEppWlRReVlXTTBOalkxWW1ZM056Sm1PR014WTJVMllqWmhOaTltWVRjeU0yUTJOV0V5T0RneE9UaGxOalZtTTJVM1l6RmpZelpsTnpBM09DSjlMQ0psWTNSNElqb2lUU3R1UjFabVdVNTZSR055ZGt4T1NVVTVOWGx1TTNKcWExaHFTVzFHT1VoblUwdExOV2hCT1c1WVZWQTNRMmRRUm5ad2NtUk9LME5rU0ZCVk56ZDVlbTFLTlhoS2IzWnpXbEpTYkdkRFZIVlNURUpHYzFKWE9XZG5UMVYwYVcxa2JsZzVNVWxDY0cxbGVIQlJkRTA0SzNSbGVVZ3llRUZTZVdReGFESjZSVklyYjJsbVYwTkpjMWxaVDA1S0sweG9WWHByYUM5VFkwTkRSR3hvTW1KVU0wUm1MMWR3VjFkTmVFRnVOVzB2YW1sT1ZsZ3JNWEF5YzJ4cWJEY3JhV3hDVHpOM2JHOVlaVFI2Y1VSRU5UUmhla2xQZVZRclVUMDlMbGcxWVZwMFFucHZaakJFTjNKelVIUlZOazk1ZGxFOVBTSjkuR1FQVmFXOGoyV1FFak5Tajd5YnloNThvZmR2QjItU2ZiTlJOVWdZQWZMOCJ9.t8x2VFcwZ5RZgp3E9Ui6WJ6zPd7tGVmLgxlrPdfSa8g')

var View = `
<html>
  <head>
    <meta charset="utf-8">
    <title>{{title}}</title>
    <style type="text/css">
      .container {
        width: 50%;
        height: 100%;
        margin: auto auto;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>{{title}}</h1>

      <div class="byline">
        <h3>{{byline}}</h3>
      </div>

      <div class="main">
        {{{html}}}
      </div>
    </div>
  </body>
</html>
`;

const template = handlebars.compile(View);

return (ctx, req, res) => {
  if(!ctx.data.id) done(new Error('Must specify post id.'));

  db({ type: 'GET', id: ctx.data.id })
    .then( ({ body }) => {
      res.writeHead(200, { 'Content-Type': 'text/html' })

      const template_ctx = {
        title: body.title,
        byling: body.byline,
        html: marked(body.body)
      }

      res.end(
        template(template_ctx)
     )
    })
    .catch(err => res.end(err));
};
