let fs = require('fs')
let path = require('path')

let sass = require('node-sass')
let cleancss = require('clean-css')


let { info: config } = require('./EmojiTheme/config.json')

let meta = {
  name: config.name,
  description: config.description,
  author: config.authors.map(author => author.name).join(', '),
  version: config.version.toString(),
  source: config.source
}


let isDirectory = source => fs.lstatSync(path.join(__dirname, 'EmojiTheme', source)).isDirectory()

fs.readdirSync('./EmojiTheme').filter(isDirectory).forEach(dir => {
  console.log(`Building ${dir}`)

  meta.name = `EmojiTheme_${dir}`
  meta.description = `Bringing the emojis from '${dir}' set to Discord.`

  let builtmeta = `/*//META${JSON.stringify(meta)}*//**/\r\n`

  let data = sass.renderSync({
    data: `$currentEmoji: ${dir}; @import "EmojiTheme/main";`,
    includePaths: ['./EmojiTheme']
  })

  fs.writeFileSync(`./bdv1/${meta.name}.theme.css`, builtmeta + data.css)
})