const Logforce = require('../index.js');

(function()
{
    let logforce = new Logforce({ timestamp: { format: 'hh:mm:ss', timezone: 'asia/seoul' }});
    let logger = logforce.createLogger('test');

    logger.json('log', { name: 'grand-parent', index: 0 });

    let parent = logger.createChild();
    setTimeout(function()
    {
        parent.json('log', { name: 'parent', index: 0 });
        parent.json('log', { name: 'parent', index: 1 });
        let child = parent.createChild();
        setTimeout(function()
        {
            child.json('log', { name: 'child', index: 0 });
            child.json('log', { name: 'child', index: 1 });
            child.publish();
        }, 2000);

        parent.json('log', { name: 'parent', index: 2 });
        parent.publish();
    }, 3000);

    logger.json('log', { name: 'grand-parent', index: 1 });
    logger.json('log', { name: 'grand-parent', index: 2 });
    logger.json('log', { name: 'grand-parent', index: 3 });
    logger.publish();
})();