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

function testOceanFloorPosition ( e ) {
 
	mouse_x = (event.clientX / window.innerWidth) * 2 - 1;
	mouse_y = -(event.clientY / (window.innerHeight + document.getElementById('maincontainer').clientHeight) )* 2 + 1;    
	 
	vector = new THREE.Vector3(mouse_x,  mouse_y, 0.5);
	vector = vector.unproject( camera);
	raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
	var intersects = raycaster.intersectObjects([oceanFloorMesh]);
	if (intersects.length > 0) {
		if (showRay) {
			var points = [];
			points.push(new THREE.Vector3(0, 0, 0));
			points.push(intersects[0].point);

			var mat = new THREE.MeshNormalMaterial( );
			var tubeGeometry = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 10, 3);

			if (tube) {
				scene.remove(tube)
			};

			tube = new THREE.Mesh(tubeGeometry, mat);
			scene.add(tube);
		}
		
		//intersects[ 0 ].object.material.transparent = true;
		//intersects[ 0 ].object.material.opacity = 0.1;
		var faceIndices;
		if (intersects[ 0 ].face != null) {
			faceIndices = [ intersects[ 0 ].face.a, intersects[ 0 ].face.b, intersects[ 0 ].face.c ];
		} else if (intersects[ 0 ].indices != null) {
			faceIndices = intersects[ 0 ].indices
		}

		coorData = "Lon: " + lon[vertices[faces[faceIndices[0]/ 3][0]][0]] + "\nLat: " + lat[vertices[faces[faceIndices[0]/ 3][0]][1]]
			+ "\nDepth: " + vertices[faces[faceIndices[0]/ 3][0]][2] ; 
		
	} else {
		coorData = "No Ground!"
		if (tube) {scene.remove(tube)};
	}
 
	
}

function showOceanFloorPosition ( e ) {

	// A
	if ( e.keyCode == 65 ) {
		 
		 alert(coorData);

	}
	
}

function testMainValues( region ) {
	
	console.log("smallesty == "+smallesty);
	console.log("smallestx == "+smallestx);
	console.log("biggestx == "+biggestx);
	console.log("biggesty == "+biggesty);
	console.log("minelevation == "+minelevation);
	console.log("maxelevation == "+maxelevation);
	
	if (region == "northern-norway") {
		
		if (smallesty == 70.2082136 && smallestx == 22.365787 && biggestx == 22.8417745 && biggesty == 70.2928622 && minelevation == -498.6000061035156
			&& maxelevation == -25.600000381469727 ) {
			
			console.log("correct data for "+region);
			
			
		}
		
		else {
			
			console.log("incorrect data for "+region);
			
		}
	 	
	}
	 
}

function printDates () {
	
	
	/*alert(new Date('1970-01-01 00:00:01').getDate()); //1
	alert(new Date('1970-01-01 01:00:00').getTime()); //0
	alert(new Date('1970-01-01 01:00:01').getTime()); //1000
	alert(new Date('1970-01-01T00:00:00Z').getTime()) //0
	alert(new Date('1970-01-01T00:00:01Z').getTime()) //1000
	alert(new Date('1970-01-02T00:00:00Z').getTime()) //86400000 = 24 h
	var d = new Date('1970-01-01T00:00:00Z');
	alert( d.setSeconds(d.getSeconds() + 1) ); // 1000*/
	//////
	var now = new Date('1970-01-02T00:00:00Z').getTime();
	var now_utc = new Date(now).toISOString();
	alert(now_utc);
	
	
}

function testMinAndMaxOfSlider(treference, num) {
	
	for (var i = 0; i < stations.length; i++ ) {
		
		var treference = new Date(stations[i].t_reference);
		
		console.log( stations[i].station + " Minimum Slider: "+( (sliderMin-treference) / 1000 ) );
		console.log( stations[i].station + " Maximum Slider: "+( (sliderMax-treference) / 1000 ) );
	
		
	}
	
	
	
}

function testVectorData(arrowGroup) {
	
	for (var i = 0; i < arrowGroup.children.length; i++) {
		
		console.log( "Arrow "+i+": Height: "+arrowGroup.children[i].position.z+" Magnitude "+i+": "+arrowGroup.children[i].name);
	}
	  
	
}

function testFloatSaveRemainder () {
	
	console.log(floatSafeRemainder(5, 5) + " == 0");
	console.log(floatSafeRemainder(5, 3) + " == 2");
	console.log(floatSafeRemainder(5.0, 3) + " == 2");
	console.log(floatSafeRemainder(5, 3.0) + " == 2");
	console.log(floatSafeRemainder(5.0, 3.0) + " == 2");
	console.log(floatSafeRemainder(5.5, 3.0) + " == 2.5");
	console.log(floatSafeRemainder(5.5, 3.5) + " == 2");
	console.log(floatSafeRemainder(5.555555, 3.5) + " == 2.055555");
	console.log(floatSafeRemainder(5.555555, 3.5000005) + " == 2.0555545");  
	console.log(floatSafeRemainder(5.555555, 3.500005) + " == 2.05555");
	console.log(floatSafeRemainder(0.0, 3.500005) + " == 3.500005");
	console.log(floatSafeRemainder(0, 3.500005) + " == 3.500005");
	console.log(floatSafeRemainder(0.00000000, 3.500005) + " == 3.500005");
	console.log(floatSafeRemainder(-5.555555, 3.500005) + " == -2.05555");
	console.log(floatSafeRemainder(-5.555555, -3.500005) + " == -2.05555");
	console.log(floatSafeRemainder(5.555555, -3.500005) + " == 2.05555");
	
}
