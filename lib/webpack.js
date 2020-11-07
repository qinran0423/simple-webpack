
const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default
module.exports = class webpack {
  constructor(options) {
    const {entry, output} = options
    this.entry = entry
    this.output = output
  }

  run() {
    // 开始编辑，执行打包
    this.parse(this.entry)
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
        const pathName = "./" + path.join(path.dirname(entryFile),node.source.value)
        console.log(pathName);
      }
    })
    // 处理内容

  }

}