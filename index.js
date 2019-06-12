(function()
{
    const Logger = require('./src/logger.js');

    const ConsoleAdapter = require('./src/adapters/console.adapter.js');

    let Manager = function(options)
    {
        this.options = options || {};

        this.options.timestamp = this.options.timestamp || {};
        this.options.timestamp.format = this.options.timestamp.format || 'YYYY-MM-DD hh:mm:ss.sss';
        this.options.timestamp.timezone = this.options.timestamp.timezone || 'utc';

        this.options.adapters = this.options.adapters || [];

        let checkConsoleAdapter = false;
        for(let i=0, l=this.options.adapters.length; i<l; i++)
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

    Manager.prototype.createLogger = function(header)
    {
        let logger = new Logger(header, { timestamp: this.options.timestamp });
        logger.manager = this;
        return logger;
    };

    Manager.prototype.publish = function(logger)
    {
        for(let i=0, l=this.options.adapters.length; i<l; i++)
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