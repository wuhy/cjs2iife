/**
 * @file commonjs 模块的解析器
 * @author sparklewhy@gmail.com
 */

var estraverse = require('estraverse');
var util = require('./util');


/**
 * 获取给定代码的抽象语法树
 *
 * @param {string} code js 代码
 * @return {?Object}
 */
exports.getAst = function (code) {
    return require('esprima').parse(code, {
        tokens: true,
        comment: true,
        range: true
    });
};

/**
 * 解析模块的依赖
 *
 * @param {Object} ast 代码的 ast 实例
 * @param {string=} baseId 相对的模块 id
 * @return {Array.<string>} 返回依赖的模块的 id
 */
exports.parseDeps = function (ast, baseId) {
    var syncDeps = [];
    var syncDepMap = {};

    estraverse.traverse(ast, {
        enter: function (node) {
            var requireId = util.getRequireModueId(node);
            if (requireId) {
                var id = util.resolveModuleId(requireId, baseId);
                if (!syncDepMap[id]) {
                    syncDepMap[id] = true;
                    syncDeps.push(id);
                }

                this.skip();
            }
        }
    });

    return syncDeps;
};
