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

function xPositionFromNewZero( value ) {
	
	var zerox = Math.floor( smallestx );
	return value - zerox;
	
}

function yPositionFromNewZero( value ) {
	
	var zeroy = Math.floor( smallesty );
	return value - zeroy;
	
}

function oldXPositionBeforeNewZero( value ) {
	
	var zerox = Math.floor( smallestx );
	return value + zerox;
	
}

function oldYPositionBeforeNewZero( value ) {
	
	var zeroy = Math.floor( smallesty );
	return value + zeroy;
	
}
 	
function calculateGridDistancesAndAddGrid( differenceBetweenMinAndMaxX, differenceBetweenMinAndMaxY ) {
	
	var smallestDifferenceBetweenMinAndMax;
	var calculatedGridDistance;
	var zerosDirectlyAfterDot;
	var predecimal, decimal;
	
	if ( differenceBetweenMinAndMaxX <= differenceBetweenMinAndMaxY ) {
		smallestDifferenceBetweenMinAndMax = differenceBetweenMinAndMaxX;
	}
	else {
		smallestDifferenceBetweenMinAndMax = differenceBetweenMinAndMaxY;
		
	}
	console.log ( "Smallest difference for grid: "+smallestDifferenceBetweenMinAndMax );
	
	//Math.floor always rounds downward to nearest integer
	predecimal = Math.floor( smallestDifferenceBetweenMinAndMax );
	decimal = smallestDifferenceBetweenMinAndMax - predecimal;
	
	//console.log(predecimal+" "+decimal);
	//TEST: predecimal = 3344;
	if ( predecimal > 0 ) {
		
		console.log( "calculatedGridDistance: "+Math.pow( 10, predecimal.toString().length) / 100 );
		calculatedGridDistance = Math.pow( 10, predecimal.toString().length ) / 100; 
		zerosDirectlyAfterDot = 0;
	}
	else {
		
		var decimalWithoutDot = decimal.toString().split( "." )[ 1 ];
		//TEST decimalWithoutDot = "000003234";
		console.log( "decimalWithoutDot: "+decimalWithoutDot );
		
		var leftmostChar = decimalWithoutDot.substring( 0, 1 );
		var zeroCounter = 0;
		while ( leftmostChar == "0" ) {
			
			zeroCounter++;
			leftmostChar = decimalWithoutDot.substring( zeroCounter, zeroCounter+1 );
			
		}
		
		zerosDirectlyAfterDot = zeroCounter;
		console.log( "zerosDirectlyAfterDot: "+ zerosDirectlyAfterDot );
		
		var gridDistanceString = "0.";
		
		for ( var i = 0; i < zerosDirectlyAfterDot; i++ ) {
			
			gridDistanceString = gridDistanceString + "0";
			
		}
		
		gridDistanceString = gridDistanceString + "1";
		calculatedGridDistance = parseFloat( gridDistanceString );
		
		console.log ( "calculatedGridDistance: "+calculatedGridDistance );
	}
	
	 
	addGrid( calculatedGridDistance, minelevation, xPositionFromNewZero( smallestx ), xPositionFromNewZero( biggestx ),
		yPositionFromNewZero( smallesty ), yPositionFromNewZero( biggesty ) );
 
}




function addGrid( distance, height, xStart, xEnd, yStart, yEnd ) {
	
	var latLonTextSize = 150;
	var pinlength = distance / 2;

	//because the grid shall start at a multiple of the distance-variable -- calculated from
	//the start of the world's-coordiate-system (x=0; y=0)
	//on the x-axis it can start a little bit more left as it would be needed for the oceanGroundMesh
	//on the y-axis the start can be a little bit deeper than needed 
	if ( floatSafeRemainder( xStart, distance ) > 0.0 ) {
		xStart = xStart - floatSafeRemainder( xStart, distance );
	}
	if ( floatSafeRemainder( yStart, distance ) > 0.0 ) {
		yStart = yStart - floatSafeRemainder( yStart, distance );
	}
	if ( floatSafeRemainder( xEnd, distance ) > 0.0 ) {
		xEnd = xEnd + distance - floatSafeRemainder( xEnd, distance );
	}
	if ( floatSafeRemainder( yEnd, distance ) > 0.0 ) {
		yEnd = yEnd + distance - floatSafeRemainder( yEnd, distance );
	}
	
	xStart = makeAFloatSaveCalc( xStart ); 
	yStart = makeAFloatSaveCalc( yStart );  
	xEnd = makeAFloatSaveCalc( xEnd );  
	yEnd = makeAFloatSaveCalc( yEnd );  
	
	drawWhitePlane( xStart, yStart, xEnd, yEnd, height );
	
	//draws the lines on the plane
	var lineBorderMaterial = new THREE.LineBasicMaterial( { color:0x000000 } );
	
	//needed for drawing the last square (the distance is added here, so it matches with xEnd / yEnd)
	var newXEnd = xEnd - distance;
	var newYEnd = yEnd - distance;
	newXEnd = makeAFloatSaveCalc( newXEnd );  
	newYEnd = makeAFloatSaveCalc( newYEnd ); 
	
	yStart = makeAFloatSaveCalc( yStart );
	xStart = makeAFloatSaveCalc( xStart );
	  
	for( var i = xStart; i <= newXEnd; i = makeAFloatSaveCalc( i + distance ) ) {
	
		for ( var j = yStart;  j  <= newYEnd; j = makeAFloatSaveCalc( j+distance ) ) {
		
			i = makeAFloatSaveCalc( i ); 
			j = makeAFloatSaveCalc( j ); 
			
			var iDis = makeAFloatSaveCalc( i+distance );
			var jDis = makeAFloatSaveCalc( j+distance );
			
			var borderGeometry = new THREE.Geometry();
			
			//draws the single squares
			borderGeometry.vertices.push( new THREE.Vector3( i, j, height ) ); 
			borderGeometry.vertices.push( new THREE.Vector3( iDis, j, height ) );		 
			borderGeometry.vertices.push( new THREE.Vector3( iDis, jDis, height ) );
			borderGeometry.vertices.push( new THREE.Vector3( i, jDis, height ) );
			borderGeometry.vertices.push( new THREE.Vector3( i, j, height ) );
			
			var borderLine = new THREE.Line( borderGeometry, lineBorderMaterial );
			lineGroup.add( borderLine );
			borderLine.scale.set( SCALE_VALUE,SCALE_VALUE, 1 );
			
			drawPins( xStart, j, height, xStart-pinlength, j, height );
			 	
		 
		}
		
		 
		drawPins( i, yStart, height, i, yStart-pinlength, height ); 
		
	}
	
	drawPins( xEnd, yStart, height, xEnd, yStart-pinlength, height ); 
		
	drawPins( xStart, yEnd, height, xStart-pinlength, yEnd, height ); 
	  
	drawArrows( xStart, yStart, xEnd, yEnd, height );

	//lable the axes
	makeText( "lon", xEnd, yStart, minelevation, latLonTextSize, "name" );
	makeText( "lat", xStart, yEnd, minelevation, latLonTextSize, "name" );
	lableAxis( distance * 2000, minelevation, pinlength, distance, xStart, xEnd, yStart, yEnd ); 
	 
}

function drawWhitePlane( xStart, yStart, xEnd, yEnd, height ) {
	
	var planeMaterial = new THREE.MeshBasicMaterial( { color:0xffffff } );	
	var planeGeometry = new THREE.Geometry();
	
	planeGeometry.vertices.push( new THREE.Vector3( xStart, yStart, height ) );
	planeGeometry.vertices.push( new THREE.Vector3( xEnd, yStart, height ) );
	planeGeometry.vertices.push( new THREE.Vector3( xEnd, yEnd, height ) );
	planeGeometry.vertices.push( new THREE.Vector3( xStart, yEnd, height ) );
	
	planeGeometry.faces.push( new THREE.Face3( 0, 1, 2 ) );
	planeGeometry.faces.push( new THREE.Face3( 0, 2, 3 ) );
	
	plane = new THREE.Mesh( planeGeometry, planeMaterial );
	scene.add( plane );
	  
	plane.scale.set( SCALE_VALUE,SCALE_VALUE, 1 );
 	
}

function drawArrows( xStart, yStart, xEnd, yEnd, height ) {
	
	var arrowLength = 500;
	var arrowColor = 0x000000;
	var headSize = 50;
	
	var lonDir = new THREE.Vector3( 1, 0, 0  );
	var lonOigin = new THREE.Vector3( xEnd * SCALE_VALUE, yStart * SCALE_VALUE, height );
	var lonArrow = new THREE.ArrowHelper( lonDir, lonOigin, arrowLength, arrowColor, headSize, headSize );
	
	
	var latDir = new THREE.Vector3( 0, 1, 0  );
	var latOrigin = new THREE.Vector3( xStart * SCALE_VALUE, yEnd * SCALE_VALUE, height );
	var latArrow = new THREE.ArrowHelper( latDir, latOrigin, arrowLength, arrowColor, headSize, headSize );
	
	labelingGroup.add( lonArrow );
	labelingGroup.add( latArrow );
	
}


function drawPins ( xStart, yStart, zStart, xEnd, yEnd, zEnd ) {
	
	var lineBorderMaterial = new THREE.LineBasicMaterial( { color:0x000000 } );
	
	var binGeometry = new THREE.Geometry();
		
	binGeometry.vertices.push( new THREE.Vector3( xStart, yStart, zStart ) );
	binGeometry.vertices.push( new THREE.Vector3( xEnd, yEnd, zEnd ) );
	
	var binLine = new THREE.Line( binGeometry, lineBorderMaterial );
	lineGroup.add( binLine );
	binLine.scale.set( SCALE_VALUE, SCALE_VALUE, 1 );
	
}

function lableAxis( size, minelevation, pinlength, distance, xStart, xEnd, yStart, yEnd){
	
	
	//lables for the x-axis / lon-axis
	for ( var i = xStart; i <= xEnd; i = makeAFloatSaveCalc( i+distance ) ) {  
		
		makeText( round( oldXPositionBeforeNewZero( i ), 2 ), i, yStart-pinlength, minelevation, size, "setX" );  
	 
	}
	
	//lables for the y-axis / lat-axis
	for ( var i = yStart; i <= yEnd; i = makeAFloatSaveCalc( i+distance ) ) {  
		
		makeText( round( oldYPositionBeforeNewZero( i ), 2 ), xStart -pinlength, i, minelevation, size, "setY" ); 
		 
		
	}
	 
}


function makeText( content, xPos, yPos, zPos, size, usage ) {
	
	var textMaterial = new THREE.MeshBasicMaterial( { color:0x000000 } );
	var loader = new THREE.FontLoader();
	var textMesh;
	var box;
	
	loader.load( 'libs/helvetiker/helvetiker_bold.typeface.json', function ( font ) {

		var textGeo = new THREE.TextGeometry( content, {

			font: font,
			size: size,
			height: 1 
		 
	});

	
	textMesh = new THREE.Mesh( textGeo, textMaterial );
 
	//to center the position
	//the boxs helps to get the size of the single label 
	box = new THREE.Box3().setFromObject( textMesh );
	//console.log( box.min, box.max, box.size() );
	
	//set the position of the labels
	if ( usage == "setX" ) {
		
		//the "- box.size().x / 2" puts the label in the middle
		//of the pin 
		textMesh.position.x = xPos * SCALE_VALUE - box.size().x / 2;
		textMesh.position.y = yPos * SCALE_VALUE - box.size().y;
		textMesh.position.z = zPos;
		
	}
	
	if ( usage == "setY" ) {
			
		textMesh.position.x = xPos * SCALE_VALUE - box.size().x;
		textMesh.position.y = yPos * SCALE_VALUE - box.size().y / 2;
		textMesh.position.z = zPos;
		
	}
	
	if ( usage == "name" ) {

		textMesh.position.x = xPos * SCALE_VALUE;
		textMesh.position.y = yPos * SCALE_VALUE;
		textMesh.position.z = zPos;
	
	}
	 

	textMesh.castShadow = true;  
	textMesh.receiveShadow = true;

	labelingGroup.add( textMesh );

	} );
 
}
