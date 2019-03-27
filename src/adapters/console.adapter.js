(function()
{
    const chalk = require('chalk');
    const colorize = require('json-colorizer');

    let colors = {
        STRING_KEY: '#690',
        STRING_LITERAL: '#87a238',
        NUMBER_LITERAL: '#87a238'
    };

    function chalker(color, text)
    {
        return color ? chalk[color](text) : text;
    }

    const ConsoleAdapter = function(level)
    {
        this.name = 'console';
        this.level = level;
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

                let options = log.options;

                var color = '';
                if(options && options.color)
                {
                    color = options.color;
                }

                var logFormat = chalker('gray', '[') + chalker('green', 'ns: ') + chalker(color, log.ns) + chalker('gray', ']');
                for(let key in log.tags)
                {
                    logFormat += chalker('gray', '[') + chalker('green', key) + chalker('gray', ': ') + chalker(color, log.tags[key]) + chalker('gray', ']');
                }

                let timestamp = log.timestamp;

                let level = log.level;
                if(this.level)
                {
                    if(Array.isArray(this.level))
                    {
                        var check = false;
                        for(let i=0; i<this.level.length; i++)
                        {
                            if(this.level[i] === level)
                            {
                                check = true;
                                break;
                            }
                        }

                        if(!check)
                        {
                            continue;
                        }
                    }
                    else if(typeof this.level === 'string' && this.level !== level)
                    {
                        continue;
                    }
                }

                var tabText = '';
                for(var tt=1; tt<tab; tt++)
                {
                    tabText += '\t';
                }

                var data = undefined;
                var colorOptions = colors;
                if(level !== 'error')
                {
                    data = JSON.stringify(log.data);
                }
                else
                {
                    colorOptions = { STRING_KEY: '#690', STRING_LITERAL: '#aa0000' };
                    data = JSON.stringify(log.data, null, 4);
                }

                var logText = chalker('gray', '[') + chalker(color, level) + chalker('gray', ']') + logFormat + chalker('gray', '[') + chalker('green', 'ts: ') + chalker(color, timestamp) + chalker('gray', '] ');
                console.log(tabText + logText);
                console.log(tabText + colorize(data, { colors: colors }));
            }
        }
    };

    module.exports = ConsoleAdapter;
})();