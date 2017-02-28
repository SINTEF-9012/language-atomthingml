'use babel';

var spawn = require('child_process').spawn;
var fs = require('fs');

const thingml = {
  config: {
    "pathToCLI": {
      "description": "Path to the ThingML compilers (JAR file)",
      "type": "string",
      "default": "<Path to the ThingML compilers (JAR file)>"
    }
  },

  activate: () => {
    thingml.check_cmd = atom.commands.add('atom-workspace', 'language-thingml:check', (event) => {
      thingml.check()
    })
    thingml.js_cmd = atom.commands.add('atom-workspace', 'language-thingml:compile-nodejs', (event) => {
      thingml.compile('nodejs')
    })
  },

  deactivate: () => {
    thingml.check_cmd.dispose();
    thingml.js_cmd.dispose();
    //this.subscriptions.dispose();
  },

  check: () => {
      atom.notifications.addInfo('Checking hard... ' + path)
      console.log('Checking hard... ' + path)
  },

  compile: (compiler) => {
    var path = atom.workspace.getActiveTextEditor().getPath()
    switch (compiler) {
      case 'arduino':
        atom.notifications.addError('Compiling hard to Arduino...')
        break;
      case 'posix':
        atom.notifications.addError('Compiling hard to POSIX...')
        break;
      case 'nodejs':
        thingml.callCompiler('nodejs', path, path + '/../target')
        break;
      case 'java':
        atom.notifications.addError('Compiling hard to Java...')
        break;
      default:
        atom.notifications.addError('Cannot compile to ' + compiler)
    }
  },

  callCompiler: (compiler, src, output) => {
    atom.notifications.addInfo('Compiling hard...')
    var cli = atom.config.get('language-thingml.pathToCLI')
    if (cli == undefined || cli == null || cli === '') {
      atom.notifications.addError('Cannot compile as the path to the ThingML CLI (JAR) has not been set. Please check the settings of the Thingml package.')
      return
    }

    if (!fs.existsSync(output)){
      atom.notifications.addInfo('Creating ' + output + ' folder...')
      fs.mkdirSync(output);
    }

    var java = spawn('java', [
      '-jar', cli,
      '-c', compiler,
      '-s', src,
      '-o', output
    ]);

    java.stdout.on('data', (data) => {
      atom.notifications.addInfo(`INFO: ${data}`);
    });

    java.stderr.on('data', (data) => {
      atom.notifications.addError(`ERROR: ${data}`);
    });

    java.on('close', (code) => {
      atom.notifications.addInfo(`DONE: ${code}`);
    });
  }
}

export default thingml;
