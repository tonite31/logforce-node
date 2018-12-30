(function()
{
    const LZUTF8 = require('lzutf8');
    const Logger = require('./logger.js');

    const ConsoleAdaptor = require('./adaptors/console.adaptor.js');

    let Manager = function(options)
    {
        this.options = options || {};

        this.options.timestamp = this.options.timestamp || {};
        this.options.timestamp.format = this.options.timestamp.format || 'YYYY-MM-DD hh:mm:ss.sss';
        this.options.timestamp.timezone = this.options.timestamp.timezone || 'utc';

        this.options.adaptors = this.options.adaptors || [];

        var checkConsoleAdaptor = false;
        for(var i=0, l=this.options.adaptors.length; i<l; i++)
        {
            let adaptor = this.options.adaptors[i];
            if(adaptor.name === 'console')
            {
                checkConsoleAdaptor = true;
                break;
            }
        }

        if(!checkConsoleAdaptor)
        {
            this.options.adaptors.push(ConsoleAdaptor);
        }
    };

    Manager.prototype.createLogger = function(ns, tags)
    {
        let logger = new Logger(ns, tags || {}, this.options.timestamp);
        logger.manager = this;
        return logger;
    };

    Manager.prototype.from = function(compressed)
    {
        let origin = Buffer.from(compressed, 'hex');
        let decompressed = LZUTF8.decompress(origin);
        let data = JSON.parse(decompressed);

        let logger = new Logger(data.ns, data.tags, data.timestamp);
        logger.manager = this;
        logger.logs = data.logs;
        return logger;
    };

    Manager.prototype.publish = function(logger)
    {
        let compressed = LZUTF8.compress(JSON.stringify(logger));
        let hex = Buffer.from(compressed).toString('hex');

        for(var i=0, l=this.options.adaptors.length; i<l; i++)
        {
            let adaptor = this.options.adaptors[i];
            if(adaptor.name === 'console')
            {
                adaptor.exec(logger);
            }
        }
    };

    module.exports = Manager;
})();