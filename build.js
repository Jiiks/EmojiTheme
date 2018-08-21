const gulp = require('gulp');
const pump = require('pump');
const sass = require('gulp-sass');
const rename = require('gulp-rename');
const { prepend } = require('gulp-inject-string');

const { readdirSync, lstatSync } = require('fs');
const { join } = require('path');

const { name, description, authors, version, source } = require('./EmojiTheme/config').info;

const meta = {
    name,
    description,
    author: authors.map(author => author.name).join(', '),
    version: version.toString(),
    source
};

const gulpTask = function (src, dest, filename, meta) {
    return pump([
        gulp.src('./EmojiTheme/main.scss'),
        prepend(`@import './defaults'; @import './${src}/main';`),
        sass().on('error', sass.logError),
        prepend(meta),
        rename(filename),
        gulp.dest(dest)
    ]);
};

const isDirectory = source => lstatSync(join(__dirname, 'EmojiTheme', source)).isDirectory();
readdirSync('./EmojiTheme').filter(isDirectory).forEach(dir => {
    const filename = meta.name = `EmojiTheme_${dir}`;
    meta.description = `Bringing the emojis from '${dir}' set to Discord.`;
    gulpTask(dir, './bdv1', `${filename}.theme.css`, `/*//META${JSON.stringify(meta)}*//**/\r\n`);
});
