// source: https://stackoverflow.com/a/1026087
export const capitalizeFirstLetter = (string) => string ? string.charAt(0).toUpperCase() + string.slice(1) : string;


export const REGEX = {
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


export const countLines = (str, index) => (str.slice(0, index).match(/\n/g) || []).length + 1;
