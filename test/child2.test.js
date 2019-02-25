const Logforce = require('../index.js');

(function()
{
    let logforce = new Logforce({ timestamp: { format: 'hh:mm:ss', timezone: 'asia/seoul' }});
    let logger = logforce.createLogger('test');

    logger.json('log', { name: 'grand-parent', index: 0 });

    let child = logger.createChild();
    child.json('log', { name: 'parent', index: 0 });
    child.json('log', { name: 'parent', index: 1 });
    // child.publish();

    logger.json('log', { name: 'grand-parent', index: 1 });
    logger.json('log', { name: 'grand-parent', index: 2 });
    logger.json('log', { name: 'grand-parent', index: 3 });
    logger.publish();
})();