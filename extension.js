const vscode = require('vscode');
const fetch = require('node-fetch');

const settings = {
    bar: {},
    config: {},
    url: 'https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=',
    icons: {
        low: '🌤',
        normal: '🌧',
        high: '🌩',
        loading: '🧑‍🚀',
        error: '🧟'
    },
    messages: {
        loading: 'Updating gas prices...',
        error: 'Connection error',
        missed: '(Missed API key)'
    }
};

exports.activate = context => {
    settings.config = vscode.workspace.getConfiguration('ethereum-gas-price');
    settings.bar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 1);
    vscode.commands.registerCommand('ethereum-gas-price.update', update);
    settings.bar.command = 'ethereum-gas-price.update';
    context.subscriptions.push(settings.bar);
    context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(() => {
        settings.config = vscode.workspace.getConfiguration('ethereum-gas-price');
        update();
    }));
    settings.bar.show();
    update();
    setInterval(update, 60000 * settings.config.refreshInterval);
};

exports.deactivate = () => {};

const update = async () => {
    renderBar(settings.messages.loading, settings.icons.loading);
    try {
        const response = await fetch(`${settings.url}${settings.config.key}`);
        const data = await response.json();
        if (data.status != 1) throw 'API error';
        renderResult(data);
    } catch(e) {
        renderBar(settings.messages.error, settings.icons.error);
    }
};

const renderBar = (message, icon) => {
    settings.bar.text = `${settings.config.showIcons ? icon + ' ' : ''}${message}`;
};

const renderResult = data => {
    const icon = data.result.SafeGasPrice > 100 ? settings.icons.high : data.result.SafeGasPrice > 10 ? settings.icons.normal : settings.icons.low;
    const note = data.message != 'OK' ? settings.messages.missed : '';
    renderBar(`L: ${data.result.SafeGasPrice}, N: ${data.result.ProposeGasPrice}, H: ${data.result.FastGasPrice} ${note}`, icon);
};