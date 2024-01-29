
// requires jquery.ui

// ----------------------------------------------------------------- ready
$(document).ready(function(){
	AddCallbackEvent('StimulusAndQuestionLoaded', InitDragDrop);
});

function InitDragDrop() {
	window.DragDropObj = new DragDrop();
	RemoveCallback('StimulusAndQuestionLoaded', InitDragDrop);
}


// ----------------------------------------------------------------- DragDrop
function DragDrop(){

    this.data = {};
    this.options = [];
    this.targets = [];
    this.targeting = "basic"; 
    this.initComplete = false;
    this.startDragFromTarget = null;
    
    if($(".subTarget").length > 0){ this.targeting = "sub"; };

    var self = this;

    $( ".dropTarget" ).each(function(i, div){
		self.data[div.id] = {};
		if(self.targeting == "basic") {
			self.data[div.id][div.id] = null;
		}else{ // sub
				$("#" + div.id + " > .subTarget").each(function(j, sub){
			self.data[div.id][sub.id] = null;
				});
		}
    });

	if (document.fonts.ready)
		document.fonts.ready.then(function() {
			self.initOptions();    // "draggables"
			self.initTargets();    // "droppables"
			self.initComplete = true;
		});
	else {
		self.initOptions();    // "draggables"
		self.initTargets();    // "droppables"	
		self.initComplete = true;
	}
};

DragDrop.prototype.isReady = function() {
	return this.initComplete;
}

// ----------------------------------------------------------------- initOptions
DragDrop.prototype.initOptions = function(){

    var self = this;
    var container = "body";
    if ($('#dragBoundary').length > 0)
    	container = '#dragBoundary';
    else if ($('.wrapper').length > 0)
    	container = '.wrapper';

    $( ".dragOption" ).each(function(i,div){
	
		var newDrag = $(div).draggable(
			{containment: container,
				 cursor:"pointer",
				 stack:".dragOption",
                                 start:function(event, ui){                         
                                     self.startDragFromTarget = self.findSource(this.id);
                                     TriggerEvent("drag-drop-start-drag", this.id, {source: this.id, from: self.startDragFromTarget ? self.startDragFromTarget.id : '', to: ''});
                                 },
			         revert:function (event, ui) {
			             // over-writing to 0, 0  moves them back to their original relative position
			             $(this).data("draggable").originalPosition = { top: 0, left: 0 };
                                     if(!event){
                                         if(self.startDragFromTarget){
                                            TriggerEvent("drag-drop-remove-source", this[0].id, {source:this[0].id, from: self.startDragFromTarget ? self.startDragFromTarget.id : '', to: ''});
                                         }else{
											TriggerEvent("drag-drop-return-source", this[0].id, {source:this[0].id, from: '', to: ''});
                                         }

                                     };                                     
			             return !event;
				 }});
	
		// grab the original global position for later animation
		newDrag.data("draggable").initOffset = $(div).offset(); 
		newDrag.data("draggable").initWidth = $(div).outerWidth(); 
		newDrag.data("draggable").initHeight = $(div).outerHeight(); 
	
		self.options.push(newDrag);
		if ($(div).data("ddgroup")) {
			$(div).addClass( $(div).data("ddgroup") );
		}
   });
};

// ----------------------------------------------------------------- initTargets
DragDrop.prototype.initTargets = function(){

    var self = this;
    
    $( ".dropTarget" ).each( function(i,div) {

		var newDrop = $(div).droppable(
            { tolerance:"intersect",
              hoverClass: "drop-hover",
			  over:function(){
				  self.activeTarget = this.id; // if a droppable hits 2 targets, this one wins
			   },

              accept:function(dragObj){
		  		return (self.targetHasOption(this.id, null) || self.targetHasOption(this.id, dragObj.attr("id")));
              },
	      
              drop: function(e,ui){
				if(this.id != self.activeTarget){ return; };
				
				// does this draggable already exsit in the target zone? return it
				var sub = self.targetHasOption(this.id, ui.draggable.attr("id"));
				if(sub){
					if(self.startDragFromTarget){
						TriggerEvent("drag-drop-remove-source", ui.draggable.attr("id"), {source:ui.draggable.attr("id"), from: self.startDragFromTarget ? self.startDragFromTarget.id : '', to: ''});
					}else{
						TriggerEvent("drag-drop-return-source", ui.draggable.attr("id"), {source:ui.draggable.attr("id"), from: '', to: ''});
					}
			
					ui.draggable.animate({top:0, left:0}); //return to original position (relative)
					self.data[this.id][sub] = null;
					return;
				};

				if(self.startDragFromTarget){
					TriggerEvent("drag-drop-move-to-target", ui.draggable.attr("id"), {source:ui.draggable.attr("id"), from: self.startDragFromTarget ? self.startDragFromTarget.id : '', to: this.id});
				}else{
					TriggerEvent("drag-drop-drop-to-target", ui.draggable.attr("id"), {source: ui.draggable.attr("id"), from: '', to: this.id});                                      

				}
                  
                                  
                  
				  // is there a null(empty) option in the target? 
				  var sub = self.targetHasOption(this.id, null); 
				  if(sub){
					  var globalSub =  $("#" + sub).offset();
					  var globalDrag = ui.draggable.data("draggable").initOffset;
					  var l = (globalSub.left - globalDrag.left);
					  var t = (globalSub.top - globalDrag.top);
					  var offLeft = ($('#' + sub).outerWidth() - ui.draggable.data("draggable").initWidth) / 2;
					  var offTop = ($('#' + sub).outerHeight() - ui.draggable.data("draggable").initHeight) / 2;
			  
					  ui.draggable.animate({left:l+offLeft, top:t+offTop}, "fast");
					  self.data[this.id][sub] = ui.draggable.attr("id");
				  };
              },
	      
              out: function(e,ui){
		  var outOptionID = ui.draggable.get(0).id;
		  var sub = self.targetHasOption(this.id, outOptionID);
		  if(sub){  self.data[this.id][sub] = null;  };
              }});

		self.targets.push(newDrop);
		if ($(div).data("ddgroup")) {
			$(div).droppable( "option", "accept", "." + $(div).data("ddgroup") );
		}
    });
};

// ----------------------------------------------------------------- targetHasOption
// return ID if optionID is found, otherwise false
DragDrop.prototype.targetHasOption = function(targetID, optionID){

    if(this.targeting == "basic"){
        if(this.data[targetID][targetID] == optionID){ return targetID; }else{ return false; };
    };

    if(this.targeting == "sub"){
        for(var sub in this.data[targetID]){
            if(this.data[targetID][sub] == optionID){
                return sub;
            };
        };
        return false;
    };
};


// ----------------------------------------------------------------- findSource
DragDrop.prototype.findSource = function(srcID){

    let found = null;
    Object.keys(this.data).forEach((t) => {
        Object.keys(this.data[t]).forEach((s) => {
            if(this.data[t][s] == srcID){ found = t; }
        });
    });
    return found;
}


// ----------------------------------------------------------------- allTargetsAreEmpty
DragDrop.prototype.allTargetsAreEmpty = function(){

    if(this.targeting == "basic"){
        for(t in this.data){
            if(this.data[t][t] != null){ return false; };
        };
    };
    
    if(this.targeting == "sub"){
        for(t in this.data){
            for(var sub in this.data[t]){
                if(this.data[t][sub] != null){ return false; };
            };
        };
    };

    return true;
};

// ----------------------------------------------------------------- getData
DragDrop.prototype.getData = function(){
    return this.data;
};

// ----------------------------------------------------------------- setData
DragDrop.prototype.setData = function(obj){
    this.data = obj;
    this.restoreState();
};

// ----------------------------------------------------------------- restoreState
DragDrop.prototype.restoreState = function(){
    for(target in this.data){
		for(var sub in this.data[target]){
            if(this.data[target][sub] != null){
				var draggable = $("#" + this.data[target][sub]);
				var globalSub =  $("#" + sub).offset();
				var globalDrag = draggable.data("draggable").initOffset;
				var l = (globalSub.left - globalDrag.left);
				var t = (globalSub.top - globalDrag.top);
				var offLeft = ($('#' + sub).outerWidth() - draggable.data("draggable").initWidth) / 2;
				var offTop = ($('#' + sub).outerHeight() - draggable.data("draggable").initHeight) / 2;
				draggable.css("left", l+offLeft);
				draggable.css("top", t+offTop);
	    	}
		}
    }
};
