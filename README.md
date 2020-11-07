# simple-webpack
实现一个简易版的webpack


webpack打包bundle原理分析


- 读取配置
  - 入口
    - 从哪个文件开始分析
  - 出口
    - 放到什么位置
    - 叫什么名字
- 入口函数，run开始编译 -》chunk
  - 从入口文件开始
    - 处理这个文件的依赖 
      - 进入依赖的模块 - 以递归的方式来处理
        - 处理这个模块的依赖
        - 处理这个模块的内容
    - 处理这个文件的内容
      - 借助babel工具， 帮助我们把内容编译成AST语法树  提取模块路径
      - 借助babel语法转移
    - chunk 包含了依赖关系 - 依赖图谱：对象的格式


- 生成bundle文件
  - 依赖图谱
  - webpack启动函数
    - require
    - exports
