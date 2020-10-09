"use strict";

var Transform = require("readable-stream/transform");
var rs        = require("replacestream");
var farmhash  = require("farmhash");

var Replacer = function(options) {
    var method  = (options.method  !== undefined ? options.method  : "index");

    var prefix  = (options.prefix  !== undefined ? options.prefix  : "-pre-");
    var postfix = (options.postfix !== undefined ? options.postfix : "-post-");

    var prepend = (options.prepend !== undefined ? options.prepend : "a");
    var append  = (options.append  !== undefined ? options.append  : "");

    var buster  = (options.buster  !== undefined ? options.buster  : "");
    var slice   = (options.slice   !== undefined ? options.slice   : -1);

    var currentIndex = 0;
    var namesMap = {};
    var reverseMap = {};

    this.regExp = new RegExp(prefix + "([a-zA-Z0-9_-]*)" + postfix, "g");

    this.replaceFn = function(str) {
        if (!namesMap[str]) {
            var number;

            switch (method) {
                case "hash-weak":
                case "hash-strong": {
                    var fnHasher = (method === "hash-weak" ? farmhash.hash32 : farmhash.hash64);
                    number = (+fnHasher(buster + str));
                    break;
                }
                default: {
                    number = currentIndex++;
                }
            }

            var minified = number.toString(36);

            if (slice > 0 && minified.length > slice) {
                minified = minified.substring(0, slice);
            }

            // Check collisions (ensure builds relying on an hasher are collision-safe)
            if (!reverseMap[minified]) {
                reverseMap[minified] = str;
            } else if (reverseMap[minified] !== str) {
                throw new Error("Collision detected for class: " + str + " - aborting");
            }

            namesMap[str] = prepend + minified + append;
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
