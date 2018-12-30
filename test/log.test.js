const Manager = require('../src/manager.js');

(function()
{
    let manager = new Manager({ timestamp: { format: 'hh:mm:ss', timezone: 'asia/seoul' }});
    let logger = manager.createLogger('test');

    logger.json({ test: 'value' });
    logger.text('테스트', { test: 'value' });
    logger.json({ test: 'value' });
    logger.text('테스트', { test: 'value' });
    logger.json({ test: 'value' });
    logger.text('테스트', { test: 'value' });
    logger.json({ test: 'value' });
    logger.text('테스트', { test: 'value' });
    logger.json({ test: 'value' });


    logger.publish();
})();