var util = require('util');
var _ = require('underscore');

v = function(value){
    value = value || 0;
    var v = {
        value:0,
        unit:{
            numerator:[],
            denominator:[],
            backupUnit:'',
        }
    }
    if(value == 'false' || value == 'true'){
        v.value = value;
    }else if(_.isString(value)){
        v.unit.backupUnit = value.replace(/[0-9]/g, '');
        v.unit.numerator = [v.unit.backupUnit.toString()];
        v.value = parseFloat(value);
    }else if(_.isNumber(value)){
        v.value = value;
    }

    return v;

}
stringValue = function(unit){

    if(_.isString(unit) || _.isNumber(unit)){
        return unit.toString();
    }else if(typeof unit.value !='undefined' && typeof unit.unit != 'undefined'){
        if(typeof unit.unit.backupUnit != 'undefined'){
            return unit.value.toString()+unit.unit.backupUnit;
        }else{
            return unit.value.toString();
        }
    }else{
        return unit.value.toString();
    }
}

module.exports = {
    install: function(less, pluginManager) {
        // less.functions.functionRegistry.add('calc-col', function(input) { 
        //     return new(less.tree.Anonymous)('test');
        // });

        less.functions.functionRegistry.add("calc-col", function (test){
            
            var columns = arguments[0] || v(12);  // How many columns. 
            var columnGutter = arguments[1] || v(0);  // Gutter in between columns.
            var offset = arguments[2] || v(0);  // Value to add to the resulting value.
            var area = arguments[3] || v('100%');  // Column area.
            var totalColumns = arguments[4] || v(12);  // Total columns to divide the area.
            var outsideGutter = arguments[5] || v(false);  // Calculate columns with outside gutters. 
            var wrapper = arguments[6] || v(false);  // Wrap the resulting value.
            var divisions = 0;
            if(outsideGutter.value === 'false'){
                divisions = totalColumns.value-1;
            }else{
                divisions = totalColumns.value+1;
            }
            //var totalArea = stringValue(area)+' - ('+columnGutter.value+' * '+divisions+')';
            //console.log(stringValue(area))

            var totalArea = stringValue(area)+' - ('+stringValue(columnGutter)+' * '+divisions+')';
            var singleColumn = '('+totalArea+')/'+stringValue(totalColumns);

            //var singleColumn = (area.value/totalColumns.value)+area.unit.backupUnit;
            var insideGutterCount = columns.value - 1;
            var calcString = '('+singleColumn+') * '+columns.value+' + ('+stringValue(columnGutter)+' * '+insideGutterCount+')';
            var calcValue = ''+calcString+'';

            if(parseFloat(offset.value) != 0){
                calcValue = '('+calcValue+') + '+stringValue(offset);
            }

            if(wrapper.value !== 'false' && wrapper.value !== false){
                calcValue = wrapper.value.replace('VALUE', calcValue);
            }
            
            return new(less.tree.Anonymous)(calcValue);

        });

   

    }
};