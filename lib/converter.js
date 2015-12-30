/**
 * @file cjs 模块转换成 iffe
 * @author sparklewhy@gmail.com
 */

var fs = require('fs');
var util = require('./util');
var parser = require('./parser');
var generator = require('./generator');

/**
 * 读取所有 cjs 模块文件
 *
 * @inner
 * @param {string} dir 要读取的目录
 * @return {Array.<Object>}
 */
function readAllCJSModules(dir) {
    var modules = [];
    var jsSuffixReg = /\.js$/;
    util.scanDir(dir, function (filePath) {
        if (jsSuffixReg.test(filePath)) {
            var content = fs.readFileSync(filePath, 'utf8');
            filePath = util.normalizePath(filePath);
            var relativePath = filePath.replace(dir + '/', '');
            modules.push({
                data: content,
                id: relativePath.replace(jsSuffixReg, ''),
                path: relativePath,
                fullPath: filePath
            });
        }
    });
    return modules;
}

/**
 * 初始化模块的依赖信息
 *
 * @inner
 * @param {Array.<Object>} modules 要初始化的模块列表
 */
function initModuleDeps(modules) {
    modules.forEach(function (item) {
        var code = item.data.toString();
        var ast = parser.getAst(code);
        var deps = parser.parseDeps(ast, item.id);
        item.deps = deps;
        item.data = generator.rewriteRequireModulePath(ast, item.id);
    });
}

/**
 *  收集所有依赖节点
 *
 * @inner
 * @param {Object} node 要初始化的节点
 * @param {Array.<Object>} target 要保存的目标节点集合
 */
function collectAllDeps(node, target) {
    if (target.indexOf(node) !== -1) {
        return;
    }

    target.push(node);
    node.deps.forEach(function (item) {
        collectAllDeps(item, target);
    });
}

/**
 * 创建依赖图
 *
 * @inner
 * @param {Array.<Object>} modules 模块列表
 * @param {string} main 入口模块 id
 * @return {Object}
 */
function createDepGraph(modules, main) {
    var nodeList = [];
    var nodeMap = {};

    // 创建图的节点
    modules.forEach(function (item, index) {
        var nodeId = item.id;
        var node = {
            'id': nodeId,
            'data': item,
            'in': 0
        };
        nodeMap[nodeId] = node;
        nodeList[index] = node;
    });

    var initDepNodes = function (node, nodeMap) {
        var deps = node.deps || [];
        node.deps = deps;
        node.data.deps.forEach(function (nodeId) {
            var depNode = nodeMap[nodeId];
            depNode.in += 1;

            if (deps.indexOf(depNode) === -1) {
                deps.push(depNode);
            }
        });
    };

    // 初始化图节点的依赖信息
    nodeList.forEach(function (item) {
        initDepNodes(item, nodeMap);
    });

    var entryModule = nodeMap[main];
    if (!entryModule) {
        throw new Error('cannot find entry module id: ' + main);
    }

    var toPackNodeList = [];
    collectAllDeps(entryModule, toPackNodeList);

    return {
        nodeList: toPackNodeList,
        nodeMap: nodeMap
    };
}

/**
 * 查找零入读的节点
 *
 * @inner
 * @param {Array.<Object>} nodeList 所有的节点列表
 * @param {Object=} preferNode 优先要选择的节点，可选
 * @return {?Object}
 */
function findZeroInDegreeNode(nodeList, preferNode) {
    var found;
    nodeList.some(function (item) {
        if (item.in === 0 && (!preferNode || item === preferNode)) {
            found = item;
            return true;
        }
    });
    return found;
}

/**
 * 移除入度为零的节点
 *
 * @inner
 * @param {Object} node 要移除的入度为零的 node 节点
 * @param {Array.<Object>} nodeList 所有的节点列表
 */
function removeZeroInDegreeNode(node, nodeList) {
    (node.deps || []).forEach(function (item) {
        item.in--;
        if (item.in < 0) {
            item.in = 0;
        }
    });
    var index = nodeList.indexOf(node);
    nodeList.splice(index, 1);
}

/**
 * 根据依赖关系对所有模块进行拓扑排序
 *
 * @inner
 * @param {Array.<Object>} modules 所有模块列表
 * @param {string} main 入口模块 id
 * @return {Array.<Object>}
 */
function sortModulesByDep(modules, main) {
    var graph = createDepGraph(modules, main);

    var nodeList = graph.nodeList;
    var preferNode = graph.nodeMap[main];
    var sortedModules = [];
    var found;
    while ((found = findZeroInDegreeNode(nodeList, preferNode))) {
        sortedModules.push(found.data);
        removeZeroInDegreeNode(found, nodeList);
        preferNode = null;
    }

    if (nodeList.length) {
        throw 'Unexpected circle deps cannot resolve';
    }

    return sortedModules.reverse();
}

/**
 * cjs -> iffe 代码转换
 *
 * @param {Object} options 选项
 * @param {string} options.dir 要转换的模块代码所在目录
 * @param {string} options.main 入口模块 id
 * @param {string=} options.output 输出目标文件
 * @param {booelan|Object=} options.compress 是否对转换后代码进行合并，默认 false
 * @return {string}
 */
function converter(options) {
    var modules = readAllCJSModules(options.dir);
    initModuleDeps(modules);
    modules = sortModulesByDep(modules, options.main);

    var combineIFFECode = generator.getCombineIFFECodes(modules);
    var compressOpt = options.compress;
    if (compressOpt) {
        (compressOpt === true) && (compressOpt = {});
        combineIFFECode = generator.compressJS(combineIFFECode, compressOpt);
    }

    if (options.output) {
        fs.writeFileSync(options.output, combineIFFECode, 'utf8');
    }

    return combineIFFECode;
}

module.exports = exports = converter;
