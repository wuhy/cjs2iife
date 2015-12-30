/**
 * @file 代码产生器
 * @author sparklewhy@gmail.com
 */

var util = require('./util');
var gloablVarName = '_global';

/**
 * 更新模块 require 的 id 为绝对 id
 *
 * @param {Object} ast 抽象语法树实例
 * @param {string} baseId 相对的模块 id
 * @return {string}
 */
exports.rewriteRequireModulePath = function (ast, baseId) {
    var estraverse = require('estraverse');
    var SYNTAX = estraverse.Syntax;
    var REQUIRE = require('./constant').REQUIRE;

    var escodegen = require('escodegen');
    ast = escodegen.attachComments(ast, ast.comments, ast.tokens);

    estraverse.replace(ast, {
        enter: function (node) {
            var type = node.type;
            var requireId = util.getRequireModueId(node);
            if (requireId) {
                var id = util.resolveModuleId(requireId, baseId);
                var args = [{
                    type: SYNTAX.Literal,
                    value: id,
                    raw: id
                }];

                if (type === SYNTAX.CallExpression
                    || type === SYNTAX.NewExpression
                ) {
                    return {
                        type: type,
                        callee: {
                            type: SYNTAX.Identifier,
                            name: REQUIRE
                        },
                        arguments: args
                    };
                }
            }
        }
    });

    return escodegen.generate(ast, {
        comment: true
    });
};

function getValidName(context, name) {
    var counter = 0;
    var key = name;
    while (context[key]) {
        counter++;
        key = name + counter;
    }

    return key;
}

/**
 * 初始化名称控件
 *
 * @inner
 * @param {Object} context 要挂载的上下文
 * @param {string} ns 名称空间
 */
function initNamespace(context, ns) {
    var parts = ns.split('/');
    var value = context;
    for (var i = 0, len = parts.length; i < len; i++) {
        var name = parts[i];
        var result = value[name];
        if (result && i === len - 1) {
            // 考虑到可能存在同名的文件和文件夹
            name = getValidName(value, name);
            result = null;
        }
        result || (result = {});
        value = value[name] = result;
    }
}

/**
 * 按长度降序排序
 *
 * @inner
 * @param {Array.<string>} ids 要排序的 id 列表
 * @return {Array.<string>}
 */
function sortIdsByLenDesc(ids) {
    return ids.sort(function (a, b) {
        return b.length - a.length;
    });
}

/**
 * 获取给定模板的渲染引擎
 *
 * @inner
 * @param {string} tplName 模板名称
 * @return {Object}
 */
function getRenderer(tplName) {
    var etpl = require('etpl');
    etpl.config({
        commandOpen: '<!--',
        commandClose: '-->',
        variableOpen: '${{',
        variableClose: '}}'
    });

    var fs = require('fs');
    var path = require('path');
    var tpl = fs.readFileSync(path.join(__dirname, 'template', tplName)).toString();
    return etpl.compile(tpl);
}

/**
 * 产生所有的模块的命名空间定义
 *
 * @param {Array.<Object>} modules 所有的模块
 * @return {Object}
 */
exports.getNamespaceDefine = function (modules) {
    var context = {};
    var ids = [];
    modules.forEach(function (item) {
        ids.push(item.id);
    });

    sortIdsByLenDesc(ids);
    ids.forEach(function (id) {
        initNamespace(context, id);
    });

    return context;
};

/**
 * 生成所有模块的 iffe 代码
 *
 * @param {Array.<Object>} modules 要生成的所有模块列表
 * @return {string}
 */
exports.getModuleIFFECodes = function (modules) {
    if (!modules.length) {
        return '';
    }

    var codes = [];
    modules.forEach(function (item, index) {
        codes[index] = {
            code: item.data.toString(),
            namespace: util.id2VarAccessor(item.id)
        };
    });

    var renderer = getRenderer('iffe.tpl');
    return renderer({
        modules: codes,
        globalVarName: gloablVarName
    });
};

/**
 * 生成合并后的所有模块的 iffe 代码
 *
 * @param {Array.<Object>} modules 要生成的所有模块列表
 * @return {string}
 */
exports.getCombineIFFECodes = function (modules) {
    var nsDefine = exports.getNamespaceDefine(modules);

    var renderer = getRenderer('combine.tpl');
    return renderer({
        namespaceDefine: JSON.stringify(nsDefine),
        moduleDefines: exports.getModuleIFFECodes(modules),
        globalVarName: gloablVarName
    });
};

/**
 * 压缩 js 代码
 *
 * @param {string} code 要压缩的代码
 * @param {Object} options 压缩选项
 * @return {string}
 */
exports.compressJS = function (code, options) {
    var uglifyJS = require('uglify-js');
    (options || (options = {}));
    options.fromString = true;
    return uglifyJS.minify(code, options).code;
};
