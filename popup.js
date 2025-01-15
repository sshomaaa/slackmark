'use strict';

const _browser = chrome || browser;

$(() => {
    $('#status').removeClass('status-text-ok status-text-ng');
    $('#status').text('');
    $('#title').text('');
    $('#url').text('');
    Promise.resolve()
        .then(getOptions)
        .then(getCurrentTab.bind(null))
        .then(postSlack.bind(null));
});

function getOptions() {
    return new Promise(resolve => {
        _browser.storage.local.get(['webhookUrl'], items => {
            resolve(items);
        });
    });
}

function getCurrentTab(args, value) {
    return new Promise((resolve, reject) => {
        _browser.tabs.query({ active: true, currentWindow: true }, tabs => {
            if (tabs.length === 0) {
                reject('no active tab found');
            }
            resolve({options: args, tab: tabs[0]});
        });
    });
}

function postSlack(args, value) {
    const title = args.tab.title;
    const url = args.tab.url;

    $('#title').text(title);
    $('#url').text(url);

    const data = {
        username: 'Slackmark',
        text: `*${title}*\n_<${url}>_`,
        icon_emoji: ':star:',
    };

    $.ajax({
        type: 'POST',
        url: args.options.webhookUrl,
        data: JSON.stringify(data),
        contentType: 'application/json',
        success: function(res) {
            $('#status').addClass('status-text-ok');
            $('#status').text('OK');
        },
        error: function(err) {
            console.error(err);
            $('#status').addClass('status-text-ng');
            $('#status').text('NG');
        },
    });
}