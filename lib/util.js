/**
 * @file 工具方法定义
 * @author sparklewhy@gmail.com
 */

var fs = require('fs');
var path = require('path');
var estraverse = require('estraverse');
var SYNTAX = estraverse.Syntax;

/**
 * 判断结点是否字符串直接量
 *
 * @inner
 * @param {Object} node 语法树结点
 * @return {boolean}
 */
function isStringLiteral(node) {
    return node
        && node.type === SYNTAX.Literal
        && typeof node.value === 'string';
}

/**
 * 递归的遍历目录文件
 *
 * @param {string} dir 扫描初始目录
 * @param {function(string):boolean} callback 回调函数，只有扫描到文件才触发回调
 */
exports.scanDir = function (dir, callback) {
    fs.readdirSync(dir).forEach(
        function (file) {
            var fullPath = path.join(dir, file);
            var stat = fs.statSync(fullPath);

            if (stat.isDirectory()) {
                exports.scanDir(fullPath, callback);
            }
            else if (stat.isFile()) {
                var rv = callback(fullPath);
                if (rv === false) {
                    return false;
                }
            }
        }
    );
};

/**
 * 将给定的模块 id 转换成变量访问方式， e.g., 'a/b' => ['a']['b']
 *
 * @param {string} id 要转换的 模块 id
 * @return {string}
 */
exports.id2VarAccessor = function (id) {
    if (!id) {
        return id;
    }

    var parts = id.split('/');
    return parts.map(function (key) {
        return '[\'' + key + '\']';
    }).join('');
};

/**
 * 将相对的 module id 转换成绝对 id
 *
 * @param {string} id 要转换的 id
 * @param {string} baseId 基础 id
 * @return {string}
 */
exports.resolveModuleId = function (id, baseId) {
    if (/^\./.test(id) && baseId) {
        return exports.normalizePath(path.join(path.dirname(baseId), id));
    }
    return id;
};


/**
 * 对给定路径进行规范化，统一用 `/` 方式
 *
 * @param {string} sourcePath 要规范化的路径
 * @return {string}
 */
exports.normalizePath = function (sourcePath) {
    return sourcePath.replace(/\\/g, '/');
};

/**
 * 获取 `require` 的模块 id
 *
 * @inner
 * @param {Object} node ast 节点
 * @return {?string}
 */
exports.getRequireModueId = function (node) {
    // `require('xxx')` or `new require('xxx')`
    if (node.type !== SYNTAX.CallExpression
        && node.type !== SYNTAX.NewExpression
    ) {
        return;
    }

    var arg;
    var REQUIRE = require('./constant').REQUIRE;
    if (node.callee.name === REQUIRE
        && (arg = node.arguments[0])
        && isStringLiteral(arg)
    ) {
        return arg.value;
    }
};
