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

function loadLut() {
	 
	var minelevationRound = roundToUnderneathHundreds( minelevation );
	var maxelevationRound = roundToOverlyingHundreds( maxelevation );
	var lutRender;
	var lutColors = [];

	lut = new THREE.Lut( 'rainbow', 512 );

	lut.setMax( maxelevationRound );
	lut.setMin( minelevationRound );

	legend = lut.setLegendOn( { 'layout':'vertical', 'position': { 'x': 0.3, 'y': 0, 'z': 0 },  'fontsize':300 } );
 
	lutScene.add( legend );
	lutCamera.position.z = 2.8;
	
	lutRender = function () {
	  requestAnimationFrame( lutRender ); 
	  lutRenderer.render( lutScene, lutCamera );
	};
	
	  

	labels = lut.setLegendLabels( { 'title': 'Height', 'um': 'm', 'ticks': 5 } );

	lutScene.add ( labels['title'] );
 
	for ( var i = 0; i < Object.keys( labels[ 'ticks' ] ).length; i++ ) {

		lutScene.add ( labels[ 'ticks' ][ i ] );
		lutScene.add ( labels[ 'lines' ][ i ] );
		 

	}
	
	lutRender();

}

function hideOrShowLut() {
	
	if ( document.getElementById( 'oceanFloorVisibleCheckbox' ).checked ) {
		
		legend.visible = true;
		labels['title'].visible = true;
		for ( var i = 0; i < Object.keys( labels[ 'ticks' ] ).length; i++ ) {

			labels[ 'ticks' ][ i ].visible = true;
			labels[ 'lines' ][ i ].visible = true;
		 
	
		}
	}
	
	else {
		
		legend.visible = false;
		labels[ 'title' ].visible = false;
		for ( var i = 0; i < Object.keys( labels[ 'ticks' ] ).length; i++ ) {

			labels[ 'ticks' ][ i ].visible = false;
			labels[ 'lines' ][ i ].visible = false;
		 
	
		}
		
		
	}
	 
	
}