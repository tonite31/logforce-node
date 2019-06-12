const Logforce = require('../index.js');

(function()
{
    let logforce = new Logforce();
    let logger = logforce.createLogger();

    logger.add('error', { test: 'Hello, World!' });
    logger.publish();
})();