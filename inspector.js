class Inspector {
  constructor (config) {
    this.config = config
  }

  shouldRemove (node) {
    if (!node.isDirectory()) {
      return false
    }

    return this.config.cleanDirs.indexOf(node.name) >= 0
  }
}

module.exports = Inspector
