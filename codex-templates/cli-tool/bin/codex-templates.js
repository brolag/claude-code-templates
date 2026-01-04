#!/usr/bin/env node

const { program } = require('commander');
const { install, list, search, init } = require('../src/index');

program
  .name('codex-templates')
  .description('Install Codex skills, prompts, configs, and agent profiles')
  .version('1.0.0');

program
  .command('install <type> <name>')
  .alias('i')
  .description('Install a skill, prompt, config, or agent')
  .option('-g, --global', 'Install globally to ~/.codex/')
  .option('-f, --force', 'Overwrite existing files')
  .action((type, name, options) => {
    install(type, name, options);
  });

program
  .command('list [type]')
  .alias('ls')
  .description('List available components')
  .option('-c, --category <category>', 'Filter by category')
  .action((type, options) => {
    list(type, options);
  });

program
  .command('search <query>')
  .alias('s')
  .description('Search for skills and prompts')
  .action((query) => {
    search(query);
  });

program
  .command('init')
  .description('Initialize Codex templates in current project')
  .option('-p, --profile <profile>', 'Use a specific profile (accuracy, fast, terminal)')
  .action((options) => {
    init(options);
  });

// Allow shorthand: codex-templates skill-name (assumes skill install)
program
  .arguments('[name]')
  .action((name) => {
    if (name && !program.args.includes('install') && !program.args.includes('list')) {
      install('skill', name, { global: true });
    }
  });

program.parse();
