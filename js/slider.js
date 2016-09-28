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

function loadSlider() {
		 
	var minSpeedSlider = 500;
	var stepWidthSpeedSlider = 500;
	var maxSpeedSlider = 10000;
	var initValSpeedSlider = 3000;
	
	
	//init slider
	var timeSlider = $( '#timeSlider' ).slider( {
		formatter: function( value ) {
			
			var valUtc = new Date( value ).toISOString();
			return valUtc;
		},
				 
	});
	 			
	
	var speedSlider = $( '#speedSlider' ).slider( {
		formatter: function( value ) {
			
			return MSInS( value )+" seconds";
			 
		},
		
				 
	});
	
	//the speedSlider is the same for all regions -> init its values in this function 
	$( "#speedSlider" ).slider( 'setAttribute', 'max', maxSpeedSlider ); 
	$( "#speedSlider" ).slider( 'setAttribute', 'min', minSpeedSlider ); 
	$( "#speedSlider" ).slider( 'setAttribute', 'step', stepWidthSpeedSlider ); 
	$( "#speedSlider" ).slider( 'refresh' );
	
	speedSlider.data( 'slider' ).setValue( initValSpeedSlider );
	
	whatTheTimeSliderDoes();
	whatTheSpeedSliderDoes();
	 
}

function whatTheTimeSliderDoes() {
	
	var timeSlider = $( '#timeSlider' ).slider();
	var originalTimeVal;
	
	timeSlider.slider().on( 'slideStart', function( ev ){
		originalTimeVal = timeSlider.data( 'slider' ).getValue();
	});

	timeSlider.on( 'slideStop', function( ev ){
		var timeValue = timeSlider.data( 'slider' ).getValue();
		var arrowCounter = 0;
		if( originalTimeVal != timeValue ) {
			console.log ( timeValue );
 
			moveArrows( stationsOfCurrentRegionList[ 0 ], timeValue, arrowCounter );
			//at every movement of slider the arrows get visible if hided before 
			document.getElementById( 'arrowsVisibleCheckbox' ).checked = true;
			scaleArrow.visible = true;

		}
	
	});
	
	
}

function whatTheSpeedSliderDoes() {
	
	var speedSlider = $( '#speedSlider' ).slider();
	
	var originalSpeedVal;
	
	speedSlider.slider().on( 'slideStart', function( ev ){
		originalSpeedVal = speedSlider.data( 'slider' ).getValue();
	});

	speedSlider.on( 'slideStop', function(ev){
		var speedValue = speedSlider.data( 'slider' ).getValue();
		if( originalSpeedVal != speedValue ) {
			 
			var timeIntervalTillAutoplayMovement = speedValue; 
			console.log( timeIntervalTillAutoplayMovement+" new" );
		  
			AutoplayNS.resetPlay( timeIntervalTillAutoplayMovement );
			 
	 
		}
	});
	
	
}




//a recursive function to find the min and max for the slider
function getMinAndMaxForSliderAndTimestamps( station, stationCounter, sliderMins, sliderMaxs ) {
	
	$.when(
	
		$.ajax({
			url: "http://maui.se.informatik.uni-kiel.de:9090/timeseries/adcp/"+station.station+"/dirmag/"+station.depth+"/"+station.adcpDirection+"/timestamps",
			async: true,
			success:function( data ){
				
				stationCounter++;
				var d = new Date( station.t_reference );
				var d2 = new Date( station.t_reference );
				var minD = d.setSeconds( d.getSeconds() + data.timestamps[ 0 ] ); //the smallest time-value -- calculated with the offset
				var maxD = d2.setSeconds( d2.getSeconds() + data.timestamps[ data.timestamps.length-1 ] ); //the highest val
				sliderMins.push( minD );
				sliderMaxs.push( maxD );
				
				
				//listOfAllTimestamps needed for autoplay 
				for ( var i = 0; i < data.timestamps.length; i++ ) {
					
					var d3 = new Date( station.t_reference );
					var timeWithOffsetFromStation = d3.setSeconds( d3.getSeconds() + data.timestamps[ i ] );
					listOfAllTimestamps.push( timeWithOffsetFromStation );
					 
				}
				
			}
		}) 
	).then( function(){
		
		
		if ( stationCounter < stations.length ) {
			getMinAndMaxForSliderAndTimestamps( stations[ stationCounter ], stationCounter, sliderMins, sliderMaxs );
		} 
		else {
					
			//sorts the list with the timestamps in ascending order 
			listOfAllTimestamps.sort(function(a, b){ return a-b; } );
			
			//remove duplicates 
			listOfAllTimestamps = deleteDoubleEntries( listOfAllTimestamps );
		 
			//set min and max of slider 
			var sliderMin = sliderMins[ 0 ];
			var sliderMax = sliderMaxs[ 0 ];
			
			for ( var i = 1; i < sliderMins.length; i++ ) {
	
				if( sliderMins[ i ] < sliderMin ) {
					sliderMin = sliderMins[ i ];
				
				}
			}
			
			for ( var i = 1; i < sliderMaxs.length; i++ ) {
			
				if( sliderMaxs[ i ] > sliderMax ) {
					sliderMax = sliderMaxs[ i ];
				}
			}
			
			var changeTimeSlider = $( '#timeSlider' ).slider( { tooltip: "always" } );
			
			$( "#timeSlider" ).slider( 'setAttribute', 'max', sliderMax );
			$( "#timeSlider" ).slider( 'setAttribute', 'min', sliderMin );
			
			$( "#timeSlider" ).slider( 'refresh' );
			 
			changeTimeSlider.data( 'slider' ).setValue( sliderMin ); 
			moveArrows( stationsOfCurrentRegionList[0], sliderMin, 0 );
			
					
		}
		}
	);
	 
}

 
//Autoplay-Namespace
var AutoplayNS = AutoplayNS || {};

AutoplayNS.autoplayIndex = 0;

AutoplayNS.autoplay = false;

AutoplayNS.clearPlay = function ( ) {
	clearInterval( AutoplayNS.playButtonActivated );
	AutoplayNS.autoplay = false;
};

AutoplayNS.resetPlay = function ( timeIntervalTillAutoplayMovement ) {
	
	if ( AutoplayNS.autoplay ) {
		clearInterval( AutoplayNS.playButtonActivated );
		AutoplayNS.playButtonActivated = setInterval( AutoplayNS.play, timeIntervalTillAutoplayMovement );	
		console.log( timeIntervalTillAutoplayMovement+" setted" );
	}
};

AutoplayNS.incNumberOfMovedArrowDirections = function(){
	
	AutoplayNS.numberOfMovedArrowDirections++;
	
};

AutoplayNS.resetNumberOfMovedArrowDirections = function (){
	
	AutoplayNS.numberOfMovedArrowDirections=0;
	
};

AutoplayNS.play = function () {
	
	var changeSpeedSlider = $( '#speedSlider' ).slider();		
	var arrowCounter = 0;
	var firstStation = stationsOfCurrentRegionList[ 0 ];
	var changeTimeSlider = $( '#timeSlider' ).slider();  
	var currentValue =  changeTimeSlider.slider( 'getValue' );
	
	console.log( numberOfStationDirections );
	console.log( AutoplayNS.numberOfMovedArrowDirections+" numberOfMovedArrowDirections" );
		
	//no reset of the slider 
	while ( currentValue >= listOfAllTimestamps[ AutoplayNS.autoplayIndex ] ) {
		
		AutoplayNS.autoplayIndex++;
	}
	
	if ( AutoplayNS.numberOfMovedArrowDirections >= numberOfStationDirections && AutoplayNS.autoplayIndex < listOfAllTimestamps.length ) {
		
		var value = listOfAllTimestamps[ AutoplayNS.autoplayIndex ];
		changeTimeSlider.slider( 'setValue', value );
		
		console.log( value );
			
		moveArrows( firstStation, value, arrowCounter );
		 
		AutoplayNS.numberOfMovedArrowDirections = 0;
		AutoplayNS.autoplayIndex++;
	
	}
	  
};

AutoplayNS.resetIndex = function () {
	
	AutoplayNS.autoplayIndex = 0;
	 
};

AutoplayNS.createPlayButton = function () {
	
	var changeSpeedSlider = $( '#speedSlider' ).slider();
	  
	var playButton = document.getElementById( 'playButton' );
	playButton.onclick = function() {
		
		AutoplayNS.resetIndex();	
		AutoplayNS.autoplay = !AutoplayNS.autoplay;
		console.log( "autoplay: "+AutoplayNS.autoplay );
		
		//set at active state and back (so user can see if autoplay is activated)
		if ( AutoplayNS.autoplay ) {
			
			$( '#timeSlider' ).slider( 'disable' );  
			var timeIntervalTillAutoplayMovement = changeSpeedSlider.data( 'slider' ).getValue();
			playButton.className = "btn btn-primary oceanteaSelectionBtn active";
			AutoplayNS.playButtonActivated = setInterval( AutoplayNS.play, timeIntervalTillAutoplayMovement );
			console.log( timeIntervalTillAutoplayMovement+ "Time at Autoplaystart" );
		}
		
		else {
			
			playButton.className = "btn btn-primary oceanteaSelectionBtn";
			clearInterval( AutoplayNS.playButtonActivated );
			$( '#timeSlider' ).slider( 'enable' );
			 
		}
	  	
		
	};
	
	
};

//Moves the arrows (up- and down-direction) of a single station with the data from server 
function moveArrows( station, uniTime, arrowCounter ) {
	
	//var sendDate = (new Date()).getTime(); Test time till serveranswer
	document.getElementById( 'arrowsVisibleCheckbox' ).disabled = true;
	//because arrowas get visible with the movement 
	document.getElementById( 'arrowsVisibleCheckbox' ).checked = true;
	scaleArrow.visible = true;
	
	var upLoad = null;
	var downLoad = null;
	var d = new Date( station.t_reference );
	var stationTime = MSInS( uniTime - d.getTime() );  
				  
	if ( station.nUpBins > 0 ) {
		upLoad = $.ajax( {
			url: "http://maui.se.informatik.uni-kiel.de:9090/timeseries/adcp/"+station.station+"/dirmag/"+station.depth+"/up/"+stationTime,
			async: true,
			success:function( data ){
			
				station.moveUpArrows( data.magnitudes, data.directions, document.getElementById( 'colorGradientOnArrowsCheckbox' ).checked);
				//var receiveDate = (new Date()).getTime(); Test time till serveranswer
				//var responseTimeMs = receiveDate - sendDate; Test time till serveranswer
				//alert(responseTimeMs / 1000 + " seconds till server answered"); Test time till serveranswer
				console.log ("Time: "+station.station+" up "+stationTime); 
				
		}});
	}
	if ( station.nDownBins > 0 ) {
		downLoad = $.ajax( {
			url: "http://maui.se.informatik.uni-kiel.de:9090/timeseries/adcp/"+station.station+"/dirmag/"+station.depth+"/down/"+stationTime,
			async: true,
			success: function( data ) {
			
				station.moveDownArrows( data.magnitudes, data.directions, document.getElementById( 'colorGradientOnArrowsCheckbox' ).checked );
				console.log ( "Time: "+station.station+" down "+stationTime );  
			}
		});
		
	}
	
	$.when(
		upLoad,
		downLoad
	 			
	).then( function(){
		
		arrowCounter++;
		
		//here both directions (if existent) have moved
		if ( station.nDownBins > 0 ) {
			AutoplayNS.incNumberOfMovedArrowDirections();
		}
		if ( station.nUpBins > 0 ) {
			AutoplayNS.incNumberOfMovedArrowDirections();
		}
		
		if ( arrowCounter < stationsOfCurrentRegionList.length ) {
			
			moveArrows( stationsOfCurrentRegionList[arrowCounter], uniTime, arrowCounter );
		}
		
		if ( arrowCounter >= stationsOfCurrentRegionList.length ){
			
			document.getElementById( 'arrowsVisibleCheckbox' ).disabled = false;
		}
			
		}
	);
	
 	
}