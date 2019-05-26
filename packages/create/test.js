/**
 * Simple node program to test that workspace creation works.
 * We don't use a test framework here since dependencies are awkward.
 */
const pkg = 'build_bazel_rules_nodejs/packages/create/npm_package';
const path = require('path');
const fs = require('fs');
const {main} = require(pkg);

function fail(...msg) {
  console.error(msg);
  process.exitCode = 1;
}

let error = '';
function captureError(...msg) {
  error = msg.join(' ');
}

main([], captureError);
if (error.indexOf('specify the workspace directory') < 0) {
  fail('expected', error, 'to tell the user they missed an argument');
}

process.chdir(process.env['TEST_TMPDIR']);
main(['some-project'], captureError);
const projFiles = fs.readdirSync('some-project');
if (!projFiles.indexOf('.bazelrc') < 0) {
  fail('project should have .bazelrc');
}
const wkspContent = fs.readFileSync('some-project/WORKSPACE');
if (wkspContent.indexOf('npm_install') < 0) {
  fail('should use npm by default');
}
// TODO: run bazel in the new directory to verify a build works

process.env['_'] = '/usr/bin/yarn';
main(['default-to-yarn']);
if (fs.readFileSync('default-to-yarn/WORKSPACE').indexOf('yarn_install') < 0) {
  fail('should use yarn by default')
}
// TODO: run bazel in the new directory to verify a build works