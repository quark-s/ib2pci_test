//Define response part types:
var _RESP_CLICK = "click";
var _RESP_INPUT = "input";
var _RESP_RADIO = "radio";
var _RESP_CHECKBOX = "checkbox";
var _RESP_SELECT = "select";
var _RESP_HIGHLIGHT = "highlight";

//def: Array of definitions of response parts for items
//    Format: {
//		itemNum: [
//			{ID: partID, type: partType},
//			{ID: partID, type: partType}
//		],
//		itemNum: [
//			{ID: partID, type: partType},
//			{ID: partID, type: partType}
//		]
//	}

function manageContext(unitName, def) {
	AddCallbackEvent('StimulusAndQuestionLoaded', function(params, moduleId)
	{
		var itemNumber = getItemNumber();
		var contextVariableName = unitName + 'SaveStateQuestion' + itemNumber;
		if (def[itemNumber]) {
			def[itemNumber].forEach( function(el, idx) {
				var contextPartID = (contextVariableName + el.ID).replace(/#/g, '');
				switch(el.type) {
					case _RESP_INPUT: {
						var questionContext = getUserVar(contextPartID);
						if (questionContext !== "") {
							$(el.ID).val(questionContext);
						}
						break;
					}
					case _RESP_RADIO: {
						var questionContext = getUserVar(contextPartID);
						if (questionContext !== "") {
							$('#' + questionContext).attr('checked', true);
						}
						break;
					}
					case _RESP_CHECKBOX: {
						var questionContext = getUserVar(contextPartID);
						if (questionContext !== "") {
							$(el.ID).attr('checked', questionContext);
						}
						break;
					}
					case _RESP_CLICK: {
						var questionContext = getUserVar(contextPartID);
						if (questionContext !== "") {
							for (var i in questionContext)
							{
								$(el.ID).setSelection(questionContext[i]);
							}
						}
						break;
					}
					case _RESP_SELECT: {
						var questionContext = getUserVar(contextPartID);
						if (questionContext !== "") {
							$(el.ID).val(questionContext);
						}
						break;
					}
					default: {
						window.alert("Unknown response type error");
						break;
					}
				}
			} );
		}
	} );
	
	AddCallbackEvent('onItemEnd', function(params, moduleId)
	{
		var itemNumber = getItemNumber();
		var contextVariableName = unitName + 'SaveStateQuestion' + itemNumber;
		if (def[itemNumber]) {
			def[itemNumber].forEach( function(el, idx) {
				var contextPartID = (contextVariableName + el.ID).replace(/#/g, '');
				switch(el.type) {
					case _RESP_INPUT: {
						setUserVar(contextPartID, $(el.ID).val());
						break;
					}
					case _RESP_RADIO: {
						var radioName = el.ID.replace(/#/g, '');
						setUserVar(contextPartID, $('input:radio[name=' + radioName + ']:checked').attr('id'));
						break;
					}
					case _RESP_CHECKBOX: {
						setUserVar(contextPartID, $(el.ID).is(':checked'));
						break;
					}
					case _RESP_CLICK: {
						setUserVar(contextPartID, $(el.ID).getSelection());
						break;
					}
					case _RESP_SELECT: {
						setUserVar(contextPartID, $(el.ID + ' option:selected').val());
						break;
					}
					default: {
						window.alert("Unknown response type error");
						break;
					}
				}
			} );
		}
	} );

}