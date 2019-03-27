const Logforce = require('../index.js');

(function()
{
    let logforce = new Logforce({ timestamp: { format: 'hh:mm:ss', timezone: 'asia/seoul' }, adapters: [new Logforce.Adapter.Slack({ webhookUrl: 'YOUR_WEBHOOK_URL', channel: 'YOUR_CHANNEL', username: 'YOUR_USERNAME' }, 'error')] });
    let logger = logforce.createLogger('test');

    logger.json('log', { test: '일반적인 로그' });
    logger.json('log', { test: '색깔이 들어간 로그' }, { color: 'yellow' });
    logger.json('error', { test: '에러' }, { color: 'red' });

    logger.publish();
})();