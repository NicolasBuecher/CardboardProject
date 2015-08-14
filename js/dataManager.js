/**
 * Created by Nicolas Buecher on 12/08/15.
 */

var SIMU = SIMU || {};

SIMU.DataManager = function()
{
    this.currentSnapshot        = null;
    this.snapshots              = []

    this.datas                  = [];

    this.levelOfDetail          = 4;

    this.isReady                = false;

}

SIMU.DataManager.prototype.addSnapshot = function(data, callback)
{
    this.currentSnapshot = new SIMU.Snapshot(this.snapshots.length);
    this.snapshots.push(this.currentSnapshot);

    for (var i = 0; i < data.length; i++) {
        this.currentSnapshot.size += data[i][0].value.length;
    }

    this.currentSnapshot.color = new Float32Array(this.currentSnapshot.size * 3);
    this.currentSnapshot.position = new Float32Array(this.currentSnapshot.size * 3);
    this.currentSnapshot.direction = new Float32Array(this.currentSnapshot.size * 3);
    this.currentSnapshot.index = new Float32Array(this.currentSnapshot.size);

    for (var i = 0; i < data[0].length; i++) {
        var name = data[0][i].name;

        if (name != "position" && name != "color" && name != "index") {
            this.currentSnapshot.info.push({name: name, value: new Float32Array(this.currentSnapshot.size), min: 0, max: 0});
        }
    }

    for (var i = 0; i < this.currentSnapshot.size * 3; i++) {
        this.currentSnapshot.color[3 * i] = 1.0;
        this.currentSnapshot.color[3 * i + 1] = 1.0;
        this.currentSnapshot.color[3 * i + 2] = 1.0;

        this.currentSnapshot.index[i] = i;
    }

    var that = this;

    async.forEach(data, this.populateBuffer.bind(this), function() { that.onPopulateEnd(callback); });
}

SIMU.DataManager.prototype.populateBuffer = function(data, callback)
{
    // 0 : index, 1 : position, 2: masse, 3: epot, 4 : ekin pour Deparis darkMatter
    for (var i = 1; i < data.length; i++)
    {
        var index = 0;
        var value = null;
        var indexes = data[0].value;
        var length = indexes.length;

        switch (data[i].name)
        {
            case "position":
                var position = data[i].value;
                for (var j = 0; j < length; j++)
                {
                    index = indexes[j];
                    this.currentSnapshot.position[index*3] = position[3*j];
                    this.currentSnapshot.position[index*3 + 1] = position[3*j + 1];
                    this.currentSnapshot.position[index*3 + 2] = position[3*j + 2];
                }
                position = null;
                break;
            case "color":
                value = data[i].value;
                for (var j = 0; j < length; j++)
                {
                    index = data[0].value[j];
                    this.currentSnapshot.color[index*3] = value[3*j];
                    this.currentSnapshot.color[index*3 + 1] = value[3*j + 1];
                    this.currentSnapshot.color[index*3 + 2] = value[3*j + 2];
                }
                value = null;
                break;
            default:
                value = data[i].value;
                var name = data[i].name;
                for (var j = 0; j < this.currentSnapshot.info.length; j++)
                {
                    if (name == this.currentSnapshot.info[j].name)
                    {
                        var info = this.currentSnapshot.info[j].value;
                    }
                }
                for (var j = 0; j < length; j++)
                {
                    index = indexes[j];
                    info[index] = value[j];
                }
                value = null;
                break;
        }
    }
    callback();
}

SIMU.DataManager.prototype.onPopulateEnd = function(callback)
{
    var that = this;
    var snapshot = that.currentSnapshot;

    //First compute the octree
    if ("undefined" == typeof(worker))
    {
        var worker = new Worker("js/octreeWorker.js");
        worker.postMessage({
            position: snapshot.position,
            index: snapshot.index
        });

        //When the worker send  message back
        worker.onmessage = function (event) {

            var data = new SIMU.Data(that.datas.length);
            that.datas.push(data);

            snapshot.index = event.data.index;
            snapshot.octree = event.data.octree;

            //Get new indexation according to LevelOfDetail
            snapshot.index = that.computeLevelOfDetail(that.levelOfDetail, snapshot.index);
            data.indexIsSet = true;
            data.index = snapshot.index;

            var position = new Float32Array(snapshot.position.length);

            for(var j = 0; j < snapshot.info.length;j++){
                snapshot.info[j].min = snapshot.info[j].value[0];
                snapshot.info[j].max = snapshot.info[j].value[0];
            }

            //Then get the right indexation to match the octree, & search for the bounds of additional data
            for(var i = 0; i < snapshot.size; i++){
                position[3*i] = snapshot.position[3*snapshot.index[i]];
                position[3*i + 1] = snapshot.position[3*snapshot.index[i] + 1];
                position[3*i + 2] = snapshot.position[3*snapshot.index[i] + 2];

                //TODO index info buffer as well
                for(j = 0; j < snapshot.info.length;j++){
                    if(snapshot.info[j].min > snapshot.info[j].value[i]){
                        snapshot.info[j].min = snapshot.info[j].value[i];
                    }
                    if(snapshot.info[j].max < snapshot.info[j].value[i]){
                        snapshot.info[j].max = snapshot.info[j].value[i];
                    }
                }
            }

            data.position = new Float32Array(snapshot.size*3);
            for(i = 0; i < snapshot.size*3;i++){
                data.position[i] = position[i];
            }
            data.positionIsSet = true;

            //If next snapshot is already available, compute the direction
            if(snapshot.id + 1 < that.snapshots.length && that.snapshots[snapshot.id + 1].isReady)
            {
                var nextSnapshot = that.snapshots[snapshot.id + 1];
                for(i = 0; i < snapshot.size; i++)
                {
                    snapshot.direction[3*nextSnapshot.index[i]] = nextSnapshot.position[3*i] - snapshot.position[3*nextSnapshot.index[i]];
                    snapshot.direction[3*nextSnapshot.index[i]+1] = nextSnapshot.position[3*i+1] - snapshot.position[3*nextSnapshot.index[i]+1];
                    snapshot.direction[3*nextSnapshot.index[i]+2] = nextSnapshot.position[3*i+2] - snapshot.position[3*nextSnapshot.index[i]+2];
                }
                snapshot.directionIsSet = true;
                data.direction = snapshot.direction;
                data.directionIsSet = true;
            }

            //If there is a previous snapshot, compute its direction
            if(snapshot.id > 0 && that.snapshots[snapshot.id - 1].isReady){
                var previousSnapshot = that.snapshots[snapshot.id - 1];
                for(i = 0; i < snapshot.size;i++) {
                    previousSnapshot.direction[3*i] = snapshot.position[3*previousSnapshot.index[i]] - previousSnapshot.position[3*i];
                    previousSnapshot.direction[3*i+1] = snapshot.position[3*previousSnapshot.index[i]+1] - previousSnapshot.position[3*i+1];
                    previousSnapshot.direction[3*i+2] = snapshot.position[3*previousSnapshot.index[i]+2] - previousSnapshot.position[3*i+2];
                }
                previousSnapshot.directionIsSet = true;
            }
            snapshot.position = position;
            snapshot.positionIsSet = true;

            data.departure = snapshot.position;
            data.departureIsSet = true;

            data.color = snapshot.color;
            data.colorIsSet = true;

            data.octree = snapshot.octree;

            snapshot.isReady = true;
            data.isReady = true;

            //that.loadBar.domElement.style.display = 'none';

            worker.terminate();
            worker = null;

            callback(data.id);
        }
    }
}

SIMU.DataManager.prototype.computeLevelOfDetail = function(levelOfDetail, indexArray)
{
    var length = indexArray.length;
    var index = new Float32Array(length);

    var loop = length/levelOfDetail;
    for(var i = 0; i < loop;i++){
        for(var j = 0; j < levelOfDetail;j++){
            index[i + j*loop] = indexArray[i*levelOfDetail + j];
        }
    }
    return index;
};