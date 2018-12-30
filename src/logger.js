(function()
{
    const moment = require('moment-timezone');

    let Logger = function(ns, tags, timestamp)
    {
        if(!ns || typeof ns !== 'string')
        {
            throw new Error('namespace must be string');
        }

        if(!tags || typeof tags !== 'object')
        {
            throw new Error('tags must be json object');
        }

        if(!timestamp || typeof timestamp !== 'object' || !timestamp.hasOwnProperty('format') || !timestamp.hasOwnProperty('timezone'))
        {
            throw new Error('timestamp must be json object that have 2 key "foramt" and "timezone"');
        }

        this.ns = ns;
        this.tags = tags;
        this.timestamp = timestamp;
        this.logs = [];
        this.manager = undefined;
        this.parent = undefined;
        this.index = -1;
        this.isChild = false;
    };

    Logger.prototype.createChild = function()
    {
        let logger = new Logger(this.ns, this.tags, this.timestamp);
        let index = this.logs.push('child') - 1;
        logger.index = index;
        logger.parent = this;
        logger.isChild = true;

        return logger;
    };

    Logger.prototype.text = function()
    {
        let args = arguments;

        var text = '';
        for(var i=0, l = args.length; i<l; i++)
        {
            if(i > 0)
            {
                text += ' ';
            }

            if(typeof args[i] === 'object')
            {
                text += JSON.stringify(args[i]);
            }
            else
            {
                text += args[i];
            }
        }

        this.json(text);
    };

    Logger.prototype.json = function(text, data)
    {
        if(arguments.length === 1 && typeof text === 'object')
        {
            data = text;
            text = '';
        }

        if(!data)
        {
            data = {};
        }

        if(text)
        {
            data.text = text;
        }

        if(!data.hasOwnProperty('timestamp'))
        {
            let timestamp = undefined;
            if(this.timestamp.timezone === 'utc')
            {
                timestamp = moment.utc();
            }
            else
            {
                timestamp = moment.tz(this.timestamp.timezone);
            }

            data.timestamp = timestamp.format(this.timestamp.format);
        }

        this.logs.push(data);
        return this;
    };

    Logger.prototype.publish = function()
    {
        if(!this.isChild)
        {
            if(this.logs.indexOf('child') === -1)
            {
                this.manager.publish(this);
            }
        }
        else
        {
            this.parent.logs.splice(this.index, 1, this.logs);
            if(this.logs.indexOf('child') === -1)
            {
                this.parent.publish();
            }
        }
    };

    module.exports = Logger;
})();