const fs = require('fs')
const minimist = require('minimist')
const config = require('./config.json')

let DEBUG = false
let DRY_RUN = false
let VERBOSE = false

const debugDirEntry = (dirEntry) => {
  let linkPrefix = '-'
  let dirSuffix = ''
  if (dirEntry.isDirectory()) {
    dirSuffix = '/'
  } else if (dirEntry.isSymbolicLink()) {
    linkPrefix = '>'
  }
  console.log(`  [${linkPrefix} ${dirEntry.name}${dirSuffix}]`)
}

const shouldClean = (dirEntry) => {
  const name = dirEntry.name;
  return config.cleanDirs.indexOf(name) >= 0
}

const rmdir = (dir) => {
  fs.rmdir(dir, {
    recursive: true
  }, (err) => {
    if (err) {
      console.log(`Error removing ${dir}!`)
      console.log(err)
    }
    DEBUG && console.log(`Removed ${dir}`)
  })
}

const getOptionsForRecurse = (options) => {
  const newOptions = {}
  Object.assign(newOptions, options)
  newOptions.depth = options.depth - 1
  return newOptions
}

const cleanup = async (path, options) => {
  DEBUG && console.log(`Checking ${path}/...`)
  await fs.opendir(path, async (err, dir) => {
    console.log(dir.path)
    if (err) {
      console.log(`Error! Couldn't open directory: ${dir}`)
      return
    }
    for await (const node of dir) {
      DEBUG && VERBOSE && debugDirEntry(node)
      const path = `${dir.path}/${node.name}`
      if (shouldClean(node)) {
        if (DRY_RUN) {
          DEBUG && console.log(`=> To remove: ${path}`)
        } else {
          rmdir(path)
        }
      } else if (node.isDirectory() && options.depth > 1) {
        const recurseOptions = getOptionsForRecurse(options)
        cleanup(path, recurseOptions)
      }
    }
  })
}

const main = async () => {
  const argv = minimist(process.argv.slice(2), {boolean: true})
  const dir = argv['_'][0] || '.'
  const depth = argv['d'] || 2
  DEBUG = argv['debug'] || false
  VERBOSE = argv['verbose'] || false
  DRY_RUN = argv['dry-run'] || false

  if (DRY_RUN) {
    console.log(' ### DRY RUN ONLY ###')
  }

  cleanup(dir, {
    depth
  })
}

main()
