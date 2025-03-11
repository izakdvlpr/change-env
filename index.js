const childProcess = require('node:child_process');
const util = require('node:util');

const colorette = require('colorette');
const commander = require('commander');
const inquirer = require('inquirer').default

const colors = colorette.createColors()

const exec = util.promisify(childProcess.exec);

const program = new commander.Command()

const config = {
  personal: {
    username: 'izakdvlpr',
    email: 'izakdvlpr@gmail.com',
    gpgKey: '821D082062343E0A',
    sshPath: '~/.ssh/personal',
  },
  work: {
    username: 'r1isaque',
    email: 'isaque@r1engenhria.com',
    gpgKey: '7BA4947D6ED2E9D7',
    sshPath: '~/.ssh/work',
  }
}

program
  .version('1.0.0')
  .description('CLI para mudar o tipo de ambiente')
  .action(async () => {
    const { type } = await inquirer.prompt([
      {
        type: 'list',
        name: 'type',
        message: 'Escolha um tipo de ambiente:',
        choices: [
          { name: 'Pessoal', value: 'personal' },
          { name: 'Trabalho', value: 'work' },
        ],
      }
    ])
    
    await exec(`git config --global user.name ${config[type].username}`)
    await exec(`git config --global user.email ${config[type].email}`)
    await exec(`git config --global user.signingkey ${config[type].gpgKey}`)
    
    await exec(`eval "$(ssh-agent -s)" && ssh-add ${config[type].sshPath}`)
    
    console.log(colors.green(`Usuário alterado para "${config[type].username}".`))
    console.log(colors.green(`Email alterado para "${config[type].email}".`))
    console.log(colors.green(`Chave GPG alterada para "${config[type].gpgKey}".`))
    console.log(colors.green(`Chave SSH adicionada em "${config[type].sshPath}".`))
    console.log(colors.green(`Ambiente alterado para "${type}".`))
  })

program.parse(process.argv)