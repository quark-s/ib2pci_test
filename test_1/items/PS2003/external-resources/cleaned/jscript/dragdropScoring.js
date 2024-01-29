/*
  window.DragDropObj is the master control for the UI
  
  DragDropObj.getData() returns state object
  DragDropObj.setData() accepts state object, restores the UI state
  
  DragDropObj.targetHasOption(targetID, optionID), if NOT found returns false, otherwise returns subID
  DragDropObj.allTargetsAreEmpty(), returns boolean 

  Dragdrop state = {TargetID: {SubTargetID: OptionID}}
  
  Dragdrop context: map of page names to dragdrop state objects

  rule
  <![CDATA[{ Contains(q1Target1, CommonSole) }]]>
*/

var userVarName = null;
var pagename = null;


function getCurrentPageName()
{
    var path = document.location.pathname;
    return path.substring(path.lastIndexOf('/') + 1).replace(/\./g, '_');
}


function useDragDrop()
{
    pagename = getCurrentPageName();
    userVarName = getCurrentUnitID() + 'SaveStateQuestion' + getCurrentItemID();
    AddCallbackEvent('onItemEnd', scoringDragDrop);
    AddCallbackEvent('scoreNowEvent', scoringDragDrop);//for scoretest module
    AddCallbackEvent('onItemEnd', unbindScoreNowEvent);
    $(window).bind('unload',setDragDropInContext);

    AddCallbackEvent('StimulusAndQuestionLoaded', restoreDragDropState);
}


function restoreDragDropState(){
console.log("RestoreDragDropState");
    var answer = getUserVar(userVarName);
    if (answer != null){
        if(answer[pagename] != null) {
            if (window.DragDropObj && window.DragDropObj.isReady())
                window.DragDropObj.setData(answer[pagename]);
            else
                window.setTimeout(restoreDragDropState, 100);
        }
    }
    RemoveCallback('StimulusAndQuestionLoaded', restoreDragDropState);
}


function setDragDropInContext()
{
    var answer = getUserVar(userVarName);
    if (answer == null)
    {
	answer = {};
    }
    answer[pagename] = getDragDropState();
    setUserVar(userVarName, answer);
}


function getContextDragDrop()
{
/*
    var answer = getUserVar(userVarName);
    return answer[pagename];
*/
    // ??
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


function scoringDragDrop()
{
    //sending context
    setDragDropInContext();

    var pagename = getCurrentPageName();
    var answer = getContextDragDrop();

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
    
    var noAnswer = window.DragDropObj.allTargetsAreEmpty();

    if (noAnswer) {
        pLoad.result = 9;
    } else {
        var scoreDD = scoreDragDrop(rules);

        if (! scoreDD){ //wrong answer
            // incorrect -> 0
            pLoad.result = 0;
        }
    }
    
    feedtrace('click', 'scoring', pLoad);
    TriggerEvent('scoreNowResult', 'scoring', pLoad);
    RemoveCallback('onItemEnd', scoringDragDrop);
}


function unbindScoreNowEvent()
{
    RemoveCallback('scoreNowEvent', scoringDragDrop);
}



function getDragDropState()
{
    var data = window.DragDropObj.getData();
    return data;
}



function Contains_element(targetID, optionID)
{
    return window.DragDropObj.targetHasOption(targetID, optionID) ? true : false;
};



//rule is a string

function scoreDragDrop(rule)
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
                            case 'Contains':
                                {
                                    return 'Contains_element';
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
