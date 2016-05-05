var riot = require('riot-compiler'),
    loaderUtils = require('loader-utils'),
    fs = require('fs'),
    path = require('path');

module.exports = function (source) {

    var content = source;
    var options = loaderUtils.parseQuery(this.query);

    if (this.cacheable) this.cacheable();

    Object.keys(options).forEach(function(key) {
        switch(options[key]) {
            case 'true':
                options[key] = true;
                break;
            case 'false':
                options[key] = false;
                break;
            case 'undefined':
                options[key] = undefined;
                break;
            case 'null':
                options[key] = null;
                break;
        }
    });

    var rpath = this.resourcePath;
    var tagStart = content.indexOf('<') + 1;
    var tag = content.substr(tagStart, content.indexOf('>') - tagStart);

    var cssPath = path.resolve(path.dirname(rpath), tag + '.css');
    if(fs.existsSync(cssPath)) { this.dependency(cssPath); content = "require('./" + tag + ".css');" + '\n' + content; }

    var lessPath = path.resolve(path.dirname(rpath), tag + '.less');
    if(fs.existsSync(lessPath)) { this.dependency(lessPath); content = "require('./" + tag + ".less');" + '\n' + content; }

    var scriptPath = path.resolve(path.dirname(rpath), tag + '.js');
    if(fs.existsSync(scriptPath)) {
        this.dependency(scriptPath);
        var tagEndStart = content.lastIndexOf('</' + tag + '>');
        if(tagEndStart > -1) {
            var scriptElement = '    <script>\n        js(this, opts);\n    </script>\n';
            content = [content.slice(0, tagEndStart), scriptElement, content.slice(tagEndStart)].join('');
            content = "var js = require('./" + tag + ".js');" + '\n' + content;
        }
    }

    try {
        return riot.compile(content, options);
    } catch (e) {
        if (e instanceof Error) {
            throw e;
        } else {
            throw new Error(e);
        }
    }
};
