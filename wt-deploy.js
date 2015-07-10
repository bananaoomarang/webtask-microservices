#!/bin/env node

var fs           = require('fs');
var path         = require('path');
var bunyan       = require('bunyan');
var PrettyStream = require('bunyan-prettystream')
var spawn        = require('child_process').spawn;
var config       = require('./webtask.json');
var parallel     = require('async').parallel;

var service_dir  = __dirname;
var watch        = false;
var base_url     = 'https://webtask.it.auth0.com/api/run'
var container    = process.argv[2];
var service_urls = [];

var prettyStdout = new PrettyStream();
prettyStdout.pipe(process.stdout);

var log = bunyan.createLogger({ 
  name: 'wt-deploy',
  streams: [{
    stream: prettyStdout
  }]
});

if(!container) {
  console.log('Please specify a container');
  process.exit(1);
}

if(!config) {
  console.log('Can\'t find webtask.json');
  process.exit(1);
}

if(config.options) {
  service_dir = config.options.services || service_dir;
  watch       = config.options.watch    || watch;
  base_url    = config.options.url      || base_url;
}

var tasks = 
Object
  .keys(config)
  .filter(function (key) {
    if(key === 'options') return false;

    return true;
  })
  .map(function (key) {

    service_urls.push(
      {
        url: path.join(
          base_url, container, key
        ) + '?webtask_no_cache=1',

        name: key
      }
    );

    return {
      name: key,
      path:   path.join(service_dir, (config[key].path || key) ) + '.js',
      config: config[key],
      url:    ''
    }


  })
  .map(function (task) {
    return function(done) {
      var secrets = Object
        .keys(task.config.secrets || [])
        .map(function (key) {
          return [key, task.config.secrets[key]].join('=');
        });

      var params = Object
        .keys(task.config.params || [])
        .map(function (key) {
          return [key, task.config.params[key]].join('=');
        })
        .concat(
          service_urls
            .map(function (value) {
              return [value.name.toUpperCase(), value.url].join('=')
            })
        );

        var args = ['create', '--advanced', '-n', task.name, task.path];

        if(watch)          args = args.concat(['-w'])

        if(secrets.length) args = args.concat(['-s'], secrets);

        if(params.length)  args = args.concat(['--param'], params);

        console.log(params);

        spawn('/home/milo/wt-cli/bin/wt', args)
          .on('exit', function (code) {
            done(null, {
              name: task.name,
              url:  task.url
            });
          })
          .on('error', function (err) {
            done(err);
          })
          .stdout
          .on('data', function(data) {

            if(watch) 
              log.info({
                name: task.name,
                url:  data.toString()
              });
            else
              task.url += data;
          });

    }
  });

parallel(tasks, function (err, results) {
  if(err) return console.error(err)

  if(!watch)
    results
      .forEach(function (task) {
        log.info(task);
      })
});
