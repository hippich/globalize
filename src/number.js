define([
	"./core",
	"./common/validate/cldr",
	"./common/validate/default-locale",
	"./common/validate/presence",
	"./common/validate/type/number",
	"./common/validate/type/plain-object",
	"./common/validate/type/string",
	"./number/formatter",
	"./number/parse",
	"./number/pattern",
	"cldr/event"
], function( Globalize, validateCldr, validateDefaultLocale, validatePresence, validateTypeNumber, validateTypePlainObject, validateTypeString, numberFormatter, numberParse, numberPattern ) {

/**
 * .formatNumber( value, attributes )
 *
 * @value [Number] number to be formatted.
 *
 * @attributes [Object]: see .numberFormatter().
 *
 * Format a number according to the given attributes and default/instance locale.
 */
Globalize.formatNumber =
Globalize.prototype.formatNumber = function( value, attributes ) {
	var formatter;

	validatePresence( value, "value" );
	validateTypeNumber( value, "value" );

	formatter = this.numberFormatter( attributes );

	return formatter( value );
};

/**
 * .numberFormatter( attributes )
 *
 * @attributes [Object]:
 * - style: [String] "decimal" (default) or "percent".
 * - see also number/format options.
 *
 * Return the number formatter according to the given attributes and default/instance locale.
 */
Globalize.numberFormatter =
Globalize.prototype.numberFormatter = function( attributes ) {
	var cldr, pattern, ret;

	validateTypePlainObject( attributes, "attributes" );

	attributes = attributes || {};
	cldr = this.cldr;

	validateDefaultLocale( cldr );

	cldr.on( "get", validateCldr );

	if ( !attributes.pattern ) {
		pattern = numberPattern( attributes.style || "decimal", cldr );
	}

	ret = numberFormatter( pattern, cldr, attributes );

	cldr.off( "get", validateCldr );

	return ret;
};

/**
 * .parseNumber( value )
 *
 * @value [String]
 *
 * Return the parsed Number (including Infinity) or NaN when value is invalid.
 */
Globalize.parseNumber =
Globalize.prototype.parseNumber = function( value ) {
	var cldr, pattern, ret;

	validatePresence( value, "value" );
	validateTypeString( value, "value" );

	cldr = this.cldr;

	validateDefaultLocale( cldr );

	cldr.on( "get", validateCldr );

	// TODO: What about per mille? Which "style" does it belong to?
	pattern = numberPattern( value.indexOf( "%" ) !== -1 ? "percent" : "decimal", cldr );

	ret = numberParse( value, pattern, cldr );

	cldr.off( "get", validateCldr );

	return ret;
};

return Globalize;

});
