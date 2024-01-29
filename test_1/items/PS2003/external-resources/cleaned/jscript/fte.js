
var userVarName = null;
var pagename = null;


function getCurrentPageName()
{
    var path = document.location.pathname;
    return path.substring(path.lastIndexOf('/') + 1).replace(/\./g, '_');
}


function useFTE()
{
    pagename = getCurrentPageName();
    userVarName = getCurrentUnitID() + 'SaveStateQuestion' + getCurrentItemID();
    getContextFTE();
    AddCallbackEvent('onItemEnd', scoringFTE);
    AddCallbackEvent('scoreNowEvent', scoringFTE);//for scoretest module
    AddCallbackEvent('onItemEnd', unbindScoreNowEvent);
    $(window).bind('unload',setFTEInContext);
}


function setFTEInContext()
{
	//saving context
	var formObject = getUserVar(userVarName);
	if ( formObject == null)
	{
		formObject = {};
	}
	$('input, select, textarea').each(function(index, el)
	{
		//test val() on each form type, and in multiple mode
		var ans = '';
		if ($(el).is(':checkbox') || $(el).is(':radio'))
		{
			if ($(el).is(':checked'))
			{
				ans = "1";
			}
			else
			{
				ans = "";
			}
		}
		else
		{
			ans = $(el).val();
		}

        if (typeof(formObject[pagename]) == 'undefined')
        {
            formObject[pagename] = {};
        }
        formObject[pagename][$(el).attr('id')] = ans;
    });

	$('.mathTextEditor,.mathEQEditor').each(function(index, el)
	{
		var mathResponse = '';
		var mathEditor = getControler().MathEditApi;
		mathResponse = mathEditor.getResponse();
        if (typeof(formObject[pagename]) == 'undefined')
        {
            formObject[pagename] = {};
        }
        formObject[pagename][$(el).attr('id')] = mathResponse;
	});

    //saving in context
    setUserVar(userVarName, formObject);
}


function getContextFTE()
{
    //restore context
    pagename = getCurrentPageName();
    userVarName = getCurrentUnitID() + 'SaveStateQuestion' + getCurrentItemID();
    var formContext = getUserVar(userVarName);
	if ((formContext != null) && (pagename in formContext))
	{
		formContext = formContext[pagename];
		for (var i in formContext)
		{
			var el = $('#'+i);
			if ($(el).hasClass('mathTextEditor') || $(el).hasClass('mathEQEditor')) {
				var mathEditor = getControler().MathEditApi;
				mathEditor.setResponse(formContext[i]);
			} else if ($(el).is(':checkbox') || $(el).is(':radio')) {
				$(el).prop('checked', (formContext[i] == "1") );
			} else {
				$(el).val( formContext[i] );
			}
		}
	}
}

function collectFTEData(fte) {
	var fteData = '';
    fte.each(function(idx) {
		//First go through form elements and set their values so that the .html() gets them
		$('input', this).each(function()
		{
			if ($(this).is('input:text')) {
				$(this).replaceWith('<div class="responseTextInput" style="border: solid black 1px; padding: 3px; font-family: fixed">' + $(this).val() + "</div>");
			} else {
				this.setAttribute('value',this.value);
				if (this.checked)
					this.setAttribute('checked', 'checked');
				else
					this.removeAttribute('checked');
			}
		});

		$('select', this).each(function()
		{
			var index = this.selectedIndex;
			var i = 0;
			$(this).children('option').each(function()
			{
				if (i++ != index)
					this.removeAttribute('selected');
				else
					this.setAttribute('selected','selected');
			});
		});

		$('textarea', this).each(function()
		{
			$(this).replaceWith('<div class="responseTextArea" style="border: solid black 1px; padding: 3px; font-family: fixed">' + $(this).val() + "</div>");
		});
		
		$('.mathTextEditor,.mathEQEditor', this).each(function()
		{
			var mathResponse = '';
			var mathEditor = getControler().MathEditApi;
			mathResponse = mathEditor.getResponse();
			$(this).replaceWith('<div class="mathTextArea" style="border: solid black 1px; padding: 3px; ">' + mathResponse + '</div>');
		});
		$('.dt-container', this).each(function () {
			var func = null;
			if (typeof getFTEData == "function") {
				func = getFTEData;
			}
			$(this).replaceWith('<div class="responseImage" style="border: solid black 1px; padding: 3px;">' + func(true) + '</div>');
		});
		
		//Next get the html
		if (fteData.length > 0)
			fteData  += "<br/>";
    	fteData += '<div class="' + getCurrentUnitID() + '_' + getCurrentItemID() + '">' + $(this).html() + '</div>';
    });
    
    return fteData;
}

function grabFTEData() {
    var fteData = collectFTEData($('.FTEData'));
    
    try {
    	//Must be a better way!!!!
		var stimWin = parent.parent.frames['stimulus'].contentWindow.frames['item'].contentWindow; 
		if (stimWin) {
			fteData += collectFTEData(stimWin.$('.FTEData'));
		}
	} catch (e) {
		//ignore
	}

    fteData += "\n";
    return fteData;
}

function scoringFTE()
{
    //sending context
    setFTEInContext();

    var answer = getUserVar(userVarName);
    // scoring
    var rules = getRule();
    var time = getGlobalTime();
    var actionCounter = GetActionsCount();
    var timefirstAction = getTimeFirstAction();
    var pLoad = {
        rule: rules,
        result: 8,
        response: '',
        itemDuration: time.item,
        TimeTotal: time.unit,
        TimeFAction: timefirstAction,
        NbrAction: actionCounter
    };
    
	pLoad.fteData = grabFTEData();

    TriggerEvent('scoreNowResult', 'scoring', pLoad);
    feedtrace('click', 'scoring', pLoad);
    RemoveCallback('onItemEnd', scoringFTE);
}


function unbindScoreNowEvent()
{
	RemoveCallback('scoreNowEvent', scoringFTE);
}

var score = null;
