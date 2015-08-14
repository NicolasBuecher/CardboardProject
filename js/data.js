/**
 * Created by Nicolas Buecher on 14/08/15.
 */

var SIMU = SIMU || {};

SIMU.Data = function(id)
{
    this.id                 = id;

    this.levelOfDetail      = 4;

    this.index              = null;
    this.indexIsSet         = false;
    this.position           = null;
    this.positionIsSet      = false;
    this.departure          = null;
    this.departureIsSet     = false;
    this.color              = null;
    this.colorIsSet         = false;
    this.info               = null;
    this.infoIsSet          = false;

    this.octree             = null;

    this.isReady            = false;
}