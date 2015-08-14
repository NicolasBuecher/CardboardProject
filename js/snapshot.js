/**
 * Created by Nicolas Buecher on 12/08/15.
 */

/**
 * @namespace SIMU
 */
var SIMU = SIMU || {};

SIMU.Snapshot = function(id)
{
    this.id             = id;
    this.size           = 0;

    this.index          = null;
    this.color          = null;
    this.position       = null;
    this.direction      = null;
    this.info           = [];

    this.octree         = null;
    this.isReady        = false;
}