require.config({
	paths: {
		cldr: "../external/cldrjs/dist/cldr",
		fixtures: "./fixtures",
		json: "../external/requirejs-plugins/src/json",
		src: "../src",
		text: "../external/requirejs-text/text"
	}
});

require([

	// core
	"./unit/core/locale",

	// date
	"./unit/date/expand-pattern",
	"./unit/date/format",
	"./unit/date/tokenizer",
	"./unit/date/parse",

	// message
	"./unit/message/translate",

	// number
	"./unit/number/formatter/integer-fraction-digits",
	"./unit/number/formatter/significant-digits",
	"./unit/number/formatter/grouping-separator",
	"./unit/number/formatter",
	"./unit/number/parse"

], function() {
	QUnit.start();
});
