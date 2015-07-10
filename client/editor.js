"use latest";

var handlebars  = require('handlebars');
var marked      = require('marked');
var MongoClient = require('mongodb');

var View = `
<html>
  <head>
    <meta charset="utf-8">

    <title>Markdown Editor</title>

    <style type="text/css">
      .halves {
        width: 100%;
      }
      .half {
        float: left;
        width: 50%;
      }
      .editor {
        width: 100%;
        height: 100%;
        outline: none;
      }
    </style>

    <script src="//code.jquery.com/jquery-1.11.3.min.js"></script>
  </head>
  <body>
    <h2>{{title}}</h2>

    <div class="halves">
      <div class="half">
        <textarea class="editor">{{text}}</textarea>
        <button class="btn" id="submit">Save</button>
      </div>
      <div class="half">
        {{{html}}}
      </div>
    </div>
    <script>
      $('#submit').click(function () {
        $.post('{{SAVE_URL}}', {
          title: '{{title}}',
          byline: '{{byline}}',
          body: $('.editor').val()
        });
      });
    </script>
  </body>
</html>
`;

module.exports = ({ data }, req, res) => {
  const { MONGO_URL } = data;
  const template      = handlebars.compile(View);

  let { title, text, byline } = data;

  if(!title) title   = 'Neato!';
  if(!text)  text    = 'neato!';
  if(!byline) byline = 'Neato!'

  let template_ctx = {
    SAVE_URL: 'https://webtask.it.auth0.com/api/run/wt-milo-auth0_com-0/post_manager?webtask_no_cache=1',
    title:  title,
    byline: byline,
    html:   marked(text)
  }

  res.writeHead(200, { 'Content-Type': 'text/html' });

  res.end(
    template(template_ctx)
  );
};
