
module.exports = completerSync;
module.exports.sync = completerSync;
//module.exports.async = completerAsync;

var path = require('path')
  , fs = require('fs')

// path completer in sync mode
function completerSync (line) {

  // parse the line, extract the base folder and the ending name
  var parseResult = parseLineSync(line)
    , folder = parseResult[0]
    , name = parseResult[1]

  // catch exceptions thrown by fs functions in sync mode 
  try {
    var stat = fs.lstatSync(folder)

    // ensure that folder is a directory
    if (!stat.isDirectory(folder)) { return [[], line] }

    // get the files contained in folder
    var files = fs.readdirSync(folder)
    
    // filter those which starts by name
    var matched = files.filter(function (file) {
      return file.indexOf(name) === 0 
    });

    // build the result list by adding the base folder to the matched files.
    var resultList = matched.map(function (file) {
      return folder + '/' + file
    });

    return [resultList, line]
  }
  catch (err) {
    // here an error with fs has occured, return nothing to complete
    return [[], line]
  }
}

// parse the line in sync mode, return the base folder and the ending name
function parseLineSync (line) {

  // test if line is empty
  if (line.length === 0) {
    return ['.', '']
  }

  // test if the last char of the line is a directory separator
  if (line[line.length - 1] === path.sep) {
    return  [line.slice(0, line.length - 1) , '']
  }

  // general case, functions of the module path do the trick
  return [path.dirname(line), path.basename(line)]
}
