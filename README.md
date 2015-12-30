
cjs2iffe
========

[![Build Status](https://travis-ci.org/wuhy/cjs2iife.svg?branch=master)](https://travis-ci.org/wuhy/cjs2iife) [![Dependencies Status](https://david-dm.org/wuhy/cjs2iife.png)](https://david-dm.org/wuhy/cjs2iife)

> Convert all commonjs files to one immediately-invoked-function-expression file

## Background

When you wanna develop a library, but you don't need to support `AMD` or `CommonJS` or `CMD` or `UMD` in production environment. Finnaly you only need a combined `iffe` file to deploy. Howerver, the library code base is not small, you still need a module style to manage your source code to avoid your code in mess. This tool is for it, you can using `CommonJS` module style to write your code, and use this tool to pack to one `iffe` file.

## Usage

### Install

```shell
npm install cjs2iffe
```

### Example

```javascript
var cjs2iffe = require('cjs2iffe');
cjs2iffe({
    dir: 'src',     // the source base dir
    main: 'index',  // the entry module to pack
    compress: true, // enable the compress option
    output: 'dist/combine.min.js' // the output file path
});
```
