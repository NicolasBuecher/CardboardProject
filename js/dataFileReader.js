/**
 * Created by Nicolas Buecher on 11/08/15.
 */

/**
 * @namespace SIMU
 */
var SIMU = SIMU || {};

SIMU.DataFileReader = function(files, script)
{
    this.files          = files;
    this.script         = script;
}

SIMU.DataFileReader.prototype.setNewFiles = function(files)
{
    this.files = files;
}

SIMU.DataFileReader.prototype.setNewScript = function(script)
{
    this.script = script;
}

SIMU.DataFileReader.prototype.loadBinaryFiles = function(callback)
{
    async.map(this.files, this.loadBinaryFile.bind(this), callback);
}

SIMU.DataFileReader.prototype.loadBinaryFile = function(file, callback)
{
    //this.timer.start();
    var xhr = new XMLHttpRequest();
    xhr.addEventListener('readystatechange', onReadyStateChange, false);

    var that = this;

    function onReadyStateChange()
    {
        if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0))
        {
            if (xhr.response)
            {
                var response = xhr.response;
                var data = that.script(response);
                callback(null, data);
            }
            else
            {
                console.error("An error occurred while loading a file.");
                callback(null, null);
            }
        }
    }

    xhr.open("GET", file, true);
    xhr.responseType = 'arraybuffer';
    xhr.send(null);
}