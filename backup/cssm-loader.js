const path = require('path');
// import path from "path";

// source: https://stackoverflow.com/a/1026087
const capitalizeFirstLetter = (string) => string ? string.charAt(0).toUpperCase() + string.slice(1) : string;


const REGEX = {
  CLASS_NAME: /(class\s+(\w{1}[\w\d]*)\s*{)|(class\s+(\w{1}[\w\d]*)\s*extends)/,
  EVENT_ONE: /event-(\w+)/,
  EVENT_MANY: /event-(\w+)/g,
  EVENT_HANDLER: (tag, type) => new RegExp(`handle${capitalizeFirstLetter(tag)}${capitalizeFirstLetter(type)}`),
  ATTR_VALUE: /([-\w\d]+)\/([\w\d]+)/,
  COMPONENT: /component.(\w+)/,
  PROPERTY: /(\w+)(=((\d+)|("([^"\\]|\\.|\\\n)*"|'([^'\\]|\\.|\\\n)*')))?/,
  COMPONENT_PROPERTIES: /(\s+(\w+)=((\d+)|("([^"\\]|\\.|\\\n)*"|'([^'\\]|\\.|\\\n)*')))|(\s+(\w+))/gm, // to-do: why whitespace ?
  STRING: /"([^"\\]|\\.|\\\n)*"|'([^'\\]|\\.|\\\n)*'/, // https://stackoverflow.com/a/29452781
  SELF_CLOSING_TAG: /\<component.(\w+)((\s+(\w+)=((\d+)|("([^"\\]|\\.|\\\n)*"|'([^'\\]|\\.|\\\n)*')))|(\s+(\w+)))*\s+\/\>/g
}


const countLines = (str, index) => (str.slice(0, index).match(/\n/g) || []).length + 1;



// module.exports.REGEX = REGEX;
// module.exports.capitalizeFirstLetter = capitalizeFirstLetter;
// module.exports.countLines = countLines;
// export default {
//   REGEX,
//   capitalizeFirstLetter,
//   countLines
// }

// const { REGEX, countLines, capitalizeFirstLetter } = require("./utils");
// import utils from "utils.js";


const modeJs = (source, resourcePath) => {
  const filename = path.basename(resourcePath);
  console.log(`Loading '${filename}'...`);
  const eventMatches = source.matchAll(REGEX.EVENT_MANY);
  if (eventMatches) {
    for (const match of eventMatches) {
      const { index } = match;
      const lineN = countLines(source, index);
      console.log(`Warning: ${match[0]} has been mentioned on line ${lineN}, \
but no mention to its handle${capitalizeFirstLetter(match[1])} exists.`);
    }
    
  }

  return source;
}


const modeHTML = (source) => {
  return `
    //export default ({ id, props, state }) => {
    module.exports = ({ id, props, state }) => {
      ${source}
    }
  `;
}


module.exports = function (source) {
  
  try {
    const options = this.getOptions();
    switch(options.mode) {
      case "html":
        source = modeHTML(source);
        break;
      case "js":
        source = modeJs(source, this.resourcePath);
        break;
      default:
        throw new Error(`Mode unknown: ${options.mode}.`);
        break;
    }
    
  } catch(err) {
    console.error(50, err);
  }

  console.log(53, 'loader');

  return source;
}






/*
// import { Parser } from "acorn";
// const acorn = require("acorn");
// const { Parser } = require("acorn");
// const recast = require("recast");
// const ts = require('typescript');
  
  const node = ts.createSourceFile(
    'x.ts',   // fileName
    source, // sourceText
    ts.ScriptTarget.Latest // langugeVersion
  );
  node.forEachChild(child => {
      if (ts.SyntaxKind[child.kind] === "ClassDeclaration") {
        console.log("Class name: ", child.name.escapedText);
        // console.log(31, Object.keys(child), child.name.escapedText);
        // const h = child.heritageClauses[0]
        // const classCode = source.slice(h.pos, h.end);
        console.log(32, child.decorators);
        // console.log(33, child.members.map(m => m.name));
        child.members.forEach(member => {
          // console.log(41, member.name?.escapedText);
          if (member.name?.escapedText === "renderHTML") {
            console.log("Class method", "renderHTML");
            const h = member.initializer.body.statements[1];
            // console.log(423, source.slice(h.pos, h.end));
            member.initializer.body.statements[0].declarationList.forEachChild(child2 => {
              (child2.initializer?.templateSpans || []).forEach(temp => {
                console.log(50, temp.literal.rawText);
              })
            });
          }
          
        })
        for (const [key, value] of Object.entries(child)) {
          // console.log(key, value);
          // to-do: emit warning about presence of event-click
        }
      }
      
    });
  } catch (err) {
    console.log(55, err);
  }
  // console.log(25, node);
 */