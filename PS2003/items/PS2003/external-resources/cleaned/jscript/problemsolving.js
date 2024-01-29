var scoringObject = {};
var userVarName = '';
var pagename = null;

function useProblemSolvingScoring()
{
    pagename = getCurrentPageName();
    userVarName = getCurrentUnitID() + 'SaveStateQuestion' + getCurrentItemID();
    restoreContextPS();
    AddCallbackEvent('onItemEnd', endPS);
    AddCallbackEvent('scoreNowEvent', endPS);//for scoretest module
    AddCallbackEvent('onItemEnd', unbindScoreNowEvent);
    AddCallbackEvent('PSscored', scorePS);
}

function saveFormInContext()
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

function restoreContextPS()
{
    //restore context
    pagename = getCurrentPageName();
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
			} else if ($(el).is(':checkbox')) {
				$(el).attr('checked', (formContext[i] == "1") );
            } else if ($(el).is(':radio') && formContext[i] == "1") {
				$(el).attr('checked', (formContext[i] == "1") );
			} else {
				$(el).val( formContext[i] );
			}
		}
	}
}

function getAnswer() {
    saveFormInContext();
	var formsObject = getUserVar(userVarName);
	var noAnswer = true;
	var answer = '';
	var formObject = getUserVar('defaultValues');
	if (formObject == null)
	{
		formObject = {};
	}
	if (formsObject != null)
	{
		for (var page in formsObject)
		{
			for (var i in formsObject[page])
			{
				formObject[i] = formsObject[page][i];
				if (answer.length > 0)
				{
					answer += '; ';
				}
				answer += i + ":" + formObject[i];
				if (formObject[i] != '')
				{
					noAnswer = false;
				}
			}
		}
	}
	
	return answer;
}

function addVarToScoringObject()
{
    switch (arguments.length)
    {
        case 2:
        {
            scoringObject[arguments[0]] = arguments[1];
            break;
        }
        case 1:
        {
            scoringObject[arguments[0]] = null;
            break;
        }
        default:
        {
            console.log('wrong number of arguments for addVarToScoringObject : '+arguments.length+', only 1 or 2 supported');
        }
    }
}

function endPS()
{
	saveFormInContext();
    TriggerEvent('PSReadyToScore', 'scoring', scoringObject);
    RemoveCallback('onItemEnd', endPS);
}

function unbindScoreNowEvent()
{
	RemoveCallback('scoreNowEvent', endPS);
}

function scorePS(scoringInfo)
{
    if (! ('unitNumber' in scoringInfo))
    {
        scoringInfo.unitNumber = '';
    }

    var time = getGlobalTime();
    var actionCounter = GetActionsCount();
    var timefirstAction = getTimeFirstAction();

    scoringObject['itemDuration'] = time.item;
    scoringObject['TimeTotal'] = time.unit;
    scoringObject['NbrAction'] = actionCounter;
    scoringObject['TimeFAction'] = timefirstAction;

    feedtrace('ps', 'scoring', scoringObject);
    TriggerEvent('scoreNowResult', 'scoring', scoringObject);//to catch score results by authoring
    delete scoringObject;
    scoringObject = {};
    RemoveCallback('PSscored', scorePS);
}

function getCurrentPageName()
{
    var path = document.location.pathname;
    return path.substring(path.lastIndexOf('/') + 1).replace(/\./g, '_');
}
