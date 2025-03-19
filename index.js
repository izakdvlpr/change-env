#!/usr/bin/env node

const childProcess = require('node:child_process');
const util = require('node:util');
const colorette = require('colorette');
const inquirer = require('inquirer').default

const colors = colorette.createColors()
const exec = util.promisify(childProcess.exec);

const config = {
  personal: {
    username: 'izakdvlpr',
    email: 'izakdvlpr@gmail.com',
    gpgKey: '821D082062343E0A',
    sshPath: '~/.ssh/personal',
  },
  work: {
    username: 'r1isaque',
    email: 'isaque@r1engenharia.com',
    gpgKey: '7BA4947D6ED2E9D7',
    sshPath: '~/.ssh/work',
  }
}

cli()

async function cli() {
  const availableFlags = ['--user', '--ssh', '--gpg']

  const flags = process.argv.slice(2).reduce((acc, flag) => {
    if (availableFlags.includes(flag)) {
      acc[flag.replace('--', '')] = true
    }
    
    return acc
  }, {})

  if (process.argv.length < 3) {
    console.log(
      colors.yellow(`
        Usage: change-env [options]

        CLI para mudar o tipo de ambiente

        Options:
          --user     Muda o usuário do Git (nome e email)
          --ssh      Muda a chave SSH usada para autenticação
          --gpg      Muda a chave GPG usada para assinar commits
      `)
    )
  }

  const type = await getType()
  
  if (flags.user) {
    changeUser(type)
  }
  
  if (flags.gpg) {
    changeGPG(type)
  }
  
  if (flags.ssh) {
    changeSSH(type)
  }
}

async function changeUser(type) {
  await exec(`git config --global user.name ${config[type].username}`)
  await exec(`git config --global user.email ${config[type].email}`)
  
  console.log(colors.green(`Usuário alterado para "${config[type].username}".`))
  console.log(colors.green(`Email alterado para "${config[type].email}".`))
}

async function changeSSH(type) {
  await exec(`eval "$(ssh-agent -s)" && ssh-add ${config[type].sshPath}`)
  
  console.log(colors.green(`eval "$(ssh-agent -s)" && ssh-add ${config[type].sshPath}`))
  console.log(colors.green(`Chave SSH adicionada ao agente.`))
  console.log(colors.green(`Chave SSH mudada para "${config[type].sshPath}".`))
}

async function changeGPG(type) {
  await exec(`git config --global user.signingkey ${config[type].gpgKey}`)
  
  console.log(colors.green(`Chave GPG mudada para "${config[type].gpgKey}".`))
}

async function getType(defaultValue) {
  const { type } = await inquirer.prompt([
    {
      type: 'list',
      name: 'type',
      message: 'Escolha um tipo de ambiente:',
      choices: [
        { name: 'Pessoal', value: 'personal' },
        { name: 'Trabalho', value: 'work' },
      ],
      default: defaultValue
    }
  ])
  
  return type
}
