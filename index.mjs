import inquirer from 'inquirer';
import chalk from 'chalk';
import fs from 'fs';


console.log('iniciamos o projeto');

operation()


function operation() {

    inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'o que desejas fazer?',
            choices: ['Criar conta', 'Consultar saldo', 'Depositar', 'Levantar', 'sair']
        },
    ]).then((answer) => {

        const action = answer['action'];

        if (action === 'Criar conta') {
            createAccount();
        } else if (action === 'Consultar saldo') {
            getAccountbalance();
        } else if (action === 'Depositar') {
            deposit();
        } else if (action === 'Levantar') {
            withDraw();
        } else {

            console.log(chalk.bgBlue.black('Obrigado por usar o Accounts!'));
            process.exit();

        }

    }).catch(error => console.log(error));
}

function createAccount() {
    console.log(chalk.bgGreen.black('Parabéns por escolher o nosso banco!'));
    console.log(chalk.green('defina as opções da conta a seguir'));

    buildAccount();
}

function buildAccount() {

    inquirer.prompt([{
        name: 'accountName',
        message: 'digite um nome para a conta: ',
    }]).then((anwser) => {

        const accountName = anwser['accountName'];

        console.log(accountName);

        if (!fs.existsSync('accounts')) {
            fs.mkdirSync('accounts');
        }

        if (fs.existsSync(`accounts/${accountName}.json`)) {
            console.log(chalk.bgRed.black('Esta conta já existe'));

            buildAccount();

            return;
        }

        fs.writeFileSync(`accounts/${accountName}.json`, '{"balance": 0}', function (err) {
            console.log(err);
        });

        console.log(chalk.green('Parabens, a conta foi criada!'));

        operation();

    }).catch((error) => console.log(error));
}


function deposit() {

    inquirer.prompt([{
        name: 'accountName',
        message: 'qual o nome da tua conta?'
    }]).then((anwser) => {

        const accountName = anwser['accountName'];

        if (!checkAccount(accountName)) {
            return deposit();
        }

        inquirer.prompt([{
            name: 'amount',
            message: 'quanto desejas depositar?',
        }]).then((anwser) => {

            const amount = anwser['amount'];

            addAmount(accountName, amount);

            operation();

        }).catch((err) => console.log(err));

    }).catch((err) => console.log(err));

}


function checkAccount(accountName) {
    if (!fs.existsSync(`accounts/${accountName}.json`)) {
        console.log(chalk.bgRed.black('essa conta não existe'));
        return false;
    }
    return true;
}

function addAmount(accountName, amount) {

    const accountData = getAccount(accountName);

    if (!amount) {
        console.log('ocorreu um erro, tente novamente mais tarde!');
        return deposit();
    }

    accountData['balance'] += parseFloat(amount);

    fs.writeFileSync(`accounts/${accountName}.json`, JSON.stringify(accountData), function (err) {
        console.log(err);
    })

    console.log(chalk.green(`foi depositado o valor de ${amount}€`));
}


function getAccount(accountName) {

    const accountJson = fs.readFileSync(`accounts/${accountName}.json`, {
        encoding: 'utf-8',
        flag: 'r',
    });

    return JSON.parse(accountJson);
}

function getAccountbalance() {
    inquirer.prompt([{
        name: 'accountName',
        message: 'qual o nome da conta?'
    }]).then((anwser) => {

        const accountName = anwser['accountName'];

        if (!checkAccount(accountName)) {
            return getAccountbalance();
        }

        const accountData = getAccount(accountName);

        console.log(chalk.bgBlue.black(`olá, o saldo da sua conta é de ${accountData.balance}`));

        operation();

    }).catch((err) => console.log(err));
}

function withDraw(accountData) {

    inquirer.prompt([{
        name: 'accountName',
        message: 'qual o nome da conta?'
    }]).then((anwser) => {

        const accountName = anwser['accountName'];

        if (!checkAccount(accountName)) {
            return withDraw();
        }

        inquirer.prompt([{
            name: 'amount',
            message: 'quanto deseja levantar?',
        }]).then((answer) => {

            const amount = answer['amount'];

            removeAmount(accountName, amount);
        }).catch((err) => console.log(err));


    }).catch((err) => console.log(err));
}

function removeAmount(accountData, amount) {

    const accountData = getAccount(accountData);

    if (!amount) {
        console.log(chalk.bgRed.black('ocorreu um erro, tente mais tarde'));

        return withDraw();
    }

    if (accountData.balance < amount) {
        console.log(chalk.bgRed.black('valor indisponivel'));
        return withDraw();
    }

    accountData.balance -= parseFloat(amount);

    fs.writeFileSync(`accounts/${accountName}.json`, JSON.stringify(accountData), (err) => {
        console.log(err);
    })

    console.log(chalk.bgGreen.black(`foi realizado o saque de ${amount}€ na conta ${accountName}`));

    operation();
}