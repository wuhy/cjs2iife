
cjs2iife
========

[![Build Status](https://travis-ci.org/wuhy/cjs2iife.svg?branch=master)](https://travis-ci.org/wuhy/cjs2iife) [![Dependencies](https://img.shields.io/david/wuhy/cjs2iife.svg?style=flat)](https://david-dm.org/wuhy/cjs2iife)  [![devDependency Status](https://david-dm.org/wuhy/cjs2iife/dev-status.svg)](https://david-dm.org/wuhy/cjs2iife#info=devDependencies) [![NPM Version](https://img.shields.io/npm/v/cjs2iife.svg?style=flat)](https://npmjs.org/package/cjs2iife) [![Coverage Status](https://img.shields.io/coveralls/wuhy/cjs2iife.svg?style=flat)](https://coveralls.io/r/wuhy/cjs2iife)

> Convert all commonjs files to one immediately-invoked-function-expression file

## Background

When you wanna develop a library, but you don't need to support `AMD` or `CommonJS` or `CMD` or `UMD` in production environment. Finnaly you only need a combined `iife` file to deploy. Howerver, the library code base is not small, you still need a module style to manage your source code to avoid your code in mess. This tool is for it, you can using `CommonJS` module style to write your code, and use this tool to pack to one `iife` file.

## Usage

### Install

```shell
npm install cjs2iife
```

### Example

```javascript
var cjs2iife = require('cjs2iife');
var result = cjs2iife({
    dir: 'src',     // the source base dir
    main: 'index',  // the entry module to pack
    compress: true, // enable the compress option, optional, default not compress
    output: 'dist/combine.min.js', // the output file path, optional
    exports: 'myGlobalObj' // the variable name to export to window object, optional
});
```
