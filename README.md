# Tree Cleaner

Recursively deletes directories of dependency libraries of code projects you are not working on.

This frees up space on your drive. Please note that you will need to re-install them if you want to run your project later.

## Usage

### Examples

Go through the `~/code` directory, recursing to a depth of three subdirectories. Delete all directories named `tmp` or `node_modules`, but skip the `.git` directory and all its children:

```bash
npm run start -- -d3 --include-names="tmp node_modules" --exclude-names=".git" ~/code
```

Similar to the above, but recurse ten levels down, and display verbose debug output:

```bash
npm run start -- --verbose --debug -d3 --include-names="tmp node_modules" --exclude-names=".git" ~/code
```

Similar to the above, but do a 'dry-run': Only list the directories that would be deleted, but do not actually delete them:

```bash
npm run start -- --verbose --debug --dry-run -d3 --include-names="tmp node_modules" --exclude-names=".git" ~/code
```
