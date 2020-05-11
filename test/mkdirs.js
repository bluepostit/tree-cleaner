const fs = require('fs')
const path = require('path')
const minimist = require('minimist')

let DEBUG = false

const paths = [
  'a/',
  'a/file-in-a',
  'a/subdir/',
  'a/subdir/file-in-subdir',
  'a/node_modules/',
  'a/Node_modules/',
  'b/',
  'b/subdir/',
  'b/subdir/vendor/',
  'b/subdir/vendor/node_modules/',
  'b/subdir/vendor/node_modules/file',
  // 'c/vendor/batman',
  'c/vendor/'
]

const TEST_DIR_PATH = 'test-jkl980'

function setRunParams () {
  const argv = minimist(process.argv.slice(2), { boolean: true })
  DEBUG = argv.debug || false
  console.log(`DEBUG: ${DEBUG}`)
}

const makeDirectories = async () => {
  console.log(`DEBUG: ${DEBUG}`)

  try {
    fs.promises.mkdir(TEST_DIR_PATH)
  } catch (error) {
    console.log('Error creating temp directory!')
    console.log(error)
    throw error
  }
  console.log(`Created temp directory: ${TEST_DIR_PATH}`)

  for (const node of paths) {
    const pathName = path.join(TEST_DIR_PATH, node)
    try {
      DEBUG && console.log(`path: '${pathName}'`)
      if (node.slice(-1) === '/') {
        DEBUG && console.log(`creating dir: ${pathName}`)
        await fs.promises.mkdir(pathName, { recursive: true })
        DEBUG && console.log(`created dir: ${pathName}`)
      } else {
        // DEBUG && console.log(`creating file: ${pathName}`)
        await fs.promises.open(pathName, 'w')
        // DEBUG && console.log(`created file: ${pathName}`)
      }
    } catch (error) {
      console.log(error)
      console.log(error.stack)
    }
  }
}

function main () {
  setRunParams()
  makeDirectories()
}

main()
