const {
  kuma: { macros: Macros, parseMacroArgs, extractMacros },
} = require('@webdoky/yari-ports');

// List of macros that should be processed anyway, i.e for rendering navigation
navigationalMacros = ['cssref', 'jssidebar', 'jsref'];

const runMacros = (content, context, navigationOnly = false) => {
  const { path } = context;
  let resultContent = content;
  const recognizedMacros = extractMacros(content);
  const data = {
    macros: [],
  };

  const macrosRegistry = new Macros(context);

  recognizedMacros.map((expression) => {
    const { match, functionName, args } = expression;

    if (!navigationOnly || navigationalMacros.includes(functionName)) {
      let result = match; // uninterpolated macros will be visible by default
      const macroFunction = macrosRegistry.lookup(functionName);
      if (macroFunction) {
        try {
          if (args) {
            result = macroFunction(...parseMacroArgs(args));
          } else {
            result = macroFunction();
          }
        } catch (e) {
          throw new Error(
            `Error while processing page ${path} with macro {{${functionName}${
              args ? `(${args})` : ''
            }}}. Original error: ${e.message}`
          );
        }
      }
      if (typeof result !== 'string') {
        // if the output is not a string, then we have to additionaly process it in the app
        // so put it into data layer instead
        data.macros.push({
          macro: functionName.toLowerCase(),
          result: JSON.stringify(result),
        });

        result = '';
      }
      if (result !== match) {
        // don't spend processor cycles on replacing the same strings
        resultContent = resultContent.replace(match, result);
      }
    }
  });

  return {
    content: resultContent,
    data,
  };
};

module.exports = {
  runMacros,
};
