
var userVarName = null;
var pagename = null;


function getCurrentPageName()
{
    var path = document.location.pathname;
    return path.substring(path.lastIndexOf('/') + 1).replace(/\./g, '_');
}


function useSelection()
{
    pagename = getCurrentPageName();
    userVarName = getCurrentUnitID() + 'SaveStateQuestion' + getCurrentItemID();
    AddCallbackEvent('onItemEnd', scoringSelection);
    AddCallbackEvent('scoreNowEvent', scoringSelection);//for scoretest module
    AddCallbackEvent('onItemEnd', unbindScoreNowEvent);
    $(window).bind('unload',setSelectionInContext);
}


function setSelectionInContext()
{
    if (userVarName) {
        var answer = getUserVar(userVarName);
        var pagename = getCurrentPageName();
        if (answer == null)
        {
            answer = {};
        }
        answer[pagename] = getHighlightedSelection();
        setUserVar(userVarName, answer);
    }
}


function getContextSelection()
{
    var context = getUserVar(userVarName);
    var answer = new Array();
	if (context != null)
	{
		for (var page in context)
		{
			for (var j in context[page])
			{
				answer.push(context[page][j]);
			}
		}
	}
    return answer;
}

function clearSelectionInContext()
{
    var answer = {};
    setUserVar(userVarName, answer);
}


function scoringSelection()
{
    //sending context
    setSelectionInContext();

    var answer = getUserVar(userVarName);
    // scoring
	
    var noAnswer = true;
	if (answer != null)	{
		for (var page in answer) {
			for (var j in answer[page])	{
				if (answer[page][j] != '') {
					noAnswer = false;
				}
			}
		}
    }
    
    var ruleStr = getRule();
	var rules = ruleStr.split("%%");
	var subrules = [];
	var NRscore = 9;   //NR = no response (blank)
	var NCscore = 0;   //NC = no credit (wrong)
	if (rules.length == 1) {
		subrules.push({score: 1, rule: rules[0]});
	} else {
		for (var i = 0; i < rules.length; i++) {
			var subrule = rules[i].trim().split(":", 2);
			subrules.push({score: subrule[0].trim(), rule: subrule[1].trim()});
		}
    }

    var score;
    var idx = 0;

    do {
        if (subrules[idx].rule == "NC")
            NCscore = subrules[idx].score;
        else if (subrules[idx].rule == "NR")
            NRscore = subrules[idx].score;
        else 
            score = scoreSelection(subrules[idx].rule);
        idx++;
    } while (!score && idx < subrules.length);

    var scoreVal = NCscore;
    if (score)
        scoreVal = subrules[idx-1].score;

    var time = getGlobalTime();
    var actionCounter = GetActionsCount();
    var timefirstAction = getTimeFirstAction();
    var pLoad = {
        rule: ruleStr,
        result: 1,
        response: JSON.stringify(answer),
        itemDuration: time.item,
        TimeTotal: time.unit,
        TimeFAction: timefirstAction,
        NbrAction: actionCounter
    };
    if (noAnswer) {
        //no answer
        pLoad.result = NRscore;
    } else {
        pLoad.result = scoreVal;
    }

    feedtrace('click', 'scoring', pLoad);
    TriggerEvent('scoreNowResult', 'scoring', pLoad);
    RemoveCallback('onItemEnd', scoringSelection);
}


function unbindScoreNowEvent()
{
	RemoveCallback('scoreNowEvent', scoringSelection);
}



function getHighlightedSelection()
{
    var selected = new Array();
    for (var i in selectionPluginReceiver)//selectionPluginReceiver defined in jquery.selection.js
    {
        jQuery.merge(selected, selectionPluginReceiver[i].getSelection());
    }
    return selected;
}



function Partial_selection()
{
    var PartialAnswer = false;
    var i = 0;
    var selection = getContextSelection();
    while (( ! PartialAnswer) && (i < arguments.length))//for all text blocks given, one true validates the rule
    {
        PartialAnswer = (jQuery.inArray( arguments[i], selection) != -1);
        i++;
    }
    return PartialAnswer;
}

function Complete_selection()
{
    var completeAnswer = true;
    var i = 0;
    var selection = getContextSelection();
    while ((completeAnswer) && (i < arguments.length))//for all text blocks given, one false breaks the rule
    {
        completeAnswer = (jQuery.inArray( arguments[i], selection) != -1);
        i++;
    }
    return completeAnswer;
}

function Only_selection() {
    var completeAnswer = true;
    var i = 0;
    var selection = getContextSelection();
    while ((completeAnswer) && (i < arguments.length))//for all text blocks given, one false breaks the rule
    {
        completeAnswer = (jQuery.inArray( arguments[i], selection) != -1);
        i++;
    }

    while ((completeAnswer) && (i < selection.length))//for all text blocks selected, one true breaks the rule
    {
        completeAnswer = (jQuery.inArray( selection[i], arguments) == -1);
        i++;
    }
    return completeAnswer;
}

function Other_selection()
{
    var PartialAnswer = false;
    var i = 0;
    var selection = getContextSelection();
    while (( ! PartialAnswer) && (i < selection.length))//for all text blocks given, one true validates the rule
    {
        PartialAnswer = (jQuery.inArray( selection[i], arguments) == -1);
        i++;
    }
    return PartialAnswer;
}

//scoreMultihighlight scores the current selection
//rule is a string

function scoreSelection(rule)
{
    rule = rule.replace('{', '(');
    rule = rule.replace('}', ')');
    var changeParameters = new RegExp('([a-zA-Z0-9_-]+)','g');//parameters should be typed as strings before executing the rule
    rule = rule.replace(changeParameters, function(match, found)
    {
        switch(found)
        {
            case 'OR':
            {
                return '|';//changing for javascript operator
            }
            case 'AND':
            {
                return '&';//changing for javascript operator
            }
            case 'NOT':
            {
                return '!';//changing for javascript operator
            }
            case 'Complete':
            {
                return 'Complete_selection';
            }
            case 'Partial':
            {
                return 'Partial_selection';
            }
            case 'Only':
            {
                return 'Only_selection';
            }
            case 'Other':
            {
                return 'Other_selection';
            }
            default://parameters have to be changed for strings
            {
                return '\''+found+'\'';
            }
        }
    });
    try
    {
        eval('score = ('+rule+');');
    }
    catch(e)
    {
        console.log(rule,e);
    }
    return score;
}

var score = null;
