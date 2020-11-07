(function(graph){
      function require(module) {
        function Pathrequire(relativePath) {
          return require(graph[module].dependencies[relativePath])
        }
        const exports = {};
        (function(require, code, exports){
          eval(code)
        })(Pathrequire,graph[module].code, exports)
        return exports;
      }
      require('./src/index.js')
    })({"./src/index.js":{"dependencies":{"./a.js":"./src\\a.js","./b.js":"./src\\b.js"},"code":"\"use strict\";\n\nvar _a = require(\"./a.js\");\n\nvar _b = require(\"./b.js\");\n\nconsole.log(\"hello \".concat(_a.str, \" \").concat(_b.str2));"},"./src\\a.js":{"dependencies":{},"code":"\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.str = void 0;\nvar str = 'webpack';\nexports.str = str;"},"./src\\b.js":{"dependencies":{},"code":"\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.str2 = void 0;\nvar str2 = \"!!!\";\nexports.str2 = str2;"}})