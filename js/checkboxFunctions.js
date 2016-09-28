function colorGradientOnArrowsCheck() {
	
	for( var i = 0; i < stationsOfCurrentRegionList.length; i++ ) {
			
		stationsOfCurrentRegionList[ i ].colorizeMarks( document.getElementById( 'colorGradientOnArrowsCheckbox' ).checked );
			 
	}
}

function arrowsVisibleCheck() {
	
	for( var i = 0; i < stationsOfCurrentRegionList.length; i++ ) {
			
		stationsOfCurrentRegionList[ i ].showOrHideArrows( document.getElementById( 'arrowsVisibleCheckbox' ).checked );
		
	}
	
	if ( document.getElementById( 'arrowsVisibleCheckbox' ).checked ) {
		
		scaleArrow.visible = true;
	}
	
	else {
		
		scaleArrow.visible = false;
		
	}
	   
}

function oceanFloorVisibleCheck() {
	
	if ( document.getElementById( 'oceanFloorVisibleCheckbox' ).checked ) {
		
		oceanFloorMesh.visible = true;
	}
	
	else {
		
		oceanFloorMesh.visible = false;
		
	}
	hideOrShowLut();
 
}
 

function stationsVisibleCheck() {
	
	if ( document.getElementById( 'stationsVisibleCheckbox' ).checked ) {
		
		for( var i = 0; i < stationsOfCurrentRegionList.length; i++ ) {
			
			stationsOfCurrentRegionList[ i ].makeVisible(); 
		}
		
		 
	}
	
	else {
		
		for( var i = 0; i < stationsOfCurrentRegionList.length; i++ ) {
			
			stationsOfCurrentRegionList[ i ].makeTransparent();
			 
		}
				
	}
	
	
}