(function()
{
    const chalk = require('chalk');
    const colorize = require('json-colorizer');

    let colors = {
        STRING_KEY: '#690',
        STRING_LITERAL: '#87a238',
        NUMBER_LITERAL: '#87a238'
    };

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


                let data = JSON.stringify(log.data);
                var logText = tabText + '[' + level + ']' + logFormat + '[ts:' + timestamp + '] ';
                if(color)
                {
                    console.log(chalk[color](logText) + colorize(data, { colors: colors }));
                }
                else
                {
                    console.log(logText + data);
                }
            }
        }
    };

    module.exports = ConsoleAdapter;
})();