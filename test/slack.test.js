const Logforce = require('../index.js');

(function()
{
    let logforce = new Logforce({ timestamp: { format: 'hh:mm:ss', timezone: 'asia/seoul' }, adapters: [new Logforce.Adapter.Slack({ webhookUrl: 'YOUR_WEBHOOK', channel: 'YOUR_CHANNEL', username: 'YOUR_USERNAME' }, 'error')] });
    let logger = logforce.createLogger({ test: 'test' });

    logger.add('log', { test: '일반적인 로그' });
    logger.add('error', { test: '에러' }, { color: 'red' });

    logger.publish();
})();
