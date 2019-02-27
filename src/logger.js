(function()
{
    const LZUTF8 = require('lzutf8');
    const moment = require('moment-timezone');

    let Logger = function(ns, tags, options)
    {
        if(!ns || typeof ns !== 'string')
        {
            throw new Error('namespace must be string');
        }

        if(!tags || typeof tags !== 'object')
        {
            throw new Error('tags must be json object');
        }

        let timestamp = options.timestamp;

        if(!timestamp || typeof timestamp !== 'object' || !timestamp.hasOwnProperty('format') || !timestamp.hasOwnProperty('timezone'))
        {
            throw new Error('timestamp must be json object that have 2 key "foramt" and "timezone"');
        }

        this.ns = ns;
        this.tags = tags;
        this.timestamp = timestamp;
        this.waitForChildren = options.waitForChildren;
        this.logs = [];

        this.childs = [];
        this.manager = undefined;
        this.parent = undefined;
        this.index = -1;
        this.isChild = false;
        this.ready = false;

        this.options = options;

        this.timer = undefined;
        this.published = false;
    };

    Logger.prototype.addTag = function(key, value)
    {
        this.tags[key] = value;
    };

    Logger.prototype.createChild = function()
    {
        let logger = new Logger(this.ns, this.tags, this.options);

        let index = this.logs.push('child') - 1;
        logger.index = index;
        logger.parent = this;
        logger.isChild = true;

        this.childs.push(logger);

        return logger;
    };

    Logger.prototype.addChild = function(logger)
    {
        let index = this.logs.push('child') - 1;
        logger.index = index;
        logger.parent = this;
        logger.isChild = true;

        this.childs.push(logger);
    };

    // options - color: 콘솔에 찍을때 로그 색깔
    Logger.prototype.json = function(level, data, options)
    {
        var log = {};
        log.level = level;
        log.ns = this.ns;
        log.tags = this.tags;
        log.data = data;
        log.options = options;

        var timestamp = undefined;
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

    Logger.prototype.publish = function(from)
    {
        if(from === undefined)
        {
            this.ready = true;
        }

        if(!this.isChild)
        {
            if(this.logs.indexOf('child') === -1)
            {
                if(this.ready && !this.published)
                {
                    this.published = true;
                    clearTimeout(this.timer);
                    this.manager.publish(this);
                }
            }
            else
            {
                var isReady = true;
                for(var i=0, l=this.childs.length; i<l; i++)
                {
                    if(!this.childs[i].ready)
                    {
                        isReady = false;
                        break;
                    }
                }

                if(isReady)
                {
                    if(!this.published)
                    {
                        this.published = true;
                        clearTimeout(this.timer);
                        this.manager.publish(this);
                    }
                }
                else
                {
                    let self = this;
                    clearTimeout(this.timer);
                    this.timer = setTimeout(function()
                    {
                        if(!self.published)
                        {
                            self.published = true;
                            self.manager.publish(self);
                        }

                    }, this.waitForChildren || 3000);
                }
            }
        }
        else
        {
            this.parent.logs.splice(this.index, 1, this.logs);
            if(this.logs.indexOf('child') === -1)
            {
                this.parent.publish(true);
            }
            else
            {
                var isReady = true;
                for(var i=0, l=this.childs.length; i<l; i++)
                {
                    if(!this.childs[i].ready)
                    {
                        isReady = false;
                        break;
                    }
                }

                if(isReady)
                {
                    this.parent.publish(true);
                }
            }
        }
    };

    Logger.prototype.serialize = function()
    {
        var data = {
            ns: this.ns,
            tags: this.tags,
            options: this.options,
            logs: this.logs
        };

        let compressed = LZUTF8.compress(JSON.stringify(data));
        let hex = Buffer.from(compressed).toString('hex');

        return hex;
    };

    module.exports = Logger;
})();