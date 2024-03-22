//query autocomplete with support for categorizes results
var bootstrap3Helpers = {};
bootstrap3Helpers.hasAutoCompleteDropdown = new Array();
$.widget("custom.catAutocomplete", $.ui.autocomplete, {
	_create: function () {
		this._super();
		this.widget().menu("option", "items", "> :not(.ui-autocomplete-category)");
	}
});

function highLightHTML(src, srch, wordBoundry, addedClass) {
	if (addedClass) addedClass = " " + addedClass; else addedClass = "";

	var ptn = "";
	if (wordBoundry) ptn = "\\b";
	ptn += $.ui.autocomplete.escapeRegex(srch);
	var oReg = new RegExp(ptn, "ig")

	var a = src.split("<");
	$.each(a, function (key, value) {
		var b = value.split(">");
		if (b.length > 1) {
			b[1] = b[1].replace(oReg, function (x) { return '<span class="ui-autocomplete-highlight' + addedClass + '">' + x + '</span>' });
		} else {
			b[0] = b[0].replace(oReg, function (x) { return '<span class="ui-autocomplete-highlight' + addedClass + '">' + x + '</span>' });
		}
		a[key] = b.join(">");
	});
	return a.join("<");
}

$(document).ready(function () {
	//add drop down caret to input boxes
	$(bootstrap3Helpers.hasAutoCompleteDropdown)
		.each(function(index, element)
		{
			//bootstrap requires that the input be wrapped in an input-group classed div
			if ($(element).closest(".input-group").length == 0)
			{
				$(element).wrap("<div class='input-group' style='width:" + $(element).width() + "px;'>");
			}
			//add caret to input box
			$(element)
				.after("<div class='input-group-addon input-normal' style='cursor: pointer;'><span class='autocompleteDropdownButton caret'></span></div>");
		}
	);

	//style and add events to down down carets
	$(".autocompleteDropdownButton")
		.parent()
		.css('cursor', 'pointer')
		.on("click", function () {
			var delay = $(this).prev().catAutocomplete("option", "delay");
			$(this).prev()
				.focus()
				.catAutocomplete("option", "delay", 0) //turn off delay
				.keydown()
				.catAutocomplete("option", "delay", delay) ;//turn delay back on again;
		})
});