
const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const { transformFromAst } = require('@babel/core')
module.exports = class webpack {
  constructor(options) {
    const {entry, output} = options
    this.entry = entry
    this.output = output
    this.modules = []
  }

  run() {
    // 开始编辑，执行打包
    const info = this.parse(this.entry)
    this.modules.push(info)
    // 通过递归把所有的依赖push 到modules
    for(let i = 0; i< this.modules.length; i++) {
      const item = this.modules[i]
      const dependencies = item.dependencies
      if(dependencies) {
        for(let j in  dependencies) {
          this.modules.push(this.parse(dependencies[j]))
        }
      }
    }
    // 数组转对象结构
    const obj = {}
    this.modules.forEach(item => {
      obj[item.entryFile] = {
        dependencies: item.dependencies,
        code: item.code
      }
    })
    this.file(obj)
  }
  parse(entryFile) {
    // 分析入口文件内容
    const content = fs.readFileSync(entryFile, 'utf-8')

    // 处理依赖
    const ast =  parser.parse(content, {
      sourceType: 'module'
    })
    
    const dependencies = {}
    traverse(ast, {
      ImportDeclaration({node}) {
        const pathName =  './' + path.join(path.dirname(entryFile),node.source.value)
        dependencies[node.source.value] = pathName
      }
    })

    // 处理内容  
    const {code} = transformFromAst(ast, null, {
      presets: ["@babel/preset-env"]
    })
    return {
      entryFile,
      dependencies,
      code
    }
  }
  // 生成bundle文件，以及bundle文件的内容
  file(code) {
    // 生成代码内容 webpack 启动函数
    const filepath = path.join(this.output.path, this.output.filename)
    const newcode = JSON.stringify(code)
    const bundlecontent = `(function(graph){
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
      require('${this.entry}')
    })(${newcode})`
     // 生成main.js 位置是./dist目录
    fs.writeFileSync(filepath, bundlecontent, 'utf-8')
  }
}