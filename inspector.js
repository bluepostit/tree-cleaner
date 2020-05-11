class Inspector {
  constructor (config) {
    this.config = config
  }

  shouldRemove (dirName) {
    return this.config.cleanDirs.indexOf(dirName) >= 0
  }
}

module.exports = Inspector
