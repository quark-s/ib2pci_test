/*
 * This plugin filters keyboard input by specified regular expression.
 * Version 1.7
 * $Id$
 *
 * Source code inspired by Ext.JS (Ext.form.TextField, Ext.EventManager)
 *
 * Procedural style:
 * $('#ggg').keyfilter(/[\dA-F]/);
 * Also you can pass test function instead of regexp. Its arguments:
   * this - HTML DOM Element (event target).
   * c - String that contains incoming character.
 * $('#ggg').keyfilter(function(c) { return c != 'a'; });
 *
 * Class style:
 * <input type="text" class="mask-num" />
 *
 * Available classes:
   * mask-pint:     /[\d]/
   * mask-int:      /[\d\-]/
   * mask-pnum:     /[\d\.]/
   * mask-money     /[\d\.\s,]/
   * mask-num:      /[\d\-\.]/
   * mask-hex:      /[0-9a-f]/i
   * mask-email:    /[a-z0-9_\.\-@]/i
   * mask-alpha:    /[a-z_]/i
   * mask-alphanum: /[a-z0-9_]/i
 */

function bindKeyFilter() {
	var tags = $('input[class*=mask],textarea[class*=mask]');
	for (var key in $.fn.keyfilter.defaults.masks)
	{
		tags.filter('.mask-' + key).keyfilter($.fn.keyfilter.defaults.masks[key]);
	}
}

(function($)
{
	var defaultMasks = {
		pint:     /[\d]/,
		pintplus:     /[\d٠١٢٣٤٥٦٧٨٩]/,
		'int':    /[\d\-]/,
		pnum:     /[\d\.]/,
		money:    /[\d\.\s,]/,
		num:      /[\d\-\.]/,
		piaacnum:      /[\d\-\., \/٠١٢٣٤٥٦٧٨٩]/,
		hex:      /[0-9a-f]/i,
		email:    /[a-z0-9_\.\-@]/i,
		alpha:    /[a-z_]/i,
		alphanum: /[a-z0-9_]/i
	};
	
	var imeFlags = {
		pint: true,
		pintplus: true,
		'int': true,
		pnum: true,
		money: true,
		num: true,
		piaacnum: true,
		hex: true,
		email: true,
		alpha: true,
		alphanum: true
	};

	var Keys = {
		TAB: 9,
		RETURN: 13,
		ESC: 27,
		BACKSPACE: 8,
		DELETE: 46
	};

	// safari keypress events for special keys return bad keycodes
	var SafariKeys = {
		63234 : 37, // left
		63235 : 39, // right
		63232 : 38, // up
		63233 : 40, // down
		63276 : 33, // page up
		63277 : 34, // page down
		63272 : 46, // delete
		63273 : 36, // home
		63275 : 35  // end
	};

	var isNavKeyPress = function(e)
	{
		var k = e.keyCode;
		k = $.browser.safari ? (SafariKeys[k] || k) : k;
		return (k >= 33 && k < 40) || k == Keys.RETURN || k == Keys.TAB || k == Keys.ESC;
	};

        var isSpecialKey = function(e)
	{
		var k = e.keyCode;
		var c = e.charCode;
		return k == 9 || k == 13 || (k == 40 && (!e.shiftKey)) || k == 27 ||
			k == 16 || k == 17 ||
			(k >= 18 && k <= 20) ||
			($.browser.opera && !e.shiftKey && (k == 8 || (k >= 33 && k <= 35) || (k >= 36 && k <= 39) || (k >= 44 && k <= 45)))
			;

        };

        /**
         * Returns a normalized keyCode for the event.
         * @return {Number} The key code
         */
        var getKey = function(e)
	{
		var k = e.keyCode || e.charCode;
		return $.browser.safari ? (SafariKeys[k] || k) : k;
        };

        var getCharCode = function(e)
	{
		return e.charCode || e.keyCode || e.which;
	};
/*
var myElement = document.getElementById('pasteElement');
myElement.onpaste = function(e) {
  var pastedText = undefined;
  if (window.clipboardData && window.clipboardData.getData) { // IE
    pastedText = window.clipboardData.getData('Text');
  } else if (e.clipboardData && e.clipboardData.getData) {
    pastedText = e.clipboardData.getData('text/plain');
  }
  alert(pastedText); // Process and handle text...
  return false; // Prevent the default handler from running.
};
e.originalEvent.clipboardData
$("#textareaid").bind("paste", function(){} );
*/

	function mapPIAACChar(char, re) {
		if (char >= '０' && char <= '９') //full width numeral
			char = String.fromCharCode(char.charCodeAt(0) - (65298 - 50));
		else if (char == '，') //full width comma
			char = ',';
		else if (char == '．') //full width period
			char = '.';
		else if (char == '／') //full width slash
			char = '/';
		else if (char == '－') //full width minus
			char = '-';
		else if (char == '　') //full width space
			char = ' ';
		else if (char == '\u200A') //narrow width space; don't change
			return char;
		else if (!re.test(char))
			char = '';
		return char;
}

	$.fn.keyfilter = function(re)
	{
		var input = this;
		this.bind("drop", function(e) { return false; } );
		this.bind("paste", function(e) {
			try {
				var clip = e.originalEvent.clipboardData.getData('text/plain');
				var theInput = this
				window.setTimeout(function() {
					try {
						var newClip = '';
						for (var i=0; i < clip.length; i++) {
							var ok = false;
							if ($.isFunction(re))
								ok = re.call(input, clip.charAt(i));
							else
								ok = re.test(clip.charAt(i));
							if (ok)
								newClip += clip.charAt(i);
						}
						$(theInput).val(newClip);
					} catch (e) {
						;
					}
				}, 10);
			} catch (err) {
				;
			}
			e.stopPropagation();
			return false;
		});
		this.bind("compositionend", function(e) {
			try {
				var data = e.originalEvent.data;
				var theInput = this;
				window.setTimeout(function() {
					try {
						var txt = $(theInput).val();
						var newTxt = '';
						for (var i=0; i < txt.length; i++) {
							var ok = false;
							var char = txt.charAt(i);
							if ($(theInput).hasClass('mask-piaacnum'))
								char = mapPIAACChar(char, re);
							if ($.isFunction(re))
								ok = re.call(input, char);
							else
								ok = re.test(char);
							if (ok)
								newTxt += char;
						}
						$(theInput).val(newTxt);
					} catch (e) {
						;
					}
				}, 10);
			} catch (err) {
				console.log(err);
			}
		});
		this.bind("blur", function(e) {
			if ($(this).hasClass('mask-piaacnum')) {
				try {
					var txt = $(this).val();
					var newTxt = '';
					for (var i=0; i < txt.length; i++) {
						var char = mapPIAACChar(txt.charAt(i), re);
						newTxt += char;
					}
					$(this).val(newTxt);
				} catch (e) {
					;
				}
			}
		})
		
		if (window.location.href.indexOf('ara-JOR') == -1 && window.location.href.indexOf('ara-PSE') == -1)
			this.css('ime-mode', 'disabled');
		
		return this.keypress(function(e)
		{
			if (e.ctrlKey || e.altKey)
			{
				return;
			}
			var k = getKey(e);
			if($.browser.mozilla && (isNavKeyPress(e) || k == Keys.BACKSPACE || (k == Keys.DELETE && e.charCode == 0)))
			{
				return;
			}
			var c = getCharCode(e), cc = String.fromCharCode(c), ok = true;
			if(!$.browser.mozilla && (isSpecialKey(e) || !cc))
			{
				return;
			}
			if ($.isFunction(re))
			{
				ok = re.call(this, cc);
			}
			else
			{
				ok = re.test(cc);
			}
			if(!ok)
			{
				e.preventDefault();
			}
		});
	};

	$.extend($.fn.keyfilter, {
		defaults: {
			masks: defaultMasks
		},
		version: 1.7
	});
	
	$(document).ready(function()
	{
		bindKeyFilter();
	});

})(jQuery);
