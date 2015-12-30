/**
 * @file 入口模块
 * @author sparklewhy@gmail.com
 */

/**
 * 将给定的 commonJS 模块 file 转成 一个文件的 iffe 代码
 *
 * @param {Object} options 转换选项
 * @param {string} options.dir 要转换的文件所在目录
 * @param {string} options.main 入口模块 id，相对于 `dir`，可选，
 *                 未指定，将默认把指定的文件目录下的 `index` 作为入口模块
 * @param {boolean|Object=} options.compress 是否压缩转换后的代码，或者压缩选项
 * @param {string=} options.output 输出目标文件
 * @return {string}
 */
module.exports = exports = function (options) {
    var _ = require('lodash');
    var converter = require('./lib/converter');
    var workingDir = process.cwd();

    options = _.extend({
        dir: workingDir,
        main: 'index'
    }, options);
    return converter(options);
};
