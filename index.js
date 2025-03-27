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

main()

async function main() {
  const type = await getType()
  
  await unsetUser()
  await unsetGPG()
  
  await changeUser(type)
  await changeGPG(type)
  await changeSSH(type)
}

async function unsetUser() {
  const unsetUserNameCommand = 'git config --global --unset user.name'
  const unsetUserEmailCommand = 'git config --global --unset user.email'
  
  await exec(unsetUserNameCommand).catch(() => {})
  await exec(unsetUserEmailCommand).catch(() => {})
  
  console.log(colors.gray(unsetUserNameCommand))
  console.log(colors.gray(unsetUserEmailCommand))
  console.log(colors.green(`Usuário removido.`))
  console.log(colors.green(`Email removido.`))
}

async function changeUser(type) {
  const changeUserNameCommand = `git config --global user.name ${config[type].username}`
  const changeUserEmailCommand = `git config --global user.email ${config[type].email}`
  
  await exec(changeUserNameCommand).catch(() => {})
  await exec(changeUserEmailCommand).catch(() => {})
  
  console.log(colors.gray(changeUserNameCommand))
  console.log(colors.gray(changeUserEmailCommand))
  console.log(colors.green(`Usuário alterado para "${config[type].username}".`))
  console.log(colors.green(`Email alterado para "${config[type].email}".`))
}

async function unsetGPG() {
  const unsetGPGCommand = 'git config --global --unset user.signingkey'
  
  await exec(unsetGPGCommand).catch(() => {})
  
  console.log(colors.gray(unsetGPGCommand))
  console.log(colors.green(`Chave GPG removida.`))
}

async function changeGPG(type) {
  const changeGPGCommand = `git config --global user.signingkey ${config[type].gpgKey}`
  
  await exec(changeGPGCommand).catch(() => {})
  
  console.log(colors.gray(changeGPGCommand))
  console.log(colors.green(`Chave GPG mudada para "${config[type].gpgKey}".`))
}

async function changeSSH(type) {
  const changeSSHCommand = `eval "$(ssh-agent -s)" && ssh-add ${config[type].sshPath}`
  
  await exec(changeSSHCommand).catch(() => {})
  
  console.log(colors.gray(changeSSHCommand))
  console.log(colors.green(`Chave SSH adicionada ao agente.`))
  console.log(colors.green(`Chave SSH mudada para "${config[type].sshPath}".`))
}

async function getType() {
  const { type } = await inquirer.prompt([
    {
      type: 'list',
      name: 'type',
      message: 'Escolha um tipo de ambiente:',
      choices: [
        { name: 'Pessoal', value: 'personal' },
        { name: 'Trabalho', value: 'work' },
      ]
    }
  ])
  
  return type
}
