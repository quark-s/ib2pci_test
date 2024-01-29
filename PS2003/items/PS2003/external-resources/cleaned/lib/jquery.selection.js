/*  JQuery selection plugin
	Settings (all are optional):
		* kind: area -> selection based on svg paths
				DOM -> selection based on DOM objects with a class ID
		* mode: single -> only a single area or object is selected at a time
				multiple -> many areas or object can be simultaneously selected
		* normalArea: the svg style to apply to unselected areas
		* highlightArea: the svg style to apply to a selected area
		* normalDOMStyle: the CSS class used for objects that can be selected
		* highlightDOMStyle: the CSS class used for selected objects
		* area: an array of SVG paths defining the selectable areas
*/

var selectionPluginReceiver = new Array();//list of elements receiving the selection plugin, used for scoring


(function( $ ){
    var areaObj = {};
    var proxy = null;
    var settings = {
        'kind' : 'UNDEFINED',   // area|DOM, MANDATORY PARAMETER
        'mode' : 'single', // single|multiple
        'normalArea' : {
            fill: 'orange',
            'fill-opacity': 0,
            'stroke-opacity': 0,
            cursor: 'pointer'
        },
        'highlightArea' : {
            fill: 'orange',
            'fill-opacity': 0.4,
            'stroke-opacity': 0,
            cursor: 'pointer'
        },
        'normalDOMStyle' : 'selectable',
        'highlightDOMStyle' : 'selectableHighlight',
        'selectCallback' : function(i, isSelected) {
        },
        'preSelected': new Array()
    };
    
    $.fn.selection = function( options ) {
        selectionPluginReceiver.push($(this));
        $("<style type='text/css'>.selectable{ cursor: pointer; -moz-user-select: -moz-none; } .selectableHighlight{ background-color: #000000; color: #FFFFFF; cursor: pointer; -moz-user-select: -moz-none; }  </style>").appendTo("head");
        
        if ( options ) { 
            $.extend( settings, options );
        }
        
        if (settings.kind == 'area') {
            proxy = $(this).clone();
            $(proxy).css('z-index', parseInt($(this).css('z-index')) + 100);
            $(proxy).css('position', 'absolute').css('left', $(this).position().left).css('top', $(this).position().top);
            $(proxy).height($(this).height());
            $(proxy).width($(this).width());
            $(proxy).attr('id', $(this).attr('id') + '_selproxy');
            $(proxy).insertAfter($(this));
        }
        return this.each(function() {
			var userVarName = getCurrentUnitID() + 'SaveStateQuestion' + getCurrentItemID();
			var selectionContext_object = getUserVar(userVarName);
			var selectionContext_array = new Array();
			if (selectionContext_object != null)
			{
				for (var i in selectionContext_object)
				{
					selectionContext_array.push(selectionContext_object[i]);
				}
			}
            if (settings.kind == 'area') {
                var R = Raphael($(this).attr('id'));
                var proxyR = Raphael($(proxy).attr('id'));
                var el = $(this);
				
                $.each(settings.area, function(k,v){
                    if(el.css('direction') != 'ltr'){
                        areaObj['area' + k] = {
                            'id': v.id,
                            'path': R.path(v.path).scale(-1, 1, (R.width / 2), (R.height / 2)).attr(settings.normalArea), 
                            'proxy': proxyR.path(v.path).scale(-1, 1, (proxyR.width / 2), (proxyR.height / 2)).attr(settings.normalArea),
                            'state': 'normal'
                        };
                    }
                    else{
                        areaObj['area' + k] = {
                            'id': v.id,
                            'path': R.path(v.path).attr(settings.normalArea), 
                            'proxy': proxyR.path(v.path).attr(settings.normalArea),
                            'state': 'normal'
                        };
                    }
                });

                $.each(areaObj, function(k,v){
                    v.proxy[0].onclick = function(){
                        if(v.state == 'normal'){
                            if(settings.mode == 'single')
                                removeAllHighlight();
                            v.state = 'highlight';
                            v.path.attr(settings.highlightArea);
                            settings.selectCallback(v.id, true);
                        }
                        else {
                            v.state = 'normal';
                            v.path.attr(settings.normalArea);
                            settings.selectCallback(v.id, false);
                        }
                    };
                });
            } else if (settings.kind == 'DOM') {
                $('.' + settings.normalDOMStyle).bind('click.selection', function() {
                    if (!$(this).hasClass(settings.highlightDOMStyle)) {
                        if (settings.mode == 'single')
                            removeAllHighlight();
                        $(this).addClass(settings.highlightDOMStyle);
                        settings.selectCallback($(this).id, true);
                    } else {
                        $(this).removeClass(settings.highlightDOMStyle);
                        settings.selectCallback($(this).id, false);
                    }
                } );
            }
            
            if (selectionContext_object != null)
                $.each(selectionContext_object, function(frame, ids){
                    $.each(ids, function(k, id){
                        $(this).setSelection(id);
                    });
                });
        });
        
        function removeAllHighlight(){
            if (settings.kind == 'area') {
                $.each(areaObj, function(k,v){
                    if (v.state == 'highlight') {
                        v.path.attr(settings.normalArea);
                        v.state = 'normal';
                        settings.selectCallback(v.id, false);
                    }
                });
            } else {
                $('.' + settings.highlightDOMStyle).each(function(k,v) {
                    settings.selectCallback(v.id, false)
                });
                $('.' + settings.normalDOMStyle).removeClass(settings.highlightDOMStyle);
            }
        }
    };
    
    $.fn.getSelection = function() {
        var selectedIDArray = [];
        if (settings.kind == 'area') {
            $.each(areaObj, function(k,v){
                if(v.state == 'highlight')
                    selectedIDArray.push(v.id);
            });
        } else {
            $('.' + settings.highlightDOMStyle).each( function(k,v){
                selectedIDArray.push(v.id);
            });
        }
        return selectedIDArray;
    };
    
    $.fn.removeSelection = function(){
        switch (settings.kind)
        {
            case 'area':
                proxy.remove();
                $(this).empty();
                break;
            case 'DOM':
                $('.' + settings.normalDOMStyle).unbind('click.selection');
                break;
        }
    };

    $.fn.removeAllSelections = function() {
        switch (settings.kind) {
            case 'area':
                $.each(areaObj, function(k,v){
                    if(v.state == 'highlight')
                        v.state = 'normal';
                        v.path.attr(settings.normalArea);
                });
                break;
            case 'DOM':
                $('.' + settings.highlightDOMStyle).each( function(k,v){
                    $(this).removeClass(settings.highlightDOMStyle);
                });
                break;
        }
    };

    $.fn.setSelection = function(id) {
        switch (settings.kind)
        {
            case 'area':
            {
                for (var i in areaObj)
                {
                    if (areaObj[i].id == id)
                    {
                        areaObj[i].state = 'highlight';
                        areaObj[i].path.attr(settings.highlightArea);
                        settings.selectCallback(areaObj[i].id, true);
                    }
                }
                break;
            }
            case 'DOM':
            {
                $('#' + id).addClass(settings.highlightDOMStyle);
                settings.selectCallback(id, true);
                break;
            }
            default:
            {
                throw('unknown kind in selection plugin : ', settings.kind, 'only \'DOM\' and \'area\' accepted');
            }
        }
        TriggerEvent('selectionevent', 'selection', {});
    };

})( jQuery );
