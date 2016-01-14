

var dateParserFn = function( numberParser, parseProperties, tokenizerProperties, strict ) {
	return function dateParser( value ) {
		var tokens;

		validateParameterPresence( value, "value" );
		validateParameterTypeString( value, "value" );

		tokens = dateTokenizer( value, numberParser, tokenizerProperties, strict );
		return dateParse( value, tokens, parseProperties ) || null;
	};
};

