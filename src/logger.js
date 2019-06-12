(function()
{
    const moment = require('moment-timezone');

    let Logger = function(header, options)
    {
        let timestamp = options.timestamp;

        if(!timestamp || typeof timestamp !== 'object' || !timestamp.hasOwnProperty('format') || !timestamp.hasOwnProperty('timezone'))
        {
            throw new Error('timestamp must be json object that have 2 key "foramt" and "timezone"');
        }

        this.header = header || {};
        this.timestamp = timestamp;
        this.logs = [];

        this.manager = undefined;

        this.options = options;
    };

    Logger.prototype.add = function(level, data)
    {
        let log = {};

        if(arguments.length === 1)
        {
            data = level || {};
            log.level = 'log';
        }
        else
        {
            log.level = level || 'log';
        }

        log.data = data;

        let timestamp = undefined;
        if(this.timestamp.timezone === 'utc')
        {
            timestamp = moment.utc();
        }
        else
        {
            timestamp = moment.tz(this.timestamp.timezone);
        }

        log.timestamp = timestamp.format(this.timestamp.format);

        this.logs.push(log);
        return this;
    };

    Logger.prototype.publish = function()
    {
        this.manager.publish(this);
    };

    Logger.prototype.json = function()
    {
        return { header: this.header, logs: this.logs };
    };

    module.exports = Logger;
})();