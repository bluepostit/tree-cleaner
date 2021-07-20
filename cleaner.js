const fs = require('fs')

const remove = async (directory) => {
  try {
    await fs.promises.rmdir(directory, { recursive: true })
    return true
  } catch (err) {
    console.log(`Error removing ${directory}!`)
    console.log(err)
    return false
  }
}

const debugNode = (node) => {
  const prefix = (node.isSymbolicLink() ? '>' : '-')
  const suffix = (node.isDirectory() ? '/' : '')
  console.log(`  [${prefix} ${node.name}${suffix}]`)
}

class Worker {
  constructor (params = {
    debug: false,
    verbose: false,
    dryRun: false,
    directories: ['node_modules', 'vendor', 'tmp']
  }) {
    Object.assign(this, params)

    if (this.debug) {
      console.log(params)
    }
  }

  shouldRemove (node) {
    if (!node.isDirectory()) {
      return false
    }
    return this.directories.indexOf(node.name) >= 0
  }

  shouldRecurse (node, depth) {
    return node.isDirectory() && depth > 1
  }

  async processDirectory (directory, depth) {
    let removedCount = 0
    let node = await directory.read()
    while (node) {
      removedCount += await this.processNode(directory, node, depth)
      node = await directory.read()
    }
    return removedCount
  }

  async processNode (directory, node, depth) {
    const verbose = this.verbose
    verbose && debugNode(node)
    const path = `${directory.path}/${node.name}`
    let removedCount = 0

    if (this.shouldRemove(node)) {
      verbose && console.log('Matches remove pattern')
      if (!this.dryRun) {
        if (await remove(path)) {
          removedCount++
          verbose && console.log(`Removed ${path}`)
        }
      }
    } else if (this.shouldRecurse(node, depth)) {
      verbose && console.log('...recursing...')
      removedCount += await this.clean(path, depth - 1)
    }
    return removedCount
  }

  async clean (path, depth) {
    if (this.dryRun) {
      console.log('### DRY RUN ONLY ###')
    }

    this.debug && console.log(`Entering ${path}`)
    this.verbose && console.log(`(depth: ${depth})`)

    try {
      const directory = await fs.promises.opendir(path)
      return await this.processDirectory(directory, depth)
    } catch (error) {
      console.log(`Error! Couldn't open ${path}`)
      console.log(error)
      return 0
    }
  }
}

class Cleaner {
  constructor (params = {
    debug: false,
    verbose: false,
    dryRun: false,
    directories: ['node_modules', 'vendor', 'tmp']
  }) {
    this.worker = new Worker(params)
  }

  clean (path, depth) {
    return this.worker.clean(path, depth)
  }
}

module.exports = Cleaner
