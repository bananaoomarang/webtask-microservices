"use latest";

var handlebars      = require('handlebars');
var marked          = require('marked');

var db              = require('wt:eyJhbGciOiJIUzI1NiIsImtpZCI6IjEifQ.eyJqdGkiOiJlZjE4MzUzNWRkNGQ0ODJiOTBlN2E4MjA0ODNiMzkzMCIsImlhdCI6MTQzNjMwMTI2MCwiZHIiOjEsImNhIjpbIjg3NzIxMmJlNDJhYzQ2NjViZjc3MmY4YzFjZTZiNmE2Il0sImRkIjowLCJ0ZW4iOiJhdXRoMCIsImVjdHgiOiJRd1Z6ZXc0dmN6aUxzTnlCbERXT3U2RnR4WmdIT1N1YW83MFh0VGdVUk5QdUJzM2JSNWR6eGNnTER2L2hseVJSb1JPNG5LeXJUbUFhWmhwVXhSalVjNkNkRGhuMk1uU3pib3lhSlRxTlp3cz0uYjRPdDVCL0pzamh2Y3RIaVd5Wmh4Zz09IiwibWIiOjEsInBiIjoxLCJ1cmwiOiJodHRwczovL3d0LWRldjIuaXQuYXV0aDAuY29tOjg3MjEvYXBpL3J1bi9hdXRoMC13ZWJ0YXNrLWNvZGU_a2V5PWV5SmhiR2NpT2lKSVV6STFOaUlzSW10cFpDSTZJakVpZlEuZXlKcWRHa2lPaUpqTmpsaVlqZ3lNR000TlRnME5ETmtZV1U1WWpkbFlqWXlOVFZqT0RjeFlpSXNJbWxoZENJNk1UUXpOak13TVRJMk1Dd2laSElpT2pFc0ltTmhJanBiSWpCaU1ETTFNMkkwTmpaa09UUmlOMlZoTlRWbFlqYzNZbUppWVRobFlqUmhJaXdpWVRRM01EZGhZVEkzTXpsak5HTTRZamxoT0RrNU5UZ3pabVkwTjJFMk16VWlYU3dpWkdRaU9qQXNJblZ5YkNJNkltaDBkSEE2THk5alpHNHVZWFYwYURBdVkyOXRMM2RsWW5SaGMydHpMM04wYjNKbFgyTnZaR1ZmY3pNdWFuTWlMQ0owWlc0aU9pSmhkWFJvTUMxM1pXSjBZWE5yTFdOdlpHVWlMQ0p3WTNSNElqcDdJbTFsZEdodlpDSTZJa2RGVkNJc0luQmhkR2dpT2lJNE56Y3lNVEppWlRReVlXTTBOalkxWW1ZM056Sm1PR014WTJVMllqWmhOaTltWVRjeU0yUTJOV0V5T0RneE9UaGxOalZtTTJVM1l6RmpZelpsTnpBM09DSjlMQ0psWTNSNElqb2lUU3R1UjFabVdVNTZSR055ZGt4T1NVVTVOWGx1TTNKcWExaHFTVzFHT1VoblUwdExOV2hCT1c1WVZWQTNRMmRRUm5ad2NtUk9LME5rU0ZCVk56ZDVlbTFLTlhoS2IzWnpXbEpTYkdkRFZIVlNURUpHYzFKWE9XZG5UMVYwYVcxa2JsZzVNVWxDY0cxbGVIQlJkRTA0SzNSbGVVZ3llRUZTZVdReGFESjZSVklyYjJsbVYwTkpjMWxaVDA1S0sweG9WWHByYUM5VFkwTkRSR3hvTW1KVU0wUm1MMWR3VjFkTmVFRnVOVzB2YW1sT1ZsZ3JNWEF5YzJ4cWJEY3JhV3hDVHpOM2JHOVlaVFI2Y1VSRU5UUmhla2xQZVZRclVUMDlMbGcxWVZwMFFucHZaakJFTjNKelVIUlZOazk1ZGxFOVBTSjkuR1FQVmFXOGoyV1FFak5Tajd5YnloNThvZmR2QjItU2ZiTlJOVWdZQWZMOCJ9.t8x2VFcwZ5RZgp3E9Ui6WJ6zPd7tGVmLgxlrPdfSa8g');

const DISPLAY_POST_URL = 'https://wt-dev2.it.auth0.com:8721/api/run/auth0?key=eyJhbGciOiJIUzI1NiIsImtpZCI6IjEifQ.eyJqdGkiOiIwOTA5MTAzYmNkYmY0NzNhODRmNzUwZDRlN2MyNzIxMiIsImlhdCI6MTQzNjMwNTgzMywiZHIiOjEsImNhIjpbIjg3NzIxMmJlNDJhYzQ2NjViZjc3MmY4YzFjZTZiNmE2Il0sImRkIjowLCJ0ZW4iOiJhdXRoMCIsIm1iIjoxLCJwYiI6MSwidXJsIjoiaHR0cHM6Ly93dC1kZXYyLml0LmF1dGgwLmNvbTo4NzIxL2FwaS9ydW4vYXV0aDAtd2VidGFzay1jb2RlP2tleT1leUpoYkdjaU9pSklVekkxTmlJc0ltdHBaQ0k2SWpFaWZRLmV5SnFkR2tpT2lJeU9HTTBaVFppTVdSbFlUVTBaREF4WVRObE9EQTVNVFk0TXpKak5qQmtZaUlzSW1saGRDSTZNVFF6TmpNd05UZ3pOU3dpWkhJaU9qRXNJbU5oSWpwYklqQmlNRE0xTTJJME5qWmtPVFJpTjJWaE5UVmxZamMzWW1KaVlUaGxZalJoSWl3aVlUUTNNRGRoWVRJM016bGpOR000WWpsaE9EazVOVGd6Wm1ZME4yRTJNelVpWFN3aVpHUWlPakFzSW5WeWJDSTZJbWgwZEhBNkx5OWpaRzR1WVhWMGFEQXVZMjl0TDNkbFluUmhjMnR6TDNOMGIzSmxYMk52WkdWZmN6TXVhbk1pTENKMFpXNGlPaUpoZFhSb01DMTNaV0owWVhOckxXTnZaR1VpTENKd1kzUjRJanA3SW0xbGRHaHZaQ0k2SWtkRlZDSXNJbkJoZEdnaU9pSTROemN5TVRKaVpUUXlZV00wTmpZMVltWTNOekptT0dNeFkyVTJZalpoTmk5bE16VTJORFkxT1dJNE56VXdNalJpT0Raa05qbGxPVGcwWldVMU1UTm1OQ0o5TENKbFkzUjRJam9pUVhkcVZWRnlVM05GTjNOUllWTkhOM2hFUlZwaUwwZFJTVEZWVkRWRE5FUkhaVzA0VVhsQmJsbDRSVFJLVmtkaGJYbzNTRGxvY3pRck16RmlZMlU1ZGpoVlRHUmxOSEpVUkZoelZ6bHlTMnhVTWpsa1dqVnlUWFpvT0VWUksydzNWbGxTUVZwcE5ra3pWamxOV1UxNFEwWlVOWFJUTVM5UGRWaEViRk5XT0VabFFXOTVhSEIyWkVkbGFGSnhURnBQVWtOVVpsZEVWVUpQUlVKVWRUVnpVekZ0WlZkalZuaFFkbEJUTVhCYU5FOTNhMjVpYUZkWFRGSnhjblJvUWtWSE0yMXNZbWhaTDJoSkwyaFVla2xKT1hBMk1XSmtVVDA5TG1wbU4zQXlSRXN5T1dWdlYwZG9OVkUxWlVaM1RXYzlQU0o5LnF4OXVXcWdEYmhoNVpTUUdlMkxrRXNKTFhNZ3ZqdGhoRmZRQmE5cFY4dzQifQ.oguRlSXdDt4Xw0tXjZD1BsuGEXbldLtHsUsqh9d1wDA';

var View = `
<html>
  <head>
    <meta charset="utf-8">
    <title>Markdown Editor</title>
    <style type="text/css">
    </style>
  </head>
  <body>
    <ul>
      {{#if posts.length}}
        {{#each posts}}
          <li><a href="{{../DISPLAY_POST_URL}}&id={{_id}}">{{title}}</a></li>
        {{/each}}
      {{else}}
        <h1>No posts :(</h1>
      {{/if}}
    </ul>
  </body>
</html>
`;

const template = handlebars.compile(View);

return ({ data }, req, res) => {
  const { MONGO_URL } = data;

  res.writeHead(200, { 'Content-Type': 'text/html' });

  db({ type: 'QUERY' })
    .then(({ body }) => generatePage(body, DISPLAY_POST_URL))
    .then(html       => res.end(html))
    .catch(err       => res.end(err));
};


function generatePage(posts, DISPLAY_POST_URL) {
  let template_ctx = {
    posts,
    DISPLAY_POST_URL
  }

  return new Promise( (resolve, reject) => {

    resolve(
      template(template_ctx)
    );

  });

}

