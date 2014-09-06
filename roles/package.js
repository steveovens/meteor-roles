Package.describe({
  summary: "Role-based authorization",
  version: "1.2.13",
  git: "https://github.com/alanning/meteor-roles.git",
  name: "alanning:roles"
});

Package.on_use(function (api) {
  var both = ['client', 'server'];

  api.use(['underscore', 'accounts-base'], both);

  if (api.versionsFrom) {
    api.versionsFrom('METEOR@0.9.1');
    api.use(['blaze@2.0.0'], 'client', {weak: true});
  } else if(uiExists()) {
    // This is needed due to Meteor Issue #1358
    //   https://github.com/meteor/meteor/issues/1358
    //
    // In meteor < 0.9, the 'weak' flag doesn't work with packages 
    // that aren't in meteor's internal cache (ie. non-core packages)
    api.use(['ui'], 'client', {weak: true});
  } else {
    api.use(['handlebars'], 'client', {weak: true});
  }

  api.export && api.export('Roles');

  api.add_files('roles_server.js', 'server');
  api.add_files('roles_common.js', both);
  api.add_files('roles_client.js', 'client');
});

Package.on_test(function (api) {
  var both = ['client', 'server'];

  // `accounts-password` is included so `Meteor.users` exists

  if (api.versionsFrom) {
    api.use(['alanning:roles','accounts-password','tinytest'], both);
  } else {
    api.use(['roles','accounts-password','tinytest'], both);
  }

  api.add_files('tests/client.js', 'client');
  api.add_files('tests/server.js', 'server');
});

// workaround for meter issue #1358
// https://github.com/meteor/meteor/issues/1358
function uiExists() {
  var fs = Npm.require('fs'),
      path = Npm.require('path'),
      meteorPackages;

  try {
    meteorPackages = fs.readFileSync(path.resolve('.meteor/packages'), 'utf8');
  } catch (ex) {
    return false;
  }

  if (!meteorPackages) {
    return false;
  }

  if (/^\s*ui\s*$/m.test(meteorPackages)) {
    // definitely there
    return true;
  }

  //if (/^\s*standard-app-packages\s*$/m.test(meteorPackages)) {
    // The ui package may or may _not_ be there...
    // Releases before 0.8.0 had standard-app-packages but not
    // ui.  Without weak references working properly, there is 
    // no good way to detect the inclusion of the ui package in
    // bundled apps.
  //}

  return false;
}
