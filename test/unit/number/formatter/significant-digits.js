define([
	"src/number/formatter/significant-digits",
	"src/util/number/round"
], function( significantDigits, round ) {

var ceil = round( "ceil" ),
	deci = 0.1,
	floor = round( "floor" ),
	pi = 3.14159265359,
	truncate = round( "truncate" );

round = round( "round" ),

QUnit.module( "Number Significant Format" );

QUnit.test( "should zero-pad minimum significant figures", function( assert ) {
	assert.equal( significantDigits( deci, 3, 3, round ), "0.100" );
});

QUnit.test( "should limit maximum significant figures", function( assert ) {
	assert.equal( significantDigits( 123, 3, 3, round ), "123" );
	assert.equal( significantDigits( 12345, 3, 3, round ), "12300" );
	assert.equal( significantDigits( pi, 2, 2, round ), "3.1" );
	assert.equal( significantDigits( pi, 2, 3, round ), "3.14" );
	assert.equal( significantDigits( pi, 2, 4, round ), "3.142" );
	assert.equal( significantDigits( pi, 1, 5, round ), "3.1416" );
	assert.equal( significantDigits( 0.10004, 2, 2, round ), "0.10" );
	assert.equal( significantDigits( 0.12345, 3, 3, round ), "0.123" );
	assert.equal( significantDigits( 0.012345, 3, 3, round ), "0.0123" );
});

QUnit.test( "should allow different round options", function( assert ) {
	assert.equal( significantDigits( 0.12345, 3, 3, ceil ), "0.124" );
	assert.equal( significantDigits( 0.12345, 3, 3, floor ), "0.123" );
	assert.equal( significantDigits( 0.12345, 3, 3, truncate ), "0.123" );
	assert.equal( significantDigits( -0.12345, 3, 3, ceil ), "-0.123" );
	assert.equal( significantDigits( -0.12345, 3, 3, floor ), "-0.124" );
	assert.equal( significantDigits( -0.12345, 3, 3, truncate ), "-0.123" );
});

});
