const fs = require('fs')
const os = require('os')
const path = require('path')

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
  'c/vendor/',
]

// const PATH_ROOT = path.join(os.tmpdir(), 'ftmp-')
const PATH_ROOT = 'test-test'

fs.mkdtemp(PATH_ROOT, (err, directory) => {
  if (err) {
    console.log("Error creating temp directory!")
    console.log(err)
    throw err
  }
  console.log(`Created temp directory: ${directory}`)
  paths.forEach(async (node) => {
    const pathName = path.join(directory, node)
    try {
      console.log(`path: '${pathName}'`)
      if (node.slice(-1) === '/') {
        console.log(`creating dir: ${pathName}`)
        await fs.promises.mkdir(pathName, { recursive: true })
        console.log(`created dir: ${pathName}`)
      } else {
        console.log(`creating file: ${pathName}`)
        await fs.promises.open(pathName, 'w')
        console.log(`created file: ${pathName}`)
      }
    } catch (error) {
      console.log(error)
      console.log(error.stack)
    }
  })
})
