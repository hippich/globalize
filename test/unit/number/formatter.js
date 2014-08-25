define([
	"cldr",
	"src/number/formatter",
	"json!fixtures/cldr/main/ar/numbers.json",
	"json!fixtures/cldr/main/en/numbers.json",
	"json!fixtures/cldr/main/es/numbers.json",
	"json!fixtures/cldr/supplemental/likelySubtags.json"
], function( Cldr, formatter, arNumbers, enNumbers, esNumbers, likelySubtags ) {

// 1: Earth average diameter according to:
// http://www.wolframalpha.com/input/?i=earth+diameter
var ar, en, es,
	deci = 0.1,
	earthDiameter = 12735, /* 1 */
	pi = 3.14159265359;

Cldr.load( arNumbers );
Cldr.load( enNumbers );
Cldr.load( esNumbers );
Cldr.load( likelySubtags );

ar = new Cldr( "ar" );
en = new Cldr( "en" );
es = new Cldr( "es" );

QUnit.module( "Number Format" );

/**
 *  Integers
 */

QUnit.test( "should formatter integers", function( assert ) {
	assert.equal( formatter( "#0", en )( pi ), "3" );
	assert.equal( formatter( "###0", en )( pi ), "3" );
});

QUnit.test( "should zero-pad minimum integer digits", function( assert ) {
	assert.equal( formatter( "0", en )( pi ), "3" );
	assert.equal( formatter( "00", en )( pi ), "03" );
	assert.equal( formatter( "000", en )( pi ), "003" );
});

QUnit.test( "should not limit the maximum number of digits of integers", function( assert ) {
	assert.equal( formatter( "0", en )( earthDiameter ), "12735" );
	assert.equal( formatter( "00", en )( earthDiameter ), "12735" );
	assert.equal( formatter( "#0", en )( earthDiameter ), "12735" );
});

QUnit.test( "should formatter negative integer", function( assert ) {
	assert.equal( formatter( "0", en )( -earthDiameter ), "-12735" );
	assert.equal( formatter( "0;(0)", en )( -earthDiameter ), "(12735)" );

	// The number of digits, minimal digits, and other characteristics shall be ignored in the negative subpattern.
	assert.equal( formatter( "0;(0.0##)", en )( -earthDiameter ), "(12735)" );
});

/**
 *  Decimals
 */

QUnit.test( "should formatter decimals", function( assert ) {
	assert.equal( formatter( "0.##", en )( pi ), "3.14" );
});

QUnit.test( "should limit maximum fraction digits", function( assert ) {
	assert.equal( formatter( "0.##", en )( pi ), "3.14" );
	assert.equal( formatter( "0.0#", en )( pi ), "3.14" );
	assert.equal( formatter( "0.####", en )( pi ), "3.1416" );
	assert.equal( formatter( "0.##", en )( 0.10004 ), "0.1" );
});

QUnit.test( "should zero-pad minimum fraction digits", function( assert ) {
	assert.equal( formatter( "0.0", en )( earthDiameter ), "12735.0" );
	assert.equal( formatter( "0.00", en )( deci ), "0.10" );
});

QUnit.test( "should localize decimal separator symbol (.)", function( assert ) {
	assert.equal( formatter( "0.##", es )( pi ), "3,14" );
	assert.equal( formatter( "0.##", ar )( pi ), "3٫14" );
});

QUnit.test( "should allow integer and fraction options override", function( assert ) {
	// Overriding minimum integer digits only.
	assert.equal( formatter( "0", en, { minimumIntegerDigits: 2 } )( pi ), "03" );

	// Overriding both fraction options.
	assert.equal( formatter( "0.##", en, {
		maximumFractionDigits: 5,
		minimumFractionDigits: 3
	} )( pi ), "3.14159" );
	assert.equal( formatter( "0.##", en, {
		maximumFractionDigits: 5,
		minimumFractionDigits: 3
	} )( 0.1 ), "0.100" );

	// Overriding maximum fraction digits only.
	assert.equal( formatter( "0.##", en, { maximumFractionDigits: 0 } )( pi ), "3" );
	assert.equal( formatter( "0.##", en, { maximumFractionDigits: 1 } )( pi ), "3.1" );
	assert.equal( formatter( "0.##", en, { maximumFractionDigits: 3 } )( pi ), "3.142" );
	assert.equal( formatter( "0.##", en, { maximumFractionDigits: 1 } )( 0.01 ), "0" );
	assert.equal( formatter( "0.0#", en, { maximumFractionDigits: 1 } )( 0.01 ), "0.0" );

	// Sanity normalization: minimumFractionDigits = min( minimumFractionDigits, maximumFractionDigits )
	assert.equal( formatter( "0.0000", en, { maximumFractionDigits: 2 } )( 0.1 ), "0.10" );

	// Overriding minimum fraction digits only.
	assert.equal( formatter( "0.00", en, { minimumFractionDigits: 0 } )( 1 ), "1" );
	assert.equal( formatter( "0.00", en, { minimumFractionDigits: 0 } )( 0.1 ), "0.1" );
	assert.equal( formatter( "0.00", en, { minimumFractionDigits: 0 } )( 0.001 ), "0" );
	assert.equal( formatter( "0.##", en, { minimumFractionDigits: 2 } )( 0.1 ), "0.10" );

	// Sanity normalization: maximumFractionDigits = max( minimumFractionDigits, maximumFractionDigits ).
	assert.equal( formatter( "0.##", en, { minimumFractionDigits: 5 } )( pi ), "3.14159" );

	// Overriding both minimum and maximum fraction digits.
	assert.equal( formatter( "0.##", en, {
		minimumFractionDigits: 1,
		maximumFractionDigits: 4
	})( pi ), "3.1416" );
	assert.equal( formatter( "0.##", en, {
		minimumIntegerDigits: 2,
		maximumFractionDigits: 3
	})( pi ), "03.142" );

	// Overriding both integer and fraction options.
	assert.equal( formatter( "0.##", en, {
		minimumIntegerDigits: 2,
		minimumFractionDigits: 3
	})( 1.1 ), "01.100" );
	assert.equal( formatter( "0.##", en, {
		minimumIntegerDigits: 2,
		maximumFractionDigits: 3
	})( 1.1 ), "01.1" );
});

QUnit.test( "should allow rounding", function( assert ) {
	assert.equal( formatter( "0.10", en )( pi ), "3.10" );
	assert.equal( formatter( "0.20", en )( pi ), "3.20" );
	assert.equal( formatter( "0.5", en )( pi ), "3.0" );
	assert.equal( formatter( "0.1", en )( pi ), "3.1" );
});

QUnit.test( "should allow different rounding options", function( assert ) {
	assert.equal( formatter( "0.##", en, { round: "ceil" } )( pi ), "3.15" );
	assert.equal( formatter( "0.##", en, { round: "floor"} )( pi ), "3.14" );
	assert.equal( formatter( "0.##", en, { round: "round" } )( pi ), "3.14" );
	assert.equal( formatter( "0.##", en, { round: "truncate"} )( pi ), "3.14" );
	assert.equal( formatter( "0.####", en, { round: "ceil" } )( pi ), "3.1416" );
	assert.equal( formatter( "0.####", en, { round: "floor"} )( pi ), "3.1415" );
	assert.equal( formatter( "0.####", en, { round: "round" } )( pi ), "3.1416" );
	assert.equal( formatter( "0.####", en, { round: "truncate"} )( pi ), "3.1415" );
	assert.equal( formatter( "0.##", en, { round: "ceil" } )( -pi ), "-3.14" );
	assert.equal( formatter( "0.##", en, { round: "floor"} )( -pi ), "-3.15" );
	assert.equal( formatter( "0.##", en, { round: "round" } )( -pi ), "-3.14" );
	assert.equal( formatter( "0.##", en, { round: "truncate"} )( -pi ), "-3.14" );
	assert.equal( formatter( "0.####", en, { round: "ceil" } )( -pi ), "-3.1415" );
	assert.equal( formatter( "0.####", en, { round: "floor"} )( -pi ), "-3.1416" );
	assert.equal( formatter( "0.####", en, { round: "round" } )( -pi ), "-3.1416" );
	assert.equal( formatter( "0.####", en, { round: "truncate"} )( -pi ), "-3.1415" );
});

QUnit.test( "should formatter significant digits", function( assert ) {
	assert.equal( formatter( "@@@", en )( 123 ), "123" );
	assert.equal( formatter( "@@@", en )( 12345 ), "12300" );
	assert.equal( formatter( "@@#", en )( 12345 ), "12300" );
	assert.equal( formatter( "@##", en )( 12345 ), "12300" );
	assert.equal( formatter( "@@", en )( pi ), "3.1" );
	assert.equal( formatter( "@@#", en )( pi ), "3.14" );
	assert.equal( formatter( "@@##", en )( pi ), "3.142" );
	assert.equal( formatter( "@####", en )( pi ), "3.1416" );
	assert.equal( formatter( "@@", en )( 0.10004 ), "0.10" );
	assert.equal( formatter( "@##", en )( 0.10004 ), "0.1" );
	assert.equal( formatter( "@@@", en )( 0.12345 ), "0.123" );
	assert.equal( formatter( "@@##", en )( 1.23004 ), "1.23" );
});

QUnit.test( "should formatter negative decimal", function( assert ) {
	assert.equal( formatter( "0.##", en )( -pi ), "-3.14" );
	assert.equal( formatter( "0.##;(0.##)", en )( -pi ), "(3.14)" );
	assert.equal( formatter( "@@#", en )( -pi ), "-3.14" );
	assert.equal( formatter( "@@#;(@@#)", en )( -pi ), "(3.14)" );

	// The number of digits, minimal digits, and other characteristics shall be ignored in the negative subpattern.
	assert.equal( formatter( "0.##;(0)", en )( -pi ), "(3.14)" );
	assert.equal( formatter( "@@#;(0)", en )( -pi ), "(3.14)" );
});

/**
 *  Grouping separators
 */

QUnit.test( "should formatter grouping separators", function( assert ) {
	assert.equal( formatter( "#,##0.#", en )( earthDiameter ), "12,735" );
	assert.equal( formatter( "#,#,#0.#", en )( earthDiameter ), "1,2,7,35" );
	assert.equal( formatter( "#,##,###,###0", en )( 123456789 ), "12,345,6789" );
	assert.equal( formatter( "###,###,###0", en )( 123456789 ), "12,345,6789" );
	assert.equal( formatter( "##,#,###,###0", en )( 123456789 ), "12,345,6789" );
});

/**
 *  Percent
 */

QUnit.test( "should formatter percent", function( assert ) {
	assert.equal( formatter( "0%", en )( 0.01 ), "1%" );
	assert.equal( formatter( "00%", en )( 0.01 ), "01%" );
	assert.equal( formatter( "0%", en )( 0.1 ), "10%" );
	assert.equal( formatter( "#0%", en )( 0.5 ), "50%" );
	assert.equal( formatter( "0%", en )( 1 ), "100%" );
	assert.equal( formatter( "##0.#%", en )( 0.005 ), "0.5%" );
	assert.equal( formatter( "##0.#%", en )( 0.005 ), "0.5%" );
});

QUnit.test( "should localize percent symbol (%)", function( assert ) {
	assert.equal( formatter( "#0%", ar )( 0.5 ), "50٪" );
});

QUnit.test( "should formatter negative percentage", function( assert ) {
	assert.equal( formatter( "0%", en )( -0.1 ), "-10%" );
	assert.equal( formatter( "0%;(0%)", en )( -0.1 ), "(10%)" );
	assert.equal( formatter( "0%;(0)%", en )( -0.1 ), "(10)%" );
});

/**
 *  Per mille
 */

QUnit.test( "should formatter per mille", function( assert ) {
	assert.equal( formatter( "0\u2030", en )( 0.001 ), "1\u2030" );
	assert.equal( formatter( "00\u2030", en )( 0.001 ), "01\u2030" );
	assert.equal( formatter( "0\u2030", en )( 0.01 ), "10\u2030" );
	assert.equal( formatter( "0\u2030", en )( 0.1 ), "100\u2030" );
	assert.equal( formatter( "#0\u2030", en )( 0.5 ), "500\u2030" );
	assert.equal( formatter( "0\u2030", en )( 1 ), "1000\u2030" );
	assert.equal( formatter( "##0.#\u2030", en )( 0.0005 ), "0.5\u2030" );
	assert.equal( formatter( "##0.#\u2030", en )( 0.0005 ), "0.5\u2030" );
	assert.equal( formatter( "#0‰", en )( 0.5 ), "500\u2030" );
	assert.equal( formatter( "#0‰", en )( 0.5 ), "500‰" );
});

QUnit.test( "should localize per mille symbol (\u2030)", function( assert ) {
	assert.equal( formatter( "#0\u2030", ar )( 0.5 ), "500؉" );
});

QUnit.test( "should formatter negative mille", function( assert ) {
	assert.equal( formatter( "0\u2030", en )( -0.001 ), "-1\u2030" );
	assert.equal( formatter( "0\u2030;(0\u2030)", en )( -0.001 ), "(1\u2030)" );
	assert.equal( formatter( "0\u2030;(0)\u2030", en )( -0.001 ), "(1)\u2030" );
});

/**
 *  Infinity
 */

QUnit.test( "should formatter infinite numbers", function( assert ) {
	assert.equal( formatter( "0", en )( Math.pow(2, 2000) ), "∞" );
	assert.equal( formatter( "0", en )( Math.pow(-2, 2001) ), "-∞" );
});

/**
 *  NaN
 */

QUnit.test( "should formatter infinite numbers", function( assert ) {
	assert.equal( formatter( "0", en )( NaN ), "NaN" );
});

});
