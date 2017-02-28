'use babel';
//var thingml = require('./thingml')

const thingml = {
  config: {
    "pathToCLI": {
      "description": "Path to the ThingML compilers (JAR file)",
      "type": "string",
      "default": "<Path to the ThingML compilers (JAR file)>"
    }
  },

  activate: () => {
    atom.beep()
    atom.notifications.addError('Initializing ThingML...')
    atom.commands.add('atom-workspace', 'language-thingml:check', (event) => {
      thingml.check()
    })
    atom.commands.add('atom-workspace', 'language-thingml:compile-nodejs', (event) => {
      thingml.compile('nodejs')
    })
  },

  deactivate: () => {
    //this.subscriptions.dispose();
  },

  check: () => {
    var path = atom.workspace.getActiveTextEditor().getPath()
    atom.beep()
      atom.workspace.getActiveTextEditor().insertText('//Hello World')

      atom.notifications.addError('Checking hard... ' + path)
      console.log('Checking hard... ' + path)
  },

  compile: (compiler) => {
    var path = atom.workspace.getActiveTextEditor().getPath()
    atom.notifications.addError('Compiling hard... ' + path)
    switch (editor) {
      case 'arduino':
        atom.notifications.addError('Compiling hard to Arduino...')
        break;
      case 'posix':
        atom.notifications.addError('Compiling hard to POSIX...')
        break;
      case 'nodejs':
        atom.notifications.addError('Compiling hard to NodeJS...')
        break;
      case 'java':
        atom.notifications.addError('Compiling hard to Java...')
        break;
      default:
        atom.notifications.addError('Cannot compile to ' + compiler)
    }
  }
}

export default thingml;
