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
  constructor ({
    debug,
    verbose,
    dryRun,
    includes,
    excludes
  }) {
    const params = {
      debug: debug || false,
      verbose: verbose || false,
      dryRun: dryRun || false,
      includes: includes || [],
      excludes: excludes || []
    }
    Object.assign(this, params)

    if (this.debug) {
      console.log(params)
    }
    if (this.dryRun) {
      console.log('### DRY RUN ONLY ###')
    }
  }

  shouldRemove (node) {
    if (!node.isDirectory()) {
      return false
    }
    return this.includes.indexOf(node.name) >= 0
  }

  shouldRecurse (node, depth) {
    return node.isDirectory() && depth > 1
  }

  shouldExclude (node) {
    return this.excludes.indexOf(node.name) >= 0
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

    if (this.shouldExclude(node)) {
      verbose && console.log(`${path} matches exclude pattern.`)
    } else if (this.shouldRemove(node)) {
      verbose && console.log(`${path} matches remove pattern`)
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
  constructor ({
    debug,
    verbose,
    dryRun,
    includes,
    excludes
  }) {
    this.worker = new Worker({
      debug,
      verbose,
      dryRun,
      includes,
      excludes
    })
  }

  clean (path, depth) {
    return this.worker.clean(path, depth)
  }
}

module.exports = Cleaner
