function Timeline(opts){
    this.el = $('<div>', {class:'timeline'});
    this.init(opts);
}

Timeline.prototype = {
    init: function(opts){
        var _this = this;
        _this.elTimeline = $('<table><tbody></tbody></table>').appendTo(this.el).find('tbody');
        _this.initRows(opts.rows);
        _this.initCols(opts.data, opts.width);
        _this.elTimeline.on('click', 'td', function(){
            var row = $(this).closest('tr').data('id');
            var index = $(this).parent().find('td').index(this);
            _this.toggleVal(row, index);
        });
        _this.data = opts.data;
    },
    initRows: function(requestedRows){
        var _this = this;
        _this.initialisedRows = requestedRows.map(function(row, i){
            return {
                name: row.name,
                length: Number(row.length)||1,
                $row: $('<tr></tr>').data('id', i).appendTo(_this.elTimeline)
            };
        });
    },
    initCols: function(data, width){
        this.initialisedRows.forEach(function(row){
            var colspan = '';
            if(row.length > 1){
                colspan = ' colspan="'+row.length+'"';
            }
            var active = '<td'+colspan+' class="active"></td>';
            var inactive = '<td'+colspan+'></td>';

            var wholeRow = '<th>'+$('<div>').text(row.name).html()+'</th>';
            for(var i=0; i<width; i+=row.length){
                if(data[i] && data[i].indexOf(row.name) !== -1){
                    wholeRow += active;
                } else {
                    wholeRow += inactive;
                }
            }
            row.$row.html(wholeRow);
        });
    },
    toggleVal: function(row, column){
        var def = this.initialisedRows[row];
        var dataColumn = column * def.length;
        while(this.data.length < dataColumn+def.length){
            this.data.push([]);
        }
        var indexOfEntry = this.data[dataColumn].indexOf(def.name);
        var $cell = def.$row.find('td:eq('+column+')');
        if(indexOfEntry === -1){
            this.data[dataColumn].push(def.name);
            $cell.addClass('active');
        } else {
            $cell.removeClass('active');
            this.data[dataColumn-1] = this.data[dataColumn].splice(indexOfEntry,1);
        }


    }
};
if(typeof module !== 'undefined'){
    module.exports = Timeline;
}
