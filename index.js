#!/usr/bin/env node

const { execSync } = require('node:child_process')
const fs = require('node:fs')
const path = require('node:path')
const process = require('node:process')

function executeCommand(command) {
  execSync(command, { stdio: 'inherit' })
}

function main() {
  // Step 1: Install packages
  executeCommand('npx @antfu/ni -D eslint @antfu/eslint-config@latest')

  // Step 2: Check for type: 'module' in package.json and create eslint.config.js
  const packageJsonPath = path.join(process.cwd(), 'package.json')
  const packageJson = require(packageJsonPath)

  let eslintConfigContent = ''
  if (packageJson.type === 'module') {
    eslintConfigContent = `import antfu from '@antfu/eslint-config'

export default antfu();`
  }
  else {
    eslintConfigContent = `const antfu = require('@antfu/eslint-config').default

module.exports = antfu();`
  }
  fs.writeFileSync(path.join(process.cwd(), 'eslint.config.js'), eslintConfigContent)

  // Step 3: Add lint scripts to package.json if they don't exist
  if (!packageJson.scripts)
    packageJson.scripts = {}

  if (!packageJson.scripts.lint)
    packageJson.scripts.lint = 'eslint .'

  if (!packageJson.scripts['lint:fix'])
    packageJson.scripts['lint:fix'] = 'eslint . --fix'

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))

  // Step 4: Echo instructions
  /* eslint-disable no-console */
  console.log('🚀 Setup completed!')
  console.log('📌 Consider installing the ESLint VS Code extension and configuring it as described here: https://github.com/antfu/eslint-config?tab=readme-ov-file#vs-code-support-auto-fix')
  /* eslint-enable no-console */
}

try {
  main()
}
catch (error) {
  // eslint-disable-next-line no-console
  console.log('\n🚀 Problem detected! Landing back on Earth... 🌍✨')
}
