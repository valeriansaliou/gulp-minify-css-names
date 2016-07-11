# gulp-minify-css-names

[![Build Status](https://travis-ci.org/valeriansaliou/gulp-minify-css-names.svg?branch=master)](https://travis-ci.org/valeriansaliou/gulp-minify-css-names)

> Gulp plugin to minify CSS classes and CSS IDs

**Forked from**: [gulp-minify-cssnames](https://github.com/Connormiha/gulp-minify-cssnames) from [@Connormiha](https://github.com/Connormiha).

## Usage

Minifying all names(class, id) with some postfix (default: '-post-').

### Example

We have css file:

```css
.-pre-menu-post- {color: red;}
.-pre-menu_top-post- {color: black;}
.-pre-menu_item-post- {color: green;}
.-pre-menu_item_active-post- {color: blue;}
.-pre-menu_item_active-post-::before {content: 'active'}
```

```javascript
var gulp = require('gulp');
var gulpMinifyCssNames = require('gulp-minify-css-names');

gulp.task('minify-css-names', function() {
    return gulp.src(['src/*.css'])
        .pipe(gulpMinifyCssNames())
        .pipe(gulp.dest('build'))
});
```

#### Result

```css
.a0 {color: red;}
.a1 {color: black;}
.a2 {color: green;}
.a3 {color: blue;}
.a3::before {content: 'active'}
```

### Example2

Our project has 3 files:

##### style.css

```css
.-pre-menu-post- {color: red;}
.-pre-menu_top-post- {color: black;}
.-pre-menu_item-post- {color: green;}
.-pre-menu_item_active-post- {color: blue;}
.-pre-menu_item_active-post-::before {content: 'active'}
```

##### index.html

```html
<div class="menu-post-" id="-pre-main-menu-post-">
    <div class="menu_item-post-">1</div>
    <div class="menu_item-post-">2</div>
    <div class="menu_item-post- .-pre-menu_item_active-post-">3</div>
</div>
```
##### app.js

```javascript
var $menuItems =  document.querySelectorAll('.-pre-menu_item-post-');
var $mainMenu = document.querySelector('#-pre-main-menu-post-');
```

##### Gulp task

```javascript
var gulp = require('gulp');
var gulpMinifyCssNames = require('gulp-minify-css-names');

gulp.task('minify-css-names', function() {
    return gulp.src(['src/style.css', 'src/index.html', 'src/app.js'])
        .pipe(gulpMinifyCssNames())
        .pipe(gulp.dest('build'))
});
```

#### Result

style.css
```css
.a0 {color: red;}
.a1 {color: black;}
.a2 {color: green;}
.a3 {color: blue;}
.a3::before {content: 'active'}
```
index.html
```html
<div class="a0" id="a4">
    <div class="a2">1</div>
    <div class="a2">2</div>
    <div class="a2 a3">3</div>
</div>
```
app.js
```javascript
var $menuItems = document.querySelectorAll('.a2');
var $mainMenu = document.querySelector('#a4');
```

## API

### gulp-minify-css-names([options])

#### options

Type: `Object`

##### options.prefix

Type: `String`
Default: `"-pre-"`

Alternative prefix for CSS names.
`Important: prefix should be valid for CSS class and ID`

##### options.postfix

Type: `String`
Default: `"-post-"`

Alternative postfix for CSS names.
`Important: postfix should be valid for CSS class and ID`

##### options.prepend

Type: `String`
Default: `"a"`

Post-processing: prepend given string to transformed CSS class and ID.
`Important: prepend should be valid for CSS class and ID`

##### options.append

Type: `String`
Default: `""`

Post-processing: append given string to transformed CSS class and ID.
`Important: append should be valid for CSS class and ID`

### Why need a prefix/append?

This plugin match by RegExp in all file/stream content. This will reduce the likelihood of wrong replacement.

[npm-url]: https://npmjs.org/package/gulp-minify-css-names
[npm-image]: https://img.shields.io/npm/v/gulp-minify-css-names.svg
