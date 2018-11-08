const fs = require('fs');
const util = require('util');
const postcss = require('postcss');

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const glob = util.promisify(require('glob'));
const bemCss = postcss([require('postcss-css-to-bem-css')({
        sourceNaming: 'origin',
        targetNaming: 'react'
    })]);



glob('src/css/*.css').then(files =>
    files.map(file =>
        readFile(file).then(originalCss =>
            bemCss.process(originalCss, { from: file })
                .then(css => {
                  console.log(css)
                  writeFile(file, css)
                })
        )
    ));
