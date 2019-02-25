(function()
{
    const chalk = require('chalk');

    const ConsoleAdapter = function()
    {
        this.name = 'console';
    };

    ConsoleAdapter.prototype.publish = function(logger)
    {
        this.log(1, logger.logs);
    };

    ConsoleAdapter.prototype.log = function(tab, logs)
    {
        for(var i=0, l=logs.length; i<l; i++)
        {
            let log = JSON.parse(JSON.stringify(logs[i]));
            if(Array.isArray(log))
            {
                this.log(tab + 1, log);
            }
            else
            {
                let log = logs[i];
                if(log === 'child')
                {
                    continue;
                }

                var logFormat = '[ns:' + log.ns + ']';
                for(let key in log.tags)
                {
                    logFormat += '[' + key + ':' + log.tags[key] + ']';
                }

                let options = log.options;

                var color = '';
                if(options && options.color)
                {
                    color = options.color;
                }

                let timestamp = log.timestamp;

                let level = log.level;

                var tabText = '';
                for(var tt=1; tt<tab; tt++)
                {
                    tabText += '\t';
                }

                var logText = tabText + '[' + level + ']' + logFormat + '[ts:' + timestamp + '] ' + JSON.stringify(log.data);
                if(color)
                {
                    console.log(chalk[color](logText));
                }
                else
                {
                    console.log(logText);
                }
            }
        }
    };

    module.exports = ConsoleAdapter;
})();