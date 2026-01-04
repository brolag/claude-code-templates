const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');
const ora = require('ora');
const os = require('os');

// Codex home directory
const CODEX_HOME = process.env.CODEX_HOME || path.join(os.homedir(), '.codex');

// Component catalog URL
const CATALOG_URL = 'https://codex-templates.dev/components.json';

/**
 * Install a component (skill, prompt, config, or agent)
 */
async function install(type, name, options = {}) {
  const spinner = ora(`Installing ${type}: ${name}`).start();

  try {
    const targetDir = getTargetDir(type, name, options.global);

    // Ensure directory exists
    await fs.ensureDir(path.dirname(targetDir));

    // Check if already exists
    if (await fs.pathExists(targetDir) && !options.force) {
      spinner.warn(`${type} "${name}" already exists. Use --force to overwrite.`);
      return;
    }

    // Find and copy component
    const sourcePath = await findComponent(type, name);
    if (!sourcePath) {
      spinner.fail(`${type} "${name}" not found`);
      return;
    }

    await fs.copy(sourcePath, targetDir);

    spinner.succeed(`Installed ${type}: ${name}`);
    console.log(chalk.gray(`  Location: ${targetDir}`));

    // Show usage instructions
    showUsage(type, name);

  } catch (error) {
    spinner.fail(`Failed to install ${type}: ${error.message}`);
  }
}

/**
 * Get target directory for installation
 */
function getTargetDir(type, name, global = true) {
  const baseDir = global ? CODEX_HOME : path.join(process.cwd(), '.codex');

  switch (type) {
    case 'skill':
      return path.join(baseDir, 'skills', name);
    case 'prompt':
      return path.join(baseDir, 'prompts', `${name}.md`);
    case 'config':
      return path.join(baseDir, 'configs', `${name}.toml`);
    case 'agent':
      return path.join(process.cwd(), 'AGENTS.md');
    default:
      return path.join(baseDir, type, name);
  }
}

/**
 * Find component in the templates directory
 */
async function findComponent(type, name) {
  // First check local templates
  const localPaths = [
    path.join(__dirname, '..', '..', 'skills', '**', name, 'SKILL.md'),
    path.join(__dirname, '..', '..', 'prompts', '**', `${name}.md`),
    path.join(__dirname, '..', '..', 'configs', `${name}.toml`),
    path.join(__dirname, '..', '..', 'agents', '**', name, 'AGENTS.md'),
  ];

  // Use glob to find the component
  const glob = require('path');

  // Simple search in known directories
  const searchDirs = {
    skill: path.join(__dirname, '..', '..', 'skills'),
    prompt: path.join(__dirname, '..', '..', 'prompts'),
    config: path.join(__dirname, '..', '..', 'configs'),
    agent: path.join(__dirname, '..', '..', 'agents'),
  };

  const searchDir = searchDirs[type];
  if (!searchDir || !await fs.pathExists(searchDir)) {
    return null;
  }

  // Recursively search for the component
  const found = await findInDir(searchDir, name, type);
  return found;
}

/**
 * Recursively find component in directory
 */
async function findInDir(dir, name, type) {
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (entry.name === name) {
        // Found the component directory
        const skillFile = path.join(fullPath, 'SKILL.md');
        const agentFile = path.join(fullPath, 'AGENTS.md');

        if (type === 'skill' && await fs.pathExists(skillFile)) {
          return fullPath;
        }
        if (type === 'agent' && await fs.pathExists(agentFile)) {
          return fullPath;
        }
      }
      // Continue searching subdirectories
      const found = await findInDir(fullPath, name, type);
      if (found) return found;
    } else if (entry.isFile()) {
      if (type === 'prompt' && entry.name === `${name}.md`) {
        return fullPath;
      }
      if (type === 'config' && entry.name === `${name}.toml`) {
        return fullPath;
      }
    }
  }

  return null;
}

/**
 * List available components
 */
async function list(type = 'all', options = {}) {
  console.log(chalk.bold('\n Codex Templates\n'));

  const types = type === 'all' ? ['skill', 'prompt', 'config', 'agent'] : [type];

  for (const t of types) {
    const searchDir = path.join(__dirname, '..', '..', `${t}s`);

    if (!await fs.pathExists(searchDir)) {
      continue;
    }

    console.log(chalk.cyan(`\n${t.toUpperCase()}S:`));

    const components = await listComponents(searchDir, t);

    if (options.category) {
      components.filter(c => c.category === options.category);
    }

    for (const comp of components.slice(0, 20)) {
      console.log(chalk.gray(`  $${comp.name}`), '-', comp.description || '');
    }

    if (components.length > 20) {
      console.log(chalk.gray(`  ... and ${components.length - 20} more`));
    }
  }
}

/**
 * List components in a directory
 */
async function listComponents(dir, type) {
  const components = [];

  async function scan(currentDir) {
    const entries = await fs.readdir(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);

      if (entry.isDirectory()) {
        const skillFile = path.join(fullPath, 'SKILL.md');
        const agentFile = path.join(fullPath, 'AGENTS.md');

        if (await fs.pathExists(skillFile) || await fs.pathExists(agentFile)) {
          const content = await fs.readFile(
            await fs.pathExists(skillFile) ? skillFile : agentFile,
            'utf-8'
          );
          const description = extractDescription(content);
          components.push({
            name: entry.name,
            category: path.basename(currentDir),
            description,
          });
        } else {
          await scan(fullPath);
        }
      }
    }
  }

  await scan(dir);
  return components;
}

/**
 * Extract description from SKILL.md or AGENTS.md
 */
function extractDescription(content) {
  const match = content.match(/description:\s*(.+)/);
  return match ? match[1].trim() : '';
}

/**
 * Search for components
 */
async function search(query) {
  console.log(chalk.bold(`\nSearching for: ${query}\n`));

  const types = ['skill', 'prompt', 'config', 'agent'];
  let found = 0;

  for (const type of types) {
    const searchDir = path.join(__dirname, '..', '..', `${type}s`);

    if (!await fs.pathExists(searchDir)) continue;

    const components = await listComponents(searchDir, type);
    const matches = components.filter(c =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      (c.description && c.description.toLowerCase().includes(query.toLowerCase()))
    );

    for (const match of matches) {
      console.log(chalk.green(`[${type}]`), chalk.bold(`$${match.name}`));
      console.log(chalk.gray(`  ${match.description}`));
      console.log(chalk.gray(`  Install: codex-templates install ${type} ${match.name}`));
      console.log('');
      found++;
    }
  }

  if (found === 0) {
    console.log(chalk.yellow('No components found matching your query.'));
  } else {
    console.log(chalk.gray(`Found ${found} component(s)`));
  }
}

/**
 * Initialize Codex templates in current project
 */
async function init(options = {}) {
  const spinner = ora('Initializing Codex templates').start();

  try {
    const projectDir = process.cwd();
    const codexDir = path.join(projectDir, '.codex');

    // Create .codex directory
    await fs.ensureDir(codexDir);
    await fs.ensureDir(path.join(codexDir, 'skills'));

    // Create AGENTS.md if it doesn't exist
    const agentsPath = path.join(projectDir, 'AGENTS.md');
    if (!await fs.pathExists(agentsPath)) {
      const template = await getAgentsTemplate(options.profile);
      await fs.writeFile(agentsPath, template);
    }

    // Copy config if profile specified
    if (options.profile) {
      const configSource = path.join(__dirname, '..', '..', 'configs', `${options.profile}.toml`);
      if (await fs.pathExists(configSource)) {
        const configDest = path.join(CODEX_HOME, 'config.toml');
        await fs.copy(configSource, configDest);
        spinner.succeed('Initialized with profile: ' + options.profile);
      }
    } else {
      spinner.succeed('Initialized Codex templates');
    }

    console.log(chalk.gray('\nCreated:'));
    console.log(chalk.gray('  AGENTS.md - Project instructions for Codex'));
    console.log(chalk.gray('  .codex/skills/ - Local skills directory'));
    console.log(chalk.gray('\nNext steps:'));
    console.log(chalk.cyan('  codex-templates install skill code-reviewer'));
    console.log(chalk.cyan('  codex "$code-reviewer"'));

  } catch (error) {
    spinner.fail(`Failed to initialize: ${error.message}`);
  }
}

/**
 * Get AGENTS.md template
 */
async function getAgentsTemplate(profile) {
  const projectName = path.basename(process.cwd());

  return `# ${projectName}

Project instructions for Codex.

## Overview

[Describe your project here]

## Development

### Commands
- Build: \`npm run build\`
- Test: \`npm test\`
- Lint: \`npm run lint\`

### Available Skills

Use these skills with \`$skill-name\`:

- \`$code-reviewer\` - Review code for quality and security
- \`$test-driven-development\` - TDD workflow automation
- \`$memory-persist\` - Remember facts across sessions
- \`$worktree-manager\` - Parallel development with git worktrees

## Best Practices

- Write tests before implementation
- Keep commits atomic and well-described
- Use conventional commit format

---

*Initialized with Codex Templates*
`;
}

/**
 * Show usage instructions after installation
 */
function showUsage(type, name) {
  console.log(chalk.gray('\nUsage:'));

  switch (type) {
    case 'skill':
      console.log(chalk.cyan(`  codex "$${name}"`));
      console.log(chalk.gray('  Or let Codex auto-select based on your prompt'));
      break;
    case 'prompt':
      console.log(chalk.cyan(`  codex /prompts: -> ${name}`));
      break;
    case 'config':
      console.log(chalk.cyan(`  codex --profile ${name}`));
      break;
    case 'agent':
      console.log(chalk.gray('  AGENTS.md copied to project root'));
      console.log(chalk.cyan('  codex "your prompt here"'));
      break;
  }
}

module.exports = {
  install,
  list,
  search,
  init,
};
