// Copyright 2016 Patricia Beier
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

 
var MeasuringStation = function( lon, nBins, device, lat, adcpBinHeight, region, station, t_reference, adcpDirection, depth, adcpFirstBinHeight ){ 

	if ( adcpDirection == "down" ) {
		
		this.adcpBinDownHeight = adcpBinHeight;
		this.nDownBins = nBins;
		this.nUpBins = 0;
		this.adcpFirstBinDownHeight = adcpFirstBinHeight;
	}
	
	if ( adcpDirection == "up" ) {
		
		this.nUpBins = nBins;
		this.adcpBinUpHeight = adcpBinHeight;
		this.nDownBins = 0;
		this.adcpFirstBinUpHeight = adcpFirstBinHeight;
	}
	
	this.lon = lon;
	
	this.device = device;
	this.lat = lat;
	this.adcpDirection = adcpDirection;
	this.region = region;
	this.station = station;
	this.t_reference = t_reference;
	
	this.depth = depth;
	
	this.stationsLut = new THREE.Lut( 'cooltowarm', 512 );
	this.stationsLut.setMin( 0 );
	
	
	var geometry = new THREE.BoxGeometry( BOX_SIZE, BOX_SIZE, BOX_SIZE );
	
	var cubeSides = [ 
		new THREE.MeshBasicMaterial( { color:0xffffff, transparent:true, opacity:1.0, side: THREE.DoubleSide } ),
		new THREE.MeshBasicMaterial( { color:0xffffff, transparent:true, opacity:1.0, side: THREE.DoubleSide } ), 
		new THREE.MeshBasicMaterial( { color:0xffffff, transparent:true, opacity:1.0, side: THREE.DoubleSide } ),
		new THREE.MeshBasicMaterial( { color:0xffffff, transparent:true, opacity:1.0, side: THREE.DoubleSide } ), //backside
		new THREE.MeshBasicMaterial( { color:0xffffff, transparent:true, opacity:0.0, side: THREE.DoubleSide } ), //upside
		new THREE.MeshBasicMaterial( { color:0xffffff, transparent:true, opacity:0.0, side: THREE.DoubleSide } ) //downside
	];
			
	var cubeMaterial = new THREE.MeshFaceMaterial( cubeSides );
	
	var cube = new THREE.Mesh( geometry, cubeMaterial );
	this.cube = cube;
	this.cube.position.set( ( xPositionFromNewZero( this.lon ) )*SCALE_VALUE, ( yPositionFromNewZero( this.lat ) )*SCALE_VALUE, this.depth * -1 );
	
	this.arrowUpList = [];
	this.arrowDownList = [];
	 
	 
	if ( this.adcpDirection == "up" ) {
		
		this.addUpBins( this.nUpBins, this.adcpFirstBinUpHeight, this.adcpBinUpHeight );
		this.stationsLut.setMax( this.nUpBins );
		  
	}
	
	if ( this.adcpDirection == "down" ) {
		
		this.addDownBins( this.nDownBins, this.adcpFirstBinDownHeight, this.adcpBinDownHeight );
		this.stationsLut.setMax( this.nDownBins );
		
	}
 
	
};

MeasuringStation.prototype.makeNames = function ( textGeo ) {	 

	textGeo.computeBoundingBox();
	var centerOffset = -0.5 * ( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x );

	var textMaterial = new THREE.MeshBasicMaterial( { color:0x000000 } );

	
	//front side name
	this.frontName = new THREE.Mesh( textGeo, textMaterial );
	this.cube.add( this.frontName );
	this.frontName.position.set( -1 * BOX_SIZE/2,-1 * BOX_SIZE/2,0 );
	this.frontName.rotation.x = Math.PI / 2;
	
	//right
	this.rightName = new THREE.Mesh( textGeo, textMaterial );
	this.cube.add( this.rightName );
	this.rightName.position.set( BOX_SIZE/2,BOX_SIZE/2 * -1,0 );
	this.rightName.rotation.z = Math.PI / 2;  
	this.rightName.rotation.y = Math.PI / 2;
	
	//back
	this.backName = new THREE.Mesh( textGeo, textMaterial );
	this.cube.add( this.backName );
	this.backName.rotation.x = Math.PI/2 * -1;
	this.backName.rotation.z = Math.PI * -1;
	this.backName.position.set( BOX_SIZE/2,BOX_SIZE/2,0 );
	
	
	//left
	this.leftName = new THREE.Mesh( textGeo, textMaterial );
	this.cube.add( this.leftName );
	this.leftName.position.set( -1 * BOX_SIZE/2, BOX_SIZE/2, 0 );
	this.leftName.rotation.z = Math.PI / 2 * -1; 
	this.leftName.rotation.y = Math.PI / 2 * -1;
	
};

MeasuringStation.prototype.addDownBins = function ( nDownBins, firstDownBinHeight, binDownHeight ) {
	
	
	this.nDownBins = nDownBins;
	this.adcpBinDownHeight = binDownHeight;
	
	this.adcpFirstBinDownHeight = firstDownBinHeight;
	
	var lineMaterial = new THREE.LineBasicMaterial( {
        color: 0x000000
    } );
	
	var lineGeometry = new THREE.Geometry();
    lineGeometry.vertices.push( new THREE.Vector3( 0, 0, 0 ) );
	
	var material = new THREE.MeshBasicMaterial( { color: 0x000000 } ); 
    var geometry = new THREE.SphereGeometry( BIN_SIZE, 8, 8 );  
	
	lineGeometry.vertices.push( new THREE.Vector3( 0, 0, ( firstDownBinHeight + (  nDownBins-1 ) * binDownHeight ) * -1 ) );
	var line = new THREE.Line( lineGeometry, lineMaterial );
	this.cube.add( line );
 
	for ( var i = 0; i < nDownBins; i++ ) {
		
		var sphere = new THREE.Mesh( geometry, material ); 
		sphere.position.set( 0, 0, ( firstDownBinHeight + i * binDownHeight ) * -1 );
		this.cube.add( sphere );
		var dir = new THREE.Vector3( 1, 0, 0 );
		var origin = new THREE.Vector3( 0, 0, ( firstDownBinHeight + i * binDownHeight ) * -1 );
		var arrow = new THREE.MarkedArrowHelper( dir, origin, 50, 0x000000, 1, 1, 100, true );
		arrow.visible = false;
		this.arrowDownList[i] = ( arrow );  
	 
	}
	
	for ( var i = 0; i < this.arrowDownList.length; i++ ) {
		
		this.cube.add(this.arrowDownList[ i ] );
		
	}
	
	if ( this.nDownBins > this.nUpBins ) {
		
		this.stationsLut.setMax( this.nDownBins );
	}
	
};

 

MeasuringStation.prototype.addUpBins = function (nUpBins, firstUpBinHeight, binUpHeight) {
	
	this.nUpBins = nUpBins;
	this.adcpBinUpHeight = binUpHeight;
	
	this.adcpFirstBinUpHeight = firstUpBinHeight;
	
	var lineMaterial = new THREE.LineBasicMaterial( {
        color: 0x000000
    } );
	
	var lineGeometry = new THREE.Geometry();
    lineGeometry.vertices.push( new THREE.Vector3( 0, 0, 0 ) );
	
	var material = new THREE.MeshBasicMaterial( { color: 0x000000 } ); 
    var geometry = new THREE.SphereGeometry( BIN_SIZE, 8, 8 );  
	
	lineGeometry.vertices.push( new THREE.Vector3( 0, 0, firstUpBinHeight + ( nUpBins-1 ) * binUpHeight ) );
	var line = new THREE.Line( lineGeometry, lineMaterial );
	this.cube.add( line );
	
	for ( var i = 0; i < nUpBins; i++ ) {
		
		var sphere = new THREE.Mesh( geometry, material ); 
		sphere.position.set( 0, 0, firstUpBinHeight +  i * binUpHeight );
		this.cube.add( sphere );
		var dir = new THREE.Vector3( 1, 0, 0 );
		var origin = new THREE.Vector3( 0, 0, firstUpBinHeight +  i * binUpHeight );
		var arrow = new THREE.MarkedArrowHelper( dir, origin, 55, 0x000000, 1, 1, true );
		arrow.visible = false;
		this.arrowUpList[i] = ( arrow ); 
	}
	
	for ( var i = 0; i < this.arrowUpList.length; i++ ) {
		
		this.cube.add( this.arrowUpList[ i ] );
		
	}
	if ( this.nDownBins < this.nUpBins ) {
		
		this.stationsLut.setMax( this.nUpBins );
	}
	 
};

MeasuringStation.prototype.moveUpArrows = function( lengthsUp, dirsUp, ownColorOfMarksNeeded ) {
	
	 
	for ( var i = 0; i < this.arrowUpList.length; i++ ) {
		//deletes arrows from visualisation
		if ( this.arrowUpList[i] != -1 ) {
			this.cube.remove( this.arrowUpList[ i ] ); 
		}
	}
	
	this.arrowUpList = [];
	
 
	for ( var i = 0; i < this.nUpBins; i++ ) {
		
		if ( lengthsUp[ i ] > 0 ) {
			
			var arrowDirectionX = Math.cos(0.5 * Math.PI - dirsUp[ i ] );
			var arrowDirectionY = Math.sin(0.5 * Math.PI - dirsUp[ i ] );
			var dir = new THREE.Vector3( arrowDirectionX, arrowDirectionY, 0 );
			var origin = new THREE.Vector3( 0, 0, this.adcpFirstBinUpHeight + i * this.adcpBinUpHeight  );
			this.arrowUpList[i] = ( new THREE.MarkedArrowHelper( dir, origin, lengthsUp[i],
				this.stationsLut.getColor( i ), 1, 1, ownColorOfMarksNeeded ) );
			
		}
		
		else {
			//alert(lengthsUp[i]+i+" up!");
			this.arrowUpList[ i ] = -1; //no arrow!
			
		}
		
	}
	
	for ( var i = 0; i < this.arrowUpList.length; i++ ) {
		
		//the add()-call is needed to show the arrows in the visualisation
		
		if ( this.arrowUpList[ i ] != -1 ) {
			
			this.cube.add(this.arrowUpList[ i ] );
		}
		
		
	}
	 
	  
};
   

MeasuringStation.prototype.moveDownArrows = function ( lengthsDown, dirsDown, ownColorOfMarksNeeded ) { 

	for ( var i = 0; i < this.arrowDownList.length; i++ ) {
		//deletes arrows from visualisation
		if ( this.arrowDownList[i] != -1 ) {
			this.cube.remove( this.arrowDownList[ i ] );
		}
	}
	
	this.arrowDownList = [];
		 
	for ( var i = 0; i < this.nDownBins; i++ ) {
		
		if ( lengthsDown[i] > 0 ) {
		
			var arrowDirectionX = Math.cos( 0.5 * Math.PI - dirsDown[ i ] );
			var arrowDirectionY = Math.sin( 0.5 * Math.PI - dirsDown[ i ] );
			var dir = new THREE.Vector3( arrowDirectionX, arrowDirectionY, 0 ) ;
		
			var origin = new THREE.Vector3( 0, 0, (this.adcpFirstBinDownHeight + i * this.adcpBinDownHeight) *-1 );
			this.arrowDownList[i] = ( new THREE.MarkedArrowHelper( dir, origin, lengthsDown[i],
				this.stationsLut.getColor(i), 1, 1, ownColorOfMarksNeeded ) );
		}
		else {
			//alert(this.arrowDownList[i]+i+" down!");
			this.arrowDownList[i] = -1; //no arrow!
			
		}
		
		
	}
	
	for (var i = 0; i < this.arrowDownList.length; i++) {
		//the add()-call is needed to show the arrows in the visualisation
		if ( this.arrowDownList[i] != -1 ) {
			this.cube.add( this.arrowDownList[ i ] );
		}
	}


};

MeasuringStation.prototype.makeTransparent = function () {
	 
	 
	var cubeSides = [ 
		new THREE.MeshBasicMaterial( { color:0xffffff, transparent:true, opacity:0.0, side: THREE.DoubleSide } ),
		new THREE.MeshBasicMaterial( { color:0xffffff, transparent:true, opacity:0.0, side: THREE.DoubleSide } ), 
		new THREE.MeshBasicMaterial( { color:0xffffff, transparent:true, opacity:0.0, side: THREE.DoubleSide } ),
		new THREE.MeshBasicMaterial( { color:0xffffff, transparent:true, opacity:0.0, side: THREE.DoubleSide } ), //backside
		new THREE.MeshBasicMaterial( { color:0xffffff, transparent:true, opacity:0.0, side: THREE.DoubleSide } ), //upside
		new THREE.MeshBasicMaterial( { color:0xffffff, transparent:true, opacity:0.0, side: THREE.DoubleSide } ) //downside
	];
			
	var cubeMaterial = new THREE.MeshFaceMaterial( cubeSides );
	this.cube.material = cubeMaterial;
	
	this.frontName.visible = false;
	this.rightName.visible = false;
	this.backName.visible = false;
	this.leftName.visible = false;
	
};

MeasuringStation.prototype.makeVisible = function () {
	 
	 
	var cubeSides = [ 
		new THREE.MeshBasicMaterial( { color:0xffffff, transparent:true, opacity:1.0, side: THREE.DoubleSide } ),
		new THREE.MeshBasicMaterial( { color:0xffffff, transparent:true, opacity:1.0, side: THREE.DoubleSide } ), 
		new THREE.MeshBasicMaterial( { color:0xffffff, transparent:true, opacity:1.0, side: THREE.DoubleSide } ),
		new THREE.MeshBasicMaterial( { color:0xffffff, transparent:true, opacity:1.0, side: THREE.DoubleSide } ), //backside
		new THREE.MeshBasicMaterial( { color:0xffffff, transparent:true, opacity:0.0, side: THREE.DoubleSide } ), //upside
		new THREE.MeshBasicMaterial( { color:0xffffff, transparent:true, opacity:0.0, side: THREE.DoubleSide } ) //downside
	];
			
	var cubeMaterial = new THREE.MeshFaceMaterial( cubeSides );
	this.cube.material = cubeMaterial;
	
	this.frontName.visible = true;
	this.rightName.visible = true;
	this.backName.visible = true;
	this.leftName.visible = true;
	
};

MeasuringStation.prototype.colorizeMarks = function ( checked ) {
	
	if ( this.nUpBins > 0 ) {
		
		for ( var i = 0; i < this.arrowUpList.length; i++ ) {
			
			this.arrowUpList[i].addOrRemoveOwnColorOfMarks( checked );
			
			
		}
		
	}
	
	if ( this.nDownBins > 0 ) {
		
		for ( var i = 0; i < this.arrowDownList.length; i++ ) {
			
			this.arrowDownList[ i ].addOrRemoveOwnColorOfMarks( checked );
			
			
		}
		
		
	}
	
	 
};

MeasuringStation.prototype.showOrHideArrows = function ( checkboxChecked ) {
	
	
	if ( this.nUpBins > 0 ) {
		
		for ( var i = 0; i < this.arrowUpList.length; i++ ) {
			
			
			this.arrowUpList[ i ].visible = checkboxChecked;
		 	
			
		}
		
	}
	
	if ( this.nDownBins > 0 ) {
		
		for ( var i = 0; i < this.arrowDownList.length; i++ ) {
		 
			this.arrowDownList[ i ].visible = checkboxChecked;
			 
			
		}
		
		
	}
	
	 
};
 