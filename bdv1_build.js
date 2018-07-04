const fs = require('fs')
const path = require('path')
const sass = require('sass')
const cleancss = require('clean-css')

// Read configuration from BDv2's config.json
const { info: config } = require('./EmojiTheme/config.json')

const meta = {
  name: config.name,
  description: config.description,
  author: config.authors.map(author => author.name).join(', '),
  version: config.version.toString(),
  source: config.source
}

// Go through all the emoji themes
const isDirectory = source => fs.lstatSync(path.resolve(__dirname, 'EmojiTheme', source)).isDirectory()
fs.readdirSync('./EmojiTheme').filter(isDirectory).forEach(dir => {
  meta.name = `EmojiTheme_${dir}`
  meta.description = `Bringing the emojis from '${dir}' set to Discord.`
  const builtmeta = `/*//META${JSON.stringify(meta)}*//**/\r\n`

  const built = sass.renderSync({
    data: `@import "EmojiTheme/defaults"; @import "EmojiTheme/${dir}/main"; $emoji-all: $${dir.toLowerCase()}-all; .emoji, .autocompleteRowVertical-q1K4ky .icon-3ZzoN7 { @each $ori, $rep in $emoji-all { &[src="#{$ori}"] { content: url("#{$rep}"); } } }`,
    includePaths: ['./EmojiTheme']
  })
  const mini = new cleancss({ level: 2 }).minify(built.css)

  fs.writeFileSync(`./bdv1/EmojiTheme_${dir}.theme.css`, builtmeta + built.css)
  fs.writeFileSync(`./bdv1/EmojiTheme_${dir}.min.theme.css`, builtmeta + mini.styles)
})