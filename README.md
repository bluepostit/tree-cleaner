# Tree Cleaner

Recursively deletes directories of dependency libraries inside code projects you are not currently working on.

This frees up space on your drive and saves you the tedious task of finding and deleting these directories manually.

Please note that if you want to run the cleaned projects later on, you will first need to re-install their dependency libraries the usual way. For example, for a Node project you would run `npm install` or `yarn install` as appropriate to the particular project's setup.

## Install
Clone the project, then run `npm install`.

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
