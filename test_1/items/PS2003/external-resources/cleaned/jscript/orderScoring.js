
// OrderList state: map of list IDs to array of ordered elements
// OrderList context: map of page names to orderlist state objects

var userVarName = null;
var pagename = null;


function getCurrentPageName()
{
    var path = document.location.pathname;
    return path.substring(path.lastIndexOf('/') + 1).replace(/\./g, '_');
}


function useOrder()
{
    pagename = getCurrentPageName();
    userVarName = getCurrentUnitID() + 'SaveStateQuestion' + getCurrentItemID();
    AddCallbackEvent('onItemEnd', scoringOrderList);
    AddCallbackEvent('scoreNowEvent', scoringOrderList);//for scoretest module
    AddCallbackEvent('onItemEnd', unbindScoreNowEvent);
    $(window).bind('unload',setOrderListInContext);

    AddCallbackEvent('StimulusAndQuestionLoaded', restoreOrderState);
}


function restoreOrderState(){

    var answer = getUserVar(userVarName);
    if (answer != null){
        if(answer[pagename] != null){
            window.OrderList.setData(answer[pagename]);
        };
    };
    RemoveCallback('StimulusAndQuestionLoaded', restoreOrderState);
}

function setOrderListInContext()
{
	var answer = getUserVar(userVarName);
	if (answer == null)
	{
		answer = {};
	}
	answer[pagename] = getOrderListState();
	setUserVar(userVarName, answer);
}


function getContextOrderList()
{
	//flattens the state objects for all pages into a single map
    var context = getUserVar(userVarName);
    var answer = {};
	if (context != null)
	{
		for (var page in context)
		{
			for (var j in context[page])
			{
				answer[j] = context[page][j];
			}
		}
	}
    return answer;
}


function scoringOrderList()
{
    //sending context
    setOrderListInContext();

    var answer = getContextOrderList();
    // scoring
    var rules = getRule();
    var time = getGlobalTime();
    var actionCounter = GetActionsCount();
    var timefirstAction = getTimeFirstAction();
    var pLoad = {
        rule: rules,
        result: 1,
        response: JSON.stringify(answer),
        itemDuration: time.item,
        TimeTotal: time.unit,
        TimeFAction: timefirstAction,
        NbrAction: actionCounter
    };
	
    var noAnswer = true;
	if (answer != null)
	{
		for (var page in answer)
		{
			for (var j in answer[page])
			{
				// How to determine if there was no answer?
				noAnswer = false;
			}
		}
	}

    var ruleStr = rules;
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
      else {
          score = scoreOrderList(subrules[idx].rule);
      }
      idx++;
    } while (!score && idx < subrules.length);

    var scoreVal = NCscore;
    if (score)
        scoreVal = parseInt(subrules[idx-1].score);

    if (noAnswer)
        pLoad.result = NRscore;
    else
        pLoad.result = scoreVal;

    TriggerEvent('scoreNowResult', 'scoring', pLoad);
    feedtrace('click', 'scoring', pLoad);
    RemoveCallback('onItemEnd', scoringOrderList);
}


function unbindScoreNowEvent()
{
	RemoveCallback('scoreNowEvent', scoringOrderList);
}



function getOrderListState()
{
    return window.OrderList.getData();
}



function Order_list(listID, idArray)
{
    var completeAnswer = false;
    var i = 0;
    var state = getContextOrderList();

    if (state[listID]) {
    	var listArray = state[listID];
		completeAnswer = true;
		for (i = 0; i < idArray.length; i++) {
			if (!listArray[i] || listArray[i] != idArray[i]) {
				completeAnswer = false;
				break;
			}
		}
    }
    return completeAnswer;
}

//scoreMultihighlight scores the current selection
//rule is a string

function scoreOrderList(rule)
{
    rule = rule.replace('{', '(');
    rule = rule.replace('}', ')');
    var changeParameters = new RegExp('([a-zA-Z0-9_]+)','g');//parameters should be typed as strings before executing the rule
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
            case 'Order':
            {
                return 'Order_list';
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
