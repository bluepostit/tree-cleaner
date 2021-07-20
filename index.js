const minimist = require('minimist')
const Cleaner = require('./cleaner')
const defaultConfig = require('./config.json')

const getRunArgs = () => minimist(process.argv.slice(2), { boolean: true })

const getPath = (args) => args._[0] || '.'
const getDepth = (args) => args.d || 2

const getArgArray = (args, name) => {
  let array = args[name]
  if (array) {
    array = array.split(/\s+/)
  } else {
    array = defaultConfig[name]
  }
  return array
}

const buildCleaner = (args) => {
  const debug = args.debug || false
  const verbose = debug && (args.verbose || false)
  const dryRun = args['dry-run'] || false
  const includes = getArgArray(args, 'include-names')
  const excludes = getArgArray(args, 'exclude-names')
  const params = {
    debug,
    verbose,
    dryRun,
    includes,
    excludes
  }
  return new Cleaner(params)
}

const main = async () => {
  const args = getRunArgs()
  const path = getPath(args)
  const depth = getDepth(args)

  const cleaner = buildCleaner(args)
  const removed = await cleaner.clean(path, depth)
  console.log(`Removed ${removed} directories`)
}

main()
