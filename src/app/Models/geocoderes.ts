export class Geores {
   status:String;
   results:Georesults[];
}

export class Georesults{
    geometry:Geometry;
}

export class Geometry{
    location:Geolocation;
}

export class Geolocation{
    lat:any;
    lng:any;

    constructor(lat,lng){
this.lat=lat;
this.lng=lng;
    }
}
