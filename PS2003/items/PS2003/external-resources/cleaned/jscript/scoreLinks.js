function scoreLink(rules)
{
    //var removeBrace = new RegExp('^[\s\n]*{(.*)}[\n\s]*$','g');
    var removeBrace = new RegExp('[{}]','g');
    rules = rules.replace(removeBrace, '');
    return eval(rules);//no replacement needed, only current_page should be called
}


function endLink()
{
    var rules = getRule();
    var result = scoreLink(rules);
    var time = getGlobalTime();
    var actionCounter = GetActionsCount();
    var timefirstAction = getTimeFirstAction();
    var pLoad = {
        rule: rules,
        result: 1,
        response: page_name(),
        itemDuration: time.item,
        TimeTotal: time.unit,
        TimeFAction: timefirstAction,
        NbrAction: actionCounter
    };
    if (result)
    {
        pLoad.result = 1;
    }
    else
    {
        pLoad.result = 7;
    }
    WebBrowserApi.call_gethistory(setHistory);
    if (browserToScore.history.length < 1)//no response
    {
        pLoad.result = 0;
    }
    TriggerEvent('scoreNowResult', 'scoring', pLoad);
    feedtrace('link', 'scoring', pLoad);
    RemoveCallback('onItemEnd', endLink);
}


var browserToScore = {
    'history' : null
};


function setHistory(data)
{
    browserToScore.history = data;
}


/*
	return true if the parameter is the name of the page
*/
function current_page(id)
{
    return (page_name() == id);
}


function page_name() {
    var pageName = window.location.href;//return full url for the current page
    var i = pageName.lastIndexOf('/') + 1;//start of filename
    var j = pageName.lastIndexOf('.');//end of filename (file extension)
    return (pageName.substring(i, j));
}

function uselinks()
{
    AddCallbackEvent('onItemEnd', endLink);
    AddCallbackEvent('scoreNowEvent', endLink);//for scoretest module
    AddCallbackEvent('onItemEnd', unbindScoreNowEvent);
}

function unbindScoreNowEvent()
{
	RemoveCallback('scoreNowEvent', endLink);
}