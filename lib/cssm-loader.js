const path = require('path');

const { REGEX, countLines, capitalizeFirstLetter } = require("./utils");


module.exports = function(source) {
  
  try {
    // const options = this.getOptions();
    // var callback = this.async();
    const filename = path.basename(this.resourcePath)

  //   console.log(`Loading '${filename}' ...`);
  // console.log(5, this.resourcePath);
  // return source;

    console.log(`Loading '${filename}'...`);
    const eventMatches = source.matchAll(REGEX.EVENT_MANY);
    if (eventMatches) {
      for (const match of eventMatches) {
        const { index } = match;
        const lineN = countLines(source, index);
        console.log(`Warning: ${match[0]} has been mentioned on line ${lineN}, \
but no mention to its handle${capitalizeFirstLetter(match[1])} exists.`);
        // console.log(14, index, , source.slice(index, index+100));
      }
      
    }
  } catch(err) {
    console.log(18, err);
  }
  
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