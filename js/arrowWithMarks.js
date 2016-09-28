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

THREE.MarkedArrowHelper = ( function () {

	return function MarkedArrowHelper( dir, origin, length, markColor, headLength, headWidth, ownColorOfMarksNeeded ) {
		
		this.markColor = markColor;
		this.distance = 50;  
		this.markGroup = new THREE.Group();
	
		THREE.ArrowHelper.call( this, dir, origin, length, 0x000000, headLength, headWidth );
		
		this.add( this.markGroup );
		
		var markMaterial = new THREE.MeshBasicMaterial( { color: this.markColor } ); 
		var markGeometry = new THREE.SphereGeometry( 4, 4, 4 );  

		for ( var i = this.distance; i <= length; i=i+this.distance ) {
		
			var sphere = new THREE.Mesh( markGeometry, markMaterial ); 
			sphere.position.set( 0, i, 0 );
			this.markGroup.add( sphere );
		}
		
		this.addMarks();
		this.addOrRemoveOwnColorOfMarks( ownColorOfMarksNeeded );

	};

}() );

THREE.MarkedArrowHelper.prototype = Object.create( THREE.ArrowHelper.prototype );
THREE.MarkedArrowHelper.prototype.constructor = THREE.MarkedArrowHelper;

THREE.MarkedArrowHelper.prototype.removeMarks = function () {
	
	for ( var i = 0; i < this.markGroup.length; i++ ) {
		
		this.remove( this.markGroup.getChildren[ i ] );	 
	} 
	
};

THREE.MarkedArrowHelper.prototype.addMarks = function () {
	
	for ( var i = 0; i < this.markGroup.length; i++ ) {
		
		this.add( this.markGroup.getChildren[ i ] );	 
	}
	
};

 
THREE.MarkedArrowHelper.prototype.writeOn = function ( textGeo, xPos, yPos ) {

	var textMaterial = new THREE.MeshBasicMaterial( { color:0x000000 } );
	var textMesh = new THREE.Mesh( textGeo, textMaterial );
	var boxForGettingLength = new THREE.Box3().setFromObject( textMesh );
	this.add( textMesh );
	
	textMesh.position.set( xPos, yPos-boxForGettingLength.size().y, 0 );  
	textMesh.rotation.z = Math.PI/2;  
	 
};

 

THREE.MarkedArrowHelper.prototype.addOrRemoveOwnColorOfMarks = function ( ownColorOfMarksNeeded ) {
	
	this.removeMarks();	
	
	for ( var i = 0; i < this.markGroup.children.length; i++ ) {
		
		
		if ( ownColorOfMarksNeeded ) {
			
			
			this.markGroup.children[ i ].material = new THREE.MeshBasicMaterial( { color:this.markColor } );
			
		}
		
		else {
			  
			this.markGroup.children[ i ].material = new THREE.MeshBasicMaterial( { color:0xff0000 } );
			
		}
	 
		
	}
	
	this.addMarks();	
};
