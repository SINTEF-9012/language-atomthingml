'use babel';

var spawn = require('child_process').spawn;
var fs = require('fs');

var MessagePanelView = require('atom-message-panel').MessagePanelView,
    LineMessageView = require('atom-message-panel').LineMessageView
    PlainMessageView = require('atom-message-panel').PlainMessageView;

const thingml = {
  config: {
    "pathToCLI": {
      "description": "Path to the ThingML compilers (JAR file)",
      "type": "string",
      "default": "<Path to the ThingML compilers (JAR file)>"
    },
    "outputFolder": {
      "description": "Path to the output folder for generated code",
      "type": "string",
      "default": "/../target"
    }
  },

  messages: new MessagePanelView({
    title: 'ThingML'
  }),

  activate: () => {
    thingml.messages.attach();
    thingml.check_cmd = atom.commands.add('atom-workspace', 'language-thingml:check', (event) => {
      thingml.check()
    })
    thingml.js_cmd = atom.commands.add('atom-workspace', 'language-thingml:compile-nodejs', (event) => {
      thingml.compile('nodejs')
    })
    thingml.js_cmd = atom.commands.add('atom-workspace', 'language-thingml:compile-browser', (event) => {
      thingml.compile('browser')
    })
    thingml.java_cmd = atom.commands.add('atom-workspace', 'language-thingml:compile-java', (event) => {
      thingml.compile('java')
    })
    thingml.arduino_cmd = atom.commands.add('atom-workspace', 'language-thingml:compile-arduino', (event) => {
      thingml.compile('arduino')
    })
    thingml.posix_cmd = atom.commands.add('atom-workspace', 'language-thingml:compile-posix', (event) => {
      thingml.compile('posix')
    })
    thingml.uml_cmd = atom.commands.add('atom-workspace', 'language-thingml:compile-uml', (event) => {
      thingml.compile('UML')
    })
  },

  deactivate: () => {
    thingml.check_cmd.dispose();
    thingml.js_cmd.dispose();
    thingml.java_cmd.dispose();
    thingml.arduino_cmd.dispose();
    thingml.posix_cmd.dispose();
    thingml.uml_cmd.dispose();
    thingml.messages.close();
  },

  check: () => {
    thingml.messages.clear();
    thingml.out('Checking hard...');
  },

  compile: (compiler) => {
    thingml.messages.clear();
    var path = atom.workspace.getActiveTextEditor().getPath()//FIXME: this is not always the path of the file we want (e.g. if we right click in the tree view)
    var output = atom.config.get('outputFolder')
    if (output == undefined || output == null || output === '') {
      output = '/../target'
    }
    if (output.startsWith('/..')) {//relative path
      output = path + output
    }
    thingml.callCompiler(compiler, path, output)
  },

  errLine: (file, line, msg) => {
    thingml.messages.add(new LineMessageView({
      message: msg,
      line: line,
      file: file,
      className: 'text-error'
    }));
  },


  err: (msg) => {
    atom.notifications.addError(msg);
    thingml.messages.add(new PlainMessageView({
      message: msg,
      className: 'text-error'
    }));
  },

  warn: (msg) => {
    atom.notifications.addWarning(`${msg}`);
    thingml.messages.add(new PlainMessageView({
      message: msg,
      className: 'text-warning'
    }));
  },

  out: (msg) => {
    thingml.messages.add(new PlainMessageView({
      message: msg,
      className: 'text-info'
    }));
  },

  success: (msg) => {
    atom.notifications.addSuccess(msg);
    thingml.messages.add(new PlainMessageView({
      message: msg,
      className: 'text-success'
    }));
  },

  callCompiler: (compiler, src, output) => {
    thingml.out('Compiling hard...');
    var cli = atom.config.get('language-thingml.pathToCLI')
    if (cli == undefined || cli == null || cli === '') {
      thingml.err('Cannot compile as the path to the ThingML CLI (JAR) has not been set. Please check the settings of the Thingml package.');
      return
    }

    if (!fs.existsSync(output)){
      thingml.out('Creating ' + output + ' folder...');
      fs.mkdirSync(output);
    }

    var java = spawn('java', [
      '-jar', cli,
      '-c', compiler,
      '-s', src,
      '-o', output
    ]);

    var timeout = setTimeout(()=>{
      thingml.err('Compilation taking too long, killing compiler...');
      java.kill()
    }, 30000);

    var hasError = false;

    java.stdout.setEncoding('utf8');
    java.stdout.on('data', (data) => {
      data.trim().split('\n').forEach(line => {
        if (line.startsWith('[WARNING]')) {
          thingml.warn(line);
        } else if (line.startsWith('[ERROR]')) {//ideally, that should arrive on stderr
          hasError = true;
          thingml.err(line);
        } else {
          thingml.out(line);
        }
      });
    });

    java.stderr.setEncoding('utf8');
    java.stderr.on('data', (data) => {
      data.trim().split('\n').forEach(line => {
        hasError = true;
        thingml.err(line);
        var fileRegex = /([a-zA-Z]:\\)?([a-zA-Z0-9_ \-\./]+\\)*[a-zA-Z0-9_ @\-\./]+\.thingml/i
        var lineRegex = /\(([0-9]*),/
        if (line.match(fileRegex).length > 0 && line.match(lineRegex).length > 1) {//we have a file and a line (most likely)
          thingml.errLine(line.match(fileRegex)[0], line.match(lineRegex)[1], line);
        }
    });
    });

    java.on('error', (err) => {
      hasError = true;
      thingml.err('Something went wrong with the compiler!');
      clearTimeout(timeout);
    });

    java.on('exit', (code) => {
      if (hasError) {
        thingml.err('Cannot complete because of errors!');
      } else {
        thingml.success('Done!');
      }
      clearTimeout(timeout);
    });
  }
}

export default thingml;
