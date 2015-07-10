"use latest";

var handlebars = require('handlebars');
var marked     = require('marked');
var request    = require('request');

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

module.exports = ({ data }, req, res) => {
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

