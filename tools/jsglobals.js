/*
  Run one of the functions: findDifference(), printNames()
  Requires: fake-dom.js
*/
var ignoreGlobalsWarnings = {
  extendClassChain: "Class extend helper",
  extendStaticMembers: "Class extend helper",
  extendInterfaceMembers: "Class extend helper",
  addMethod: "Class add method helper",
  createJavaArray: "Create array helper",
  defineProperty: "Utility to define object properties (ECMAScript v5)",
  imageData: "Canvas imageData object"
};

// reading pjs
var s, lines = [];
while((s = readline()) !== null)
{ 
  lines.push(s);
}

// eval
var code = lines.join("\n");
eval(code);
var namesMatch = /\bgetGlobalMembers\b[^\[]+(\[[^\]]+\])/.exec(code);
var names = eval(namesMatch[1]);

var samplePjs = new Processing(canvas, "var i = 0;");
var n,i;

var actualGlobals = {};
for(n in samplePjs) {
  if(samplePjs.hasOwnProperty(n)) {
    actualGlobals[n] = true;
  }
}

var expectedGlobals = {};
for(n in ignoreGlobalsWarnings) {
  if(samplePjs.hasOwnProperty(n)) {
    expectedGlobals[n] = false;
  }
}
for(i=0;i<names.length;++i) {
  expectedGlobals[names[i]] = true;
}

function findDifference() {
  var n, warnings = 0, errors = 0;
  for(n in expectedGlobals) {
    if(expectedGlobals.hasOwnProperty(n) && expectedGlobals[n]) {
      if(!actualGlobals[n]) {
        print("WARNING: expected \'" + n + "\' but not found in actual object");
        warnings++;
      } 
    }    
  }
  for(n in actualGlobals) {
    if(actualGlobals.hasOwnProperty(n)) {
      if(!(n in expectedGlobals)) {
        print("ERROR: \'" + n + "\' is not found in globals");
        errors++;
      } 
    }    
  }
  print("jsglobals.js found: " + errors + " error(s); " + warnings + " warning(s).");
}

function printNames() {
  var newNames = [];
  for(n in actualGlobals) {
    if(actualGlobals.hasOwnProperty(n) && !(n in ignoreGlobalsWarnings)) {
      newNames.push(n);
    }    
  }  
  newNames.sort(function(s1, s2) {
    var s1i = s1.toUpperCase(), s2i = s2.toUpperCase();
    return s1i === s2i ? 0 : s1i < s2i ? -1 : 1;
  });
  // pretty print
  var indent = "    ";
  print(indent + "[ /* this code is generated by jsglobals.js */");
  var line = indent;
  for(var i=0;i<newNames.length; ++i) {
    var name = "\"" + newNames[i] + "\", ";
    if(line.length + name.length > 80) {
      print(line)
      line = indent;
    }
    line += name;
  }
  print(line.substring(0, line.length - 2) + "];");
}
