"use strict";

var Transform = require("readable-stream/transform");
var rs        = require("replacestream");
var decToAny  = require("decimal-to-any");

var decToAnyOptions = {
    alphabet: "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_"
};

var Replacer = function(options) {
    var prefix  = options.prefix || "-pre-";
    var postfix = options.postfix || "-post-";

    var currentIndex = 0;
    var namesMap = {};

    this.regExp = new RegExp(prefix + "[\\w_-]+?" + postfix, "ig");
    this.replaceFn = function(str) {
        if (!namesMap[str]) {
            namesMap[str] = "a" + decToAny(currentIndex, decToAnyOptions.alphabet.length, decToAnyOptions);
            currentIndex++;
        }

        return namesMap[str];
    };
};

module.exports = function(options) {
    options = options || {};
    var replacer = new Replacer(options);

    return new Transform({
        objectMode: true,
        transform: function(file, enc, callback) {
            if (file.isStream()) {
                file.contents = file.contents.pipe(rs(replacer.regExp, replacer.replaceFn));
                return callback(null, file);
            }

            if (file.isBuffer()) {
                file.contents = new Buffer(String(file.contents).replace(replacer.regExp, replacer.replaceFn));

                return callback(null, file);
            }

            callback(null, file);
        }
    });
};
