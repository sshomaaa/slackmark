'use strict';

const _browser = chrome || browser;

$(() => {
    $('#save').click(() => {
        const webhookUrl = $('#webhook-url').val();
        _browser.storage.local.set({ webhookUrl: webhookUrl }, () => {
            $('#status').text('Options saved.');
        });
    });

    _browser.storage.local.get('webhookUrl', items => {
        $('#webhook-url').val(items.webhookUrl);
    });
});
