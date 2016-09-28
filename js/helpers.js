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



//e shifts the var value to the right, when decimals is positive
//and to the left, when decimals is negative 
//the absolute value of decimals says how often the var value is shifted
function round( value, decimals ) {
	return Number(Math.round( value+'e'+decimals)+'e-'+decimals );
}

function makeAFloatSaveCalc( value ) {
	
	return round ( value, 7 );
	
}

function roundToUnderneathHundreds( value ) {

	if ( value < 0 ) {
	
		value = value * -1;
		value = Math.ceil( value/100 )*100;
		value = value * -1;
		return value; 
 
	}
	
	else {
	
		return Math.floor( value/100 )*100;
	}

}

function roundToOverlyingHundreds( value ) {

	if ( value < 0 ) {
	
		value = value * -1;
		value = Math.floor( value/100 )*100;
		value = value * -1;
		return value; 
	
	}
	
	else {
	
		return Math.ceil( value/100 )*100;
	}

}

function floatSafeRemainder( dividend, divisor ){
	
	if ( dividend  === 0 ) {
		
		return divisor;
		
	}
	
	else {
		
		var lengthAfterDecimalPointInDividend = ( dividend.toString().split( '.' )[ 1 ] || '' ).length;
		var lengthAfterDecimalPointInDivisor = ( divisor.toString().split( '.' )[ 1 ] || '' ).length;
		
		var biggestLengthAfterDecimalPoint = lengthAfterDecimalPointInDividend > lengthAfterDecimalPointInDivisor? 
			lengthAfterDecimalPointInDividend : lengthAfterDecimalPointInDivisor;
			
		var dividendWithoutFloatingPointAndEqualLength = parseInt( dividend.toFixed( biggestLengthAfterDecimalPoint ).replace( '.','' ) );
		var divisorWithoutFloatingPointAndEqualLength = parseInt( divisor.toFixed( biggestLengthAfterDecimalPoint ).replace( '.','' ) );
		
		var remainder = ( dividendWithoutFloatingPointAndEqualLength % divisorWithoutFloatingPointAndEqualLength ) / 
			Math.pow( 10, biggestLengthAfterDecimalPoint );
			
		return ( remainder );
	}
}

function MSInS( valInMS ) {
	
	return valInMS/1000;
}

function deleteDoubleEntries( inputArray ) {
	
    var existingEntries = {};
    var arrayWithoutDoubleEntries = [];
	
    for ( var i = 0; i < inputArray.length; i++ ) {
		
        if ( !( inputArray[ i ] in existingEntries ) ) {
			
            arrayWithoutDoubleEntries.push( inputArray[ i ] );
            existingEntries[ inputArray[ i ] ] = true;
        }
    }
	
    return arrayWithoutDoubleEntries;

}