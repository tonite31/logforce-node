const Manager = require('../src/manager.js');

(function()
{
    let manager = new Manager({ timestamp: { format: 'hh:mm:ss', timezone: 'asia/seoul' }});
    let logger = manager.createLogger('test');

    logger.json('grand-parent', { index: 0 });

    let parent = logger.createChild();
    setTimeout(function()
    {
        parent.json('parent', { index: 0 });
        parent.json('parent', { index: 1 });
        let child = parent.createChild();
        setTimeout(function()
        {
            child.json('child', { index: 0 });
            child.json('child', { index: 1 });
            child.publish();
        }, 2000);

        parent.json('parent', { index: 2 });
        parent.publish();
    }, 3000);

    logger.json('grand-parent', { index: 1 });
    logger.json('grand-parent', { index: 2 });
    logger.json('grand-parent', { index: 3 });
    logger.publish();
})();