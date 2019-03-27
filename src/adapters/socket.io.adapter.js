(function()
{
    const io = require('socket.io-client');

    let SocketIOAdapter = function(url, level)
    {
        this.url = url;
        this.socket = undefined;
        this.level = level;
    };

    SocketIOAdapter.prototype.connect = function(callback)
    {
        if(this.url)
        {
            if(!this.socket)
            {
                this.socket = io(this.url + '/logforce-stream');
                this.socket.on('connect', function()
                {
                    callback();
                });
            }
            else
            {
                callback();
            }
        }
        else
        {
            throw new Error('[logforce] socket.io url is not defined');
        }
    };

    SocketIOAdapter.prototype.publish = function(logger)
    {
        let self = this;
        this.connect(function()
        {
            self.socket.emit('log', { log: logger.serialize() });
        });
    };

    module.exports = SocketIOAdapter;
})();