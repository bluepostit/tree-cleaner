const minimist = require('minimist')
const Cleaner = require('./cleaner')
const defaultConfig = require('./config.json')

const getRunArgs = () => minimist(process.argv.slice(2), { boolean: true })

const getPath = (args) => args._[0] || '.'
const getDepth = (args) => args.d || 2

const buildCleaner = (args) => {
  const debug = args.debug || false
  const params = {
    debug,
    verbose: debug && (args.verbose || false),
    dryRun: args['dry-run'] || false,
    directories: args['remove-names'] || defaultConfig.removeNames
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
