/**
 * Api for PIAAC round 2. contains TAO api and specific PIAAC round 2 api.
 * 
 * @require jquery >= 1.3.2 [http://jquery.com/]
 * 
 * @author Igor Ribassin, <igor.ribassin@tudor.lu>
 */

/**
 * @ignore
 */
var __naxControler = null;
var __id = null;
var ModuleId = null;

/*for the user and the platform*/
var moduleParams;
var naxContext;
var eventStation;

{
	//HACK: insert stylesheet rule only for Mac Firefox versions less than 30.0. Need to workaround a 
	//      bug with the offset style
/*  Disable. No need with new open kiosk
	if (navigator.platform.indexOf("Mac") != -1 && navigator.userAgent.indexOf(") Gecko") != -1) {
		if (/Firefox[\/\s](\d+\.\d+)/.test(navigator.userAgent)){ //test for Firefox/x.x or Firefox x.x (ignoring remaining digits);
 			var ffversion=new Number(RegExp.$1) ;// capture x.x portion and store as a number
 			if (ffversion < 30) {
		 		var sheet = (function() {
					// Create the <style> tag
					var style = document.createElement("style");
					// WebKit hack :(
					style.appendChild(document.createTextNode(""));
					// Add the <style> element to the page
					document.head.appendChild(style);

					return style.sheet;
				})();
				sheet.insertRule("textarea {outline-offset: -4px !important;}", 0);
				sheet.insertRule("input[type=text] {outline-offset: -4px !important;}", 0);
				sheet.insertRule("select {outline-offset: -4px !important;}", 0);
			}
		}
	}
*/
}

/**
 * @ignore
 */
function getControler()
{
	return __naxControler;
}


/**
 * @description bind every non bubbling events to dom elements.
 * @methodOf added to jquery
 */
jQuery.fn.bindDom = function(events, attributes, callback)
{
	if (events != '')
	{
		$(this).bind(events, attributes, callback);
		var childrens = $(this).children();
		if (childrens.length)// stop condition
		{
			childrens.bindDom(events, attributes, callback);
		}
	}
};

/**
 * @ignore
 */
function getUrlVars()
{
	var vars = [], hash;
	var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
	for (var i = 0; i < hashes.length; i++)
	{
		hash = hashes[i].split('=');
		vars.push(hash[0]);
		vars[hash[0]] = hash[1];
	}

	var parentWindow = window;
	var imax = 0;
	while ((typeof(parentWindow.url_vars_controler) == 'undefined') && (parentWindow.parent != parentWindow))
	{
		parentWindow = parentWindow.parent;
		imax++;
		if (imax > 20)//arbitrary limit
		{
			break;
		}
	}
	if (typeof(parentWindow.url_vars_controler) != 'undefined')
	{
		vars = jQuery.extend(vars, parentWindow.url_vars_controler);
	}

	return vars;
}

function toEasternDigits(str) {
	var newValue="";
	str += "";
    for (var i=0;i<str.length;i++)
    {
        var ch=str.charCodeAt(i);
        if (ch>=48 && ch<=57)
        {
            // european digit range
            var newChar=ch+1584;
            newValue=newValue+String.fromCharCode(newChar);
        } else if (String.fromCharCode(ch) == '/') {
			newValue = newValue + '\u200A/\u200A';
		} else
            newValue=newValue+String.fromCharCode(ch);
    }
    return newValue;
}

function toWesternDigits(str) {
	var newValue="";
	str += "";
    for (var i=0;i<str.length;i++)
    {
        var ch=str.charCodeAt(i);
        if (ch>=1632 && ch<=1641)
        {
            // european digit range
            var newChar=ch-1584;
            newValue=newValue+String.fromCharCode(newChar);
		} else if (String.fromCharCode(ch) == '\u200A') {
			continue;  //Skip spaces added in around slash characters
		} else
            newValue=newValue+String.fromCharCode(ch);
    }
    return newValue;
}

function toHalfWidth(str) {
	var newValue="";
	str += "";
    for (var i=0;i<str.length;i++)
    {
        var ch=str.charCodeAt(i);
        if (ch >= 0xFF00 && ch <= 0xFFEF) {
            // european digit range
            var newChar=0xFF & (ch + 0x20);
            newValue=newValue+String.fromCharCode(newChar);
        } else
            newValue=newValue+String.fromCharCode(ch);
    }
    return newValue;
}

function transformTypedCharacter(typedChar, lang) {
    if (lang == 'ara-JOR' || lang == 'ara-PSE') {
		if (typedChar == '/')
			return '\u200A/\u200A';		//Put spaces around slashes so fractions stay RTL in Chrome
		else
			return toEasternDigits(typedChar);
	} else if (lang == 'jpn-JPN') {
		return toHalfWidth(typedChar);
	} else {
		return typedChar;
	}
}

function insertTextAtCursor(text) {
    var sel, range, textNode;
    if (window.getSelection) {
        sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
            range = sel.getRangeAt(0).cloneRange();
            range.deleteContents();
            textNode = document.createTextNode(text);
            range.insertNode(textNode);

            // Move caret to the end of the newly inserted text node
            range.setStart(textNode, textNode.length);
            range.setEnd(textNode, textNode.length);
            sel.removeAllRanges();
            sel.addRange(range);
        }
    } else if (document.selection && document.selection.createRange) {
        range = document.selection.createRange();
        range.pasteHTML(text);
    }
}

function getInputSelection(el) {
    var start = 0, end = 0, normalizedValue, range,
        textInputRange, len, endRange;

    if (typeof el.selectionStart == "number" && typeof el.selectionEnd == "number") {
        start = el.selectionStart;
        end = el.selectionEnd;
    } else {
        range = document.selection.createRange();

        if (range && range.parentElement() == el) {
            len = el.value.length;
            normalizedValue = el.value.replace(/\r\n/g, "\n");

            // Create a working TextRange that lives only in the input
            textInputRange = el.createTextRange();
            textInputRange.moveToBookmark(range.getBookmark());

            // Check if the start and end of the selection are at the very end
            // of the input, since moveStart/moveEnd doesn't return what we want
            // in those cases
            endRange = el.createTextRange();
            endRange.collapse(false);

            if (textInputRange.compareEndPoints("StartToEnd", endRange) > -1) {
                start = end = len;
            } else {
                start = -textInputRange.moveStart("character", -len);
                start += normalizedValue.slice(0, start).split("\n").length - 1;

                if (textInputRange.compareEndPoints("EndToEnd", endRange) > -1) {
                    end = len;
                } else {
                    end = -textInputRange.moveEnd("character", -len);
                    end += normalizedValue.slice(0, end).split("\n").length - 1;
                }
            }
        }
    }

    return {
        start: start,
        end: end
    };
}

function offsetToRangeCharacterMove(el, offset) {
    return offset - (el.value.slice(0, offset).split("\r\n").length - 1);
}

function setInputSelection(el, startOffset, endOffset) {
    el.focus();
    if (typeof el.selectionStart == "number" && typeof el.selectionEnd == "number") {
        el.selectionStart = startOffset;
        el.selectionEnd = endOffset;
    } else {
        var range = el.createTextRange();
        var startCharMove = offsetToRangeCharacterMove(el, startOffset);
        range.collapse(true);
        if (startOffset == endOffset) {
            range.move("character", startCharMove);
        } else {
            range.moveEnd("character", offsetToRangeCharacterMove(el, endOffset));
            range.moveStart("character", startCharMove);
        }
        range.select();
    }
}

/**
 * @ignore
 */
$(document).ready(function()
{
	var __parentWindow = window.parent;//1up
	if (typeof(__parentWindow.NaxControl) == 'undefined')
	{
		if (typeof(__parentWindow.getControler) != 'undefined')//if 1up has platform
		{
			__naxControler = __parentWindow.getControler();
		}
	}
	else
	{
		__naxControler = __parentWindow.NaxControl.getInstance();//if 1up is platform
	}
	if (__naxControler != null)
	{
		//platform
		__id = getUrlVars()['__id'];
		if (typeof(__id) == 'undefined')
		{
			//stimulus or question
			ModuleId = getUrlVars()['ModuleId'];
			__naxControler.StoreNewFrame(ModuleId, window, $('body'));
		}
		else
		{
			//module
			__naxControler.StoreNewModule(__id, window, $('body'));
			moduleParams = getModuleParams();
			naxContext = getNaxContext();
		}
		incrementFrameStored($('iframe, frame').length);
		util = getUtil();
		//action counter
		var actions = __naxControler.GetCountActions();
		$(window).bind(actions.bubbling.join(' '), __naxControler.ActionCounter);
		$('html').bindDom(actions.nonBubbling.join(' '), null, __naxControler.ActionCounter);
		
		//copy, cut and paste events binding
		$('body').bind('copy',function(e)
		{
			__naxControler.copyEventCatched(e);
		});
		$('html').bind('paste',function(e)
		{
			__naxControler.pasteEventCatched(e);
		});
		$('body').bind('cut',function(e)
		{
			__naxControler.cutEventCatched(e);
		});
		//keep last selection for copy events
		$('body').bind('mouseup',function(e)
		{
			var sel = getCurrentSelection();
			if ((sel != '') && (sel != null))
			{
				__naxControler.SetSelectedText(sel);
			}
		});
		$('input.ssDataInput').bind('select',function(e)
		{
			var sel = $(e.target).val().substring(e.target.selectionStart, e.target.selectionEnd);
			if ((sel != '') && (sel != null))
			{
				__naxControler.SetSelectedText(sel);
			}
		});
		// keeping track of selected elements for piaac paste
		$('textarea').focus(__naxControler.setFocusedField);
		$('input[type=text]').focus(__naxControler.setFocusedField);
		$('input[type=password]').focus(__naxControler.setFocusedField);
		$('input.ssDataInput').focus(__naxControler.setFocusedField);//for spreadsheet module

		//prevent dragging images
		$('img').bind('dragstart', function(event) { event.preventDefault(); });
		//prevent middle click opening new window
		document.addEventListener('auxclick', function(e) {
			if (e.button === 1 && e.target.tagName.toLowerCase() === 'a') {
				e.preventDefault();
				return false;
			}
		})

		var curLang = getLang();
		if (curLang == 'ara-JOR' || curLang == 'ara-PSE' || curLang == 'jpn-JPN') {
			var selector;
			if (curLang == 'ara-JOR' || curLang == 'ara-PSE')
				selector = 'input,textarea,.mathTextContent';
			else if (curLang == 'jpn-JPN')
				selector = 'input,.mathTextContent,.noIME';
			$(selector).keypress(function(evt) {
				if (evt.which) {
					var tag = $(this).prop("tagName").toLowerCase();
					if (tag == "input" || tag == "textarea") {
						var charStr = String.fromCharCode(evt.which);
						var transformedChar = transformTypedCharacter(charStr, curLang);
						if (transformedChar != charStr) {
							var sel = getInputSelection(this), val = this.value;
							this.value = val.slice(0, sel.start) + transformedChar + val.slice(sel.end);
				
							// Move the caret
							setInputSelection(this, sel.start + transformedChar.length, sel.start + transformedChar.length);
							return false;
						}				
					} else {
						var charStr = String.fromCharCode(evt.which);
						var transformedChar = transformTypedCharacter(charStr, curLang);
						if (transformedChar != charStr) {
							insertTextAtCursor(transformedChar);
							return false;
						}
					}
				}
			})
		}
	}
	else
	{
		//platform not found
	}
});



/**
 * @ignore
 */
$(window).load(function()
{
	// if this page is an iframe in design mode
	if (document.designMode == 'on')
	{
		$(document).focus(function(e)
		{
			e.target = document.getElementsByTagName('body')[0];
			__naxControler.setFocusedField(e);
		});
	}
});



/**
 * @function copy
 * @description simulate the copy action
 */
function copy()
{
	__naxControler.trigger_copy();
}


/**
 * @function paste
 * @description simulate the paste action
 */
function paste()
{
	__naxControler.trigger_paste();
}

/**
 * @ignore
 */
function getCurrentSelection()
{
	var sel = window.getSelection();
	if (sel.rangeCount > 0)
	{
		return sel.toString();
	}
	else
	{
		return null;
	}
}

/**
 * @function GetActionsCount
 * @description 
 * @return {int} number of actions performed in the current item
 */
function GetActionsCount()
{
	return __naxControler.GetActionsCount();
}

/**
 * @function getTimeFirstAction
 * @description 
 * @return {int} time spend before first action
 */
function getTimeFirstAction()
{
	return __naxControler.GetTimeFirstAction();
}

/**
 * @ignore
 */
$(window).load(function()
{
	if ((typeof(__id) == 'undefined') && (__naxControler != null))
	{
		//changing the question number
		if (getLang() != 'ara-JOR' || getLang() == 'ara-PSE') {
			$('.question_number').html(getItemNumber());
			$('.unit_number').html(getUnitNumber());
			$('.question_number_total').html(getTotalItemNumber());
		} else {
			$('.question_number').html(toEasternDigits(getItemNumber()));
			$('.unit_number').html(toEasternDigits(getUnitNumber()));
			$('.question_number_total').html(toEasternDigits(getTotalItemNumber()));
		}
	}
});

/**
 * @function feedtrace
 * @description send an event to the platform to be recorded
 * @param {string} target_tag element receiving the event
 * @param {string} event_type type of the event
 * @param {Object} pLoad object containing any relevant data
 */
function feedtrace(target_tag, event_type, pLoad)
{
	__naxControler.Feedtrace(target_tag, event_type, new Date().getTime(), pLoad);
}

/**
 * @function logEvent
 * @description log a dom event
 * @param {string} elementName element receiving the event
 * @param {string} event_type type of the event
 * @param {Object} data object containing any relevant data
 */
function logEvent(elementName, eventType, data)
{
	__naxControler.Feedtrace(elementName, eventType, new Date().getTime(), data);
}

/**
 * @function logCustomEvent
 * @description log a custom event
 * @param {string} eventName name of the custom event (e.g. 'clickOnSpecificButton')
 * @param {Object} data object containing any relevant data
 */
function logCustomEvent(eventName, data)
{
	__naxControler.Feedtrace('BUSINESS', eventName, new Date().getTime(), data);
}

/**
 * @function getUnitNumber
 * @description retreives the current unit number in the workflow
 * @returns {Integer} 
 */
function getUnitNumber()
{
	return __naxControler.GetUnitNumber();
}

/**
 * @function getTotalItemNumber
 * @description retreives the number of items in the current unit
 * @returns {Integer} 
 */
function getTotalItemNumber()
{
	return __naxControler.GetTotalItemNumber();
}


/**
 * @function getLang
 * @description return the current langage code (e.g. en-US)
 * @returns {String} 
 */
function getLang()
{
	return __naxControler.GetLang();
}

/**
 * @ignore
 */
function getBaseUrl()
{
	return __naxControler.GetBaseUrl();
}

/**
 * @ignore
 */
function getUnitUrl()
{
	return __naxControler.GetUnitUrl();
}


/**
 * @function getScoringMode
 * @description return the scoring mode : multihighlight|click|link|form
 * @returns {String}
 */
function getScoringAttributes()
{
	return __naxControler.GetScoringAttributes();
}


/**
 * @function GetRule
 * @description return the rule for the current item for highlight scoring
 * @returns {String} 
 */
function getRule()
{
	return __naxControler.GetRule();
}

/**
 * @ignore
 */
function getModuleUrl()
{
	return __naxControler.GetModuleUrl();
}

/**
 * @ignore
 */
function getUnitUrl()
{
	return __naxControler.GetUnitUrl();
}

/**
 * @ignore
 */
function getServiceUrl()
{
	return __naxControler.GetServiceUrl();
}

/**
 * @function getItemNumber
 * @description retreives the current item number in the unit
 * @returns {String}
 */
function getItemNumber()
{
	return __naxControler.GetItemNumber();
}

/**
 * @ignore
 */
function getUtil()
{
	return __naxControler.Util();
}

/**
 * @function getMeta
 * @description retreives the metas described in the unit.xml file
 * @returns {Object}
 */
function getMeta()
{
	return __naxControler.GetMeta();
}

/**
 * @ignore
 */
function getMap()
{
	return __naxControler.GetMap();
}

/**
 * @ignore
 */
function getSectionMap()
{
	return __naxControler.GetSectionMap();
}

/**
 * @ignore
 */
function getProcessUri()
{
	return __naxControler.GetProcessUri();
}

/**
 * @ignore
 */
function getCurrentUnitID()
{
	return __naxControler.GetCurrentUnitID();
}

/**
 * @ignore
 */
function getCurrentItemID()
{
	return __naxControler.GetCurrentItemID();
}

/**
 * @ignore
 */
function getCurrentItemName()
{
	return __naxControler.GetCurrentItemName();
}

/**
 * @function setValidationCallback
 * @param {function} callback a callback function
 * @description allows to set a callback function called when the testee is about to move to the next item or unit. You may set controls on the answers in this callback function
 */
function setValidationCallback(callback)
{
	__naxControler.SetValidationCallback(callback, ModuleId);
}

/**
 * @function removeValidation
 * @description removes all validation callbacks from this item
 */
function removeValidation()
{
	RemoveValidation(ModuleId);
}

/**
 * @ignore
 */
function incrementFrameStored(x)
{
	__naxControler.IncrementFrameStored(x);
}

/**
 * @function
 * @returns the module parameters in a module, null otherwise
 */
function getModuleParams()
{
	return __naxControler.GetNaxModuleParams(__id);
}

/**
 * @ignore
 */
function getNaxContent()
{
	return __naxControler.GetNaxContent(eventObj);
}

/**
 * @ignore
 */
function getNaxContext()
{
	return __naxControler.GetNaxContext(__id);
}

/**
 * @function getGlobalTime
 * @description returns the time in seconds spend by the testee on the test
 * @returns {Integer}
 */
function getGlobalTime()
{
	return __naxControler.GetGlobalTime();
}

/**
 * @function forward
 * @description moves to the next item or unit. Callback functions set by setValidationCallback() will be executed.
 */
function forward()
{
	__naxControler.Next();
}

/**
 * @function backward
 * @description moves to the previous item or unit. Does not move if neither previous item nor unit is available (or backward progression is disabled).
 */
function backward()
{
	__naxControler.Previous();
}

/**
 * @function breakoff
 * @description breaks the cba workflow and brings back to the bq
 */
function breakoff()
{
	__naxControler.Breakoff();
}

/**
 * @function AddCallbackEvent
 * @param {String} event name of the event you want to catch
 * @param {function} callback function called when the specified event is triggered. your callback function may take two parameters : params (corresponding to the third parameter of TriggerEvent) and moduleId (corresponding to the second parameter of TriggerEvent)
 * @description add a callback to an event triggered with TriggerEvent. 
 */
function AddCallbackEvent(event, callback)
{
	//__naxControler.AddCallbackEvent(event, callback, this);
}

/**
 * @function TriggerEvent
 * @param {String} event name of the event
 * @param {String} moduleId id of the trigering module (actually you can set anything you want here, as long as it is a string, it is just for the feedtrace and the callback)
 * @param {Object} params parameters you wish to send to the callback function
 * @description triggers an event catchable by all modules and units of PIAAC round 2, by using AddCallbackEvent(). Not related to DOM events.
 */
function TriggerEvent(event, moduleId, params)
{
	__naxControler.TriggerEvent(event, moduleId, params);
}

function RemoveCallback(event, callback)
{
	__naxControler.RemoveCallback(event, callback);
}


/**
 * @function LoadModule
 * @param {String} moduleName name of the module (which is the name of it's folder in the module directory)
 * @param {String} moduleId id of the newly created module id. It has to be unique.
 * @param {String} context 'unit' or 'item'. defines the scope of the module. By setting 'item', the module will disapear at the next question. By setting 'unit', it will disapear at next unit
 * @param {String} params parameters you wish to send to the callback function
 * @param {function} callback function called when the module's frame is loaded. Your callback function may take the window object of the new frame as parameter.
 * @param {jquery Object} container jquery element which will receive the module's frame
 * @description Loads a module, available in the platform in the module directory.
 * @example var modWebBrowser = LoadModule('webbrowser', 'webbrowser', 'item', {}, function(module){
        module.WebBrowserApi.webbrowser_init(getProcessUri(), path + '/wb.xml');
    }, $('#U3XXenvironment'));
 * @example var modSpreadSheet = LoadModule('spreadsheet', 'spreadsheet', 'item', {}, function(module){
        module.SpreadSheetApi.spreadsheet_init(getProcessUri(), path + '/ss.xml');
        module.SpreadSheetApi.set_ischeckboxdisplayed(true);
    }, $('#U3XXenvironment'));
 * @example var modMailClient = LoadModule('mailclient', 'mailclient', 'item', {}, function(module){
        module.MailClientApi.mailclient_init(getProcessUri(), path + '/mc.xml');
    }, $('#U3XXenvironment'));
 * @returns {Object} returns an object with two elements : frame which is the jquery object holding the iframe dom element, and window which should not be used.
 */
function LoadModule(moduleName, moduleId, context, params, callback, container)
{
	return __naxControler.LoadModule(moduleName, moduleId, context, params, callback, container);
}


function LoadModuleInLang(moduleName, moduleId, lang, context, params, callback, container)
{
	return __naxControler.LoadModuleInLang(moduleName, moduleId, lang, context, params, callback, container);
}


 
 /**
 * @ignore
 */
function UnloadModule(module)
{
	__naxControler.UnLoadModule(module);
}
/*tao api*/
/**
 * @function setUserVar
 * @param {String} key name of the context variable
 * @param {String} value value of the context variable
 * @param {Boolean} isGlobal flag whether variable is local to this unit or global for all
 * @description stores a variable in the platform, then accessible in any unit
 */
function setUserVar(key, value, isGlobal)
{
	__naxControler.setUserVar(key, value, isGlobal);
}
/**
 * @function getUserVar
 * @param {String} key name of the context variable
 * @param {Boolean} isGlobal flag whether variable is local to this unit or global for all
 * @description retreives value for the given key from the platform
 * @returns {mixed}
 */
function getUserVar(key, isGlobal)
{
	return __naxControler.getUserVar(key, isGlobal);
}


/**
 * @function clearUserVar
 * @description delete all variables set for current user in platform
 */
function clearUserVar()
{
	__naxControler.removeAllContextForProcess();
}


/**
 * Get the endorsment of the item
 * 
 * @function
 * @returns {boolean}
 */
function getEndorsment()
{
	return __naxControler.getEndorsment();
}
/**
 * Set the endorsment of the item
 * 
 * @function
 * @param {boolean} endorsment
 */
function setEndorsment(endorsment)
{
	__naxControler.setEndorsment(endorsment);
}/**
 * Get the score of the item 
 * 
 * @function
 * @returns {String|Number}
 */
function getScore()
{
	return __naxControler.getScore();
}

/**
 * Set the final score of the item
 * 
 * @function
 * @param {String|Number} score
 */
function setScore(score)
{
	__naxControler.setScore();
}
/**
 * get the score range if defined
 * 
 * @function
 * @returns {Object} with <b>min</b> and <b>max</b> attributes
 */
function getScoreRange()
{
	return __naxControler.getScoreRange();
}
/**
 * Set the score range. 
 * It will be used to calculate the endorsment from the score.
 * 
 * @function
 * @param {String|Number} max
 * @param {String|Number} [min = 0]
 */
function setScoreRange(max, min)
{
	__naxControler.setScoreRange(max, min);
}
/**
 * Get the values answered by the subject 
 * 
 * @function
 * @returns {Object}
 */
function getAnsweredValues()
{
	return __naxControler.getAnsweredValues();
}
/**
 * Set the values answered by the subject.
 * If the item contains a free text field, 
 * you can record here the complete response. 
 * 
 * @function
 * @param {Object} values
 */
function setAnsweredValues(values)
{
	__naxControler.setAnsweredValues();
}
/**
 * Get the data of the user currently doing the item  (the subject)
 * 
 * @function
 * @returns {Object} all the data related to the subject
 */
function getSubject()
{
	return __naxControler.getSubject();
}
/**
 * Get the login of the subject
 * 
 * @function
 * @returns {String} the subject's login
 */
function getSubjectLogin()
{
	return __naxControler.getSubjectLogin();
}/**
 * Get the name of the subject (firstname and lastname)
 * 
 * @function
 * @returns {Object} the subject's name
 */
function getSubjectName()
{
	return __naxControler.getSubjectName();
}
/**
 * Get the current item's informations 
 * 
 * @function
 * @returns {Object} the item's data (uri, label)
 */
function getItem()
{
	return __naxControler.getItem();
}
/**
 * Get the informations of the currently running test 
 * 
 * @function
 * @returns {Object} the test's data (uri, label)
 */
function getTest()
{
	return __naxControler.getTest();
}
/**
 * Get the informations of the current delivery
 * 
 * @function
 * @returns {Object} the delivery's data (uri, label)
 */
function getDelivery()
{
	return __naxControler.getDelivery();
}
/**
 * Check if the onItemBegin event has already fired
 * 
 * @function
 * @returns {Boolean} true/false whether the platform is ready
 */
function IsPlatformReady()
{
	return __naxControler.IsPlatformReady();
}
