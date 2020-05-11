const fs = require('fs')
const minimist = require('minimist')
const config = require('./config.json')
const Inspector = require('./inspector')

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

const removeDirectory = async (dir) => {
  let success = false
  try {
    await fs.promises.rmdir(dir, { recursive: true })
    success = true
  } catch (err) {
    console.log(`Error removing ${dir}!`)
    console.log(err)
  }
  DEBUG && console.log(`Removed ${dir}`)
  return await success
}

const getOptionsForRecurse = (options) => {
  const newOptions = {}
  Object.assign(newOptions, options)
  newOptions.depth = options.depth - 1
  return newOptions
}

const processDirectoryNode = async (directory, node, options) => {
  VERBOSE && debugDirEntry(node)
  const path = `${directory.path}/${node.name}`
  const inspector = options.inspector
  let removed = 0
  if (inspector.shouldRemove(node.name)) {
    VERBOSE && console.log(`To remove: ${path}`)
    if (DRY_RUN) {
      VERBOSE && console.log(`=> Not removing: ${path} [DRY-RUN]`)
    } else {
      if (await removeDirectory(path)) {
        removed++
      }
    }
  } else if (node.isDirectory() && options.depth > 1) {
    removed += await clean(path, getOptionsForRecurse(options))
  }
  return removed
}

const processDirectory = async (directory, options) => {
  let removed = 0
  let node = await directory.read()
  while (node) {
    removed += await processDirectoryNode(directory, node, options)
    node = await directory.read()
  }
  return await removed
}

const clean = async (path, options) => {
  DEBUG && console.log(`Cleaning ${path}/...`)
  let directory

  if (!options.inspector || !options.inspector.shouldRemove) {
    throw new Error('Error! No inspector provided')
  }

  try {
    directory = await fs.promises.opendir(path)
  } catch (error) {
    console.log(`Error! Couldn't open directory: ${directory}`)
    console.log(error)
    return
  }

  return await processDirectory(directory, options)
}

const setRunParams = (argv) => {
  DEBUG = argv.debug || false
  VERBOSE = DEBUG && (argv.verbose || false)
  DRY_RUN = argv['dry-run'] || false
}

const getDir = (argv) => argv._[0] || '.'
const getDepth = (argv) => argv.d || 2

const main = async () => {
  const argv = minimist(process.argv.slice(2), { boolean: true })
  setRunParams(argv)
  const dir = getDir(argv)
  const depth = getDepth(argv)

  if (DRY_RUN) {
    console.log(' ### DRY RUN ONLY ###')
  }
  const inspector = new Inspector(config)
  const removed = await clean(dir, { depth, inspector })
  console.log(`Removed ${removed} directories`)
}

main()
