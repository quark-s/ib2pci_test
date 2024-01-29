
// ----------------------------------------------------------------- ready
$(function(){

    window.OrderList = new OrderList();
});


// ----------------------------------------------------------------- DragDrop
// requires jquery.ui
// requires json2

function OrderList(){

    this.data = {};

    var self = this;

    $( ".orderList" ).each(function(i, el){
		self.data[el.id] = [];
		$(el).sortable({
			items: "li:not(.orderList-fixed)",
			placeholder: 'ui-sortable-placeholder',
			forcePlaceholderSize: true,
			tolerance: 'pointer',
			containment: $('body'),
			start: function( event, ui ) {
				var elID = ui.item.attr('id');
				TriggerEvent("drag-drop-start-drag", elID, {});
			},
			update: function( event, ui ) {
				var elID = ui.item.attr('id');
				feedtrace('item', 'order-list-change', {newOrder: JSON.stringify(self.getData())});
			}
		});
		$(el).disableSelection();
    });
};

// ----------------------------------------------------------------- getData
OrderList.prototype.getData = function(){
	for (var id in this.data) {
		this.data[id] = $('#' + id).sortable("toArray");
	}
	return this.data;
};

// ----------------------------------------------------------------- setData
OrderList.prototype.setData = function(data){
    this.data = data;
    this.restoreState();
};

// ----------------------------------------------------------------- restoreState
OrderList.prototype.restoreState = function(){
    for(listID in this.data){
		var items = this.data[listID];
		var itemAry = [];
		var n = 0;
		// items data are often not in array format
		for (var i in items) {
			itemAry[i] = items[i];
			n++;
		}
		itemAry.length = n;
			
		$(listID).prepend("#" + $(itemAry[0]));
		for (var i=1; i < itemAry.length; i++) {
			$("#" + itemAry[i]).insertAfter("#" + itemAry[i-1]);
		}
    };
};
