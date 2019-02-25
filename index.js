(function()
{
    const LZUTF8 = require('lzutf8');
    const Logger = require('./src/logger.js');

    const ConsoleAdapter = require('./src/adapters/console.adapter.js');

    let Manager = function(options)
    {
        this.options = options || {};

        this.options.timestamp = this.options.timestamp || {};
        this.options.timestamp.format = this.options.timestamp.format || 'YYYY-MM-DD hh:mm:ss.sss';
        this.options.timestamp.timezone = this.options.timestamp.timezone || 'utc';

        this.options.adapters = this.options.adapters || [];

        this.options.waitForChildren = this.options.waitForChildren || 3000;

        var checkConsoleAdapter = false;
        for(var i=0, l=this.options.adapters.length; i<l; i++)
        {
            let adaptor = this.options.adapters[i];
            if(adaptor.name === 'console')
            {
                checkConsoleAdapter = true;
                break;
            }
        }

        if(!checkConsoleAdapter)
        {
            this.options.adapters.push(new ConsoleAdapter());
        }
    };

    Manager.prototype.createLogger = function(ns, tags)
    {
        let logger = new Logger(ns, tags || {}, { timestamp: this.options.timestamp, waitForChildren: this.options.waitForChildren });
        logger.manager = this;
        return logger;
    };

    Manager.prototype.deserialize = function(compressed)
    {
        let origin = Buffer.from(compressed, 'hex');
        let decompressed = LZUTF8.decompress(origin);
        let data = JSON.parse(decompressed);

        let logger = new Logger(data.ns, data.tags, data.options);
        logger.manager = this;
        logger.logs = data.logs;
        return logger;
    };

    Manager.prototype.publish = function(logger)
    {
        for(var i=0, l=this.options.adapters.length; i<l; i++)
        {
            let adaptor = this.options.adapters[i];
            adaptor.publish(logger);
        }
    };

    Manager.Adapter = {
        Console: ConsoleAdapter,
        Slack: require('./src/adapters/slack.adapter.js'),
        SocketIO: require('./src/adapters/socket.io.adapter.js')
    }

    module.exports = Manager;
})();