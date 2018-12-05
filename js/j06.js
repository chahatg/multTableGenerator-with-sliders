function multiplicationTable(hStart, hEnd, vStart, vEnd) {

    //var hstart = Number(document.getElementById('hStart').value);
    //var hend = Number(document.getElementById('hEnd').value);
    //var vstart = Number(document.getElementById('vStart').value);
    //var vend = Number(document.getElementById('vEnd').value);

    
    
    //declaring matrix that will hold the Multiplication table
    var multTable = document.createElement('table');
    multTable.id = 'table';
    var row1 = true;
    var column1= true;
    
    for(var row = vStart-1; row <= vEnd; row++){
        var rowInTable = document.createElement('tr'); //rows
        for(var column = hStart - 1; column <= hEnd; column++){
            var cell;
            var cellText;
            if(row1){
                ccell = document.createElement('th');
                if(!column1) {
                    
                    cellText = document.createTextNode(column);
                    cell.appendChild(cellText);
                }
            } else {
                if(column1) {
                    
                    cell = document.createElement('th');
                    cellText = document.createTextNode(row);
                    cell.appendChild(cellText);
                    
                } else {

                    cell = document.createElement('td');
                    cellText = document.createTextNode(row * column);
                    cell.appendChild(cellText);
                }
            }
            rowInTable.appendChild(cell); // Add cell to row.
            column1 = false;
        }
        multTable.appendChild(rowInTable); // Add row to table.
        row1 = false;
        column1 = true;
    }
    return multTable;
}

function manipHtmlElement(newEl, parentNode) {
    var oldEl;
    if((oldEl = document.getElementById(newEl.id)) &&
       oldEl.parentNode === parentNode) {
           
        //if id already exists with parent, replace
        parentNode.replaceChild(newEl, oldEl);
    } else {
        parentNode.appendChild(newEl);
    }
}


if (typeof FormHandler == 'undefined') { 
    var FormHandler = (function() {
        
        var tabs = $('#tabTable').tabs();
        var tabHandles = tabs.find('ul');
        var tabCounter = 0;
        
        
        var init = function() {
            //rangeInOrder  - to make sure our range starting number is
            //less than the ending number or vice versa

            jQuery.validator.addMethod(
                'rangeInOrder',function(value, element, params) {
                    
                var n1 = parseInt(value);
                var n2 = parseInt($('input[name="' + params[0] + '"]').val());
                
                // If num1 or num2 are NaN, they weren't parsable numbers.
                if(isNaN(n1) || isNaN(n2)) return true;
                
                if(params[2]) {
                    return n1 <= n2;
                } else {
                    return n1 >= n2;
                }
            },'Maximum {1} value must be >= minimum {1} value.'); // Error prompt
            
            
            //rules
            $('form').validate({
                
                
                rules: {
                    hStart: {
                        required: true, 
                        number:   true, 
                        rangeInOrder: ['hEnd', 'multiplier', true]
                        // Must be <= hend.
                    },
                    hEnd: {
                        required: true,
                        number:   true,
                        rangeInOrder: ['hStart', 'multiplier', false]
                        // Must be >= hstart.
                    },
                    vStart: {
                        required: true,
                        number:   true,
                        rangeInOrder: ['vEnd', 'multiplicand', true]
                         // Must be <= vEnd.
                    },
                    vEnd: {
                        required: true,
                        number:   true,
                        rangeInOrder: ['vStart', 'multiplicand', false]
                        // Must be >= vStart.
                    }
                },
                
                showErrors: function(error, mapOfErrors) {
                    // Let plugin do its default loading of errors.
                    this.defaultShowErrors();
                    
                    var maxError = false;
                    
                    // Iterate over the messages to show.
                    mapOfErrors.forEach(function(error) {
                        
                        if(error.method === 'rangeInOrder') {
                            
                            // If the error is a compareTo error,
                            // move the error to a shared error location.
                            maxError = true;
                            $('#' + error.element.name + '-error').empty();
                            var type = error.element.name.slice(0, -3);
                            $('#' + type + 'Error').html(error.message);
                            $('#' + type + 'Error').removeClass('hidden');
                        }
                    });
                    
                    if(mapOfErrors.length === 0 || ! maxError ) {
                        
                        // If the error no longer exists, remove
                        // the error from the shared error location.
                        this.currentElements.each(function(index, element) {
                            var type = element.name.slice(0, -3);
                            $('#' + type + 'Error').empty();
                            $('#' + type + 'Error').addClass('hidden');
                        });
                    }
                },
                
                // Error messages for all non-custom form restrictions.
                messages: {
                    hStart: {
                        required: 'Value cannot be empty.',
                        number: 'Value must be an integer.',
                        step: 'Decimals not allowed. Value must be an integer.'
                    },
                    hEnd: {
                        required: 'Value cannot be empty.',
                        number: 'Value must be an integer.',
                        step: 'Decimals not allowed. Value must be an integer.'
                    },
                    vStart: {
                        required: 'Value cannot be empty.',
                        number: 'Value must be an integer.',
                        step: 'Decimals not allowed. Value must be an integer.'
                    },
                    vEnd: {
                        required: 'Value cannot be empty.',
                        number: 'Value must be an integer.',
                        step: 'Decimals not allowed. Value must be an integer.'
                    }
                },
                
                // If validation passes, create the multiplication table.
                submitHandler: function(form, event) {
                    event.preventDefault();  // Don't submit the form.
                    makeTab(form);
                }
                
            });
            
            $('.slider').slider({
                value: -75,
                min: -75,
                max: 75,
                slide: function(event, ui) {
                    $(this).siblings('input').val(ui.value);
                    $(this).siblings('input').valid();
                },
                change: function(event, ui) {
                    var form = $(this).closest("form")[0];
                    var dynamicEl = form.elements['dynamicTab'].checked;
                    if( dynamicEl && $(form).valid() ) {
                        updateActiveTab(form);
                    }
                }
            });
            
            $('input[type="number"]').on('input', function(event) {
                $(this).siblings('.slider').slider('value', $(this).val());
                var form = $(this).closest("form")[0];
                var dynamicEl = form.elements['dynamicTab'].checked;
                if( dynamicEl && $(form).valid() ) {
                    updateActiveTab(form);
                }
            });
            
        };
        
        tabs.on( 'click', '.closeTab', function() {
            
            var li = $(this).closest('li');
            var idx = li.index();
            var activeIdx = tabs.tabs('option', 'active');
            $(li.find('a').attr('href')).remove();
            li.remove();
            tabs.tabs('refresh');
            var remaining = tabHandles.find('li').length;
            if( remaining === 0 ) {
               
                toggleVisibility(false);
            } else if( activeIdx === idx ){
                
                if(remaining <= idx ) {
                    idx = remaining-1;
                }
                tabs.tabs('option', 'active', idx);
            }
        });
        
        $('#removeAll').on( 'click', function() {
            tabHandles.empty();
            tabs.find(":not(:first-child)").remove();
            tabs.tabs('refresh');
            toggleVisibility(false);
        });
        
        $('#removeRight').on( 'click', function() {
            var activeIdx = tabs.tabs('option', 'active');
            var numOfTabs = tabHandles.find('li').length;
            if( activeIdx == numOfTabs-1 ) {
                alert('No tabs to remove on the right.');
            } else {
                removeSideTabs(activeIdx, true);
            }
        });
        
        $('#removeLeft').on( 'click', function() {
            var activeIdx = tabs.tabs('option', 'active');
            if( activeIdx == 0 ) {
                alert('No tabs to remove on the left.');
            } else {
                removeSideTabs(activeIdx, false);
            }
        });
        
        
        var removeSideTabs = function(activeIdx, toRight) {
            var tabHandlesList = tabHandles.find('li');
            var end = activeIdx;
            var start = 0;
            if( toRight ) {
                end = tabHandlesList.length;
                start = activeIndex+1;
            }
            for( var i = start; i < end; i++ ) {
                var li = tabHandlesList.eq(i);
                
                $(li.find('a').attr('href')).remove();
                
                li.remove();
            }
            tabs.tabs('refresh');
        }
        
        var toggleVisibility = function(show) {
            if( show ) {
                tabs.removeClass('hidden');
                $('#tabButtons').removeClass('hidden');
            } else {
                tabs.addClass('hidden');
                $('#tabButtons').addClass('hidden');
            }
        }
        
        var addDataToTab = function(form, tabTitleContainer, tabContentContainer) {
            var hstart = form.elements['hStart'].value;
           var hend = form.elements['hEnd'].value;
            var vstart = form.elements['vStart'].value;
            var vend = form.elements['vEnd'].value;

            
            var tabTitle =
                    '(' + hstart +
                    ') to (' + hend +
                    ') by (' + vstart +
                    ') to (' + vend + ')';
            
            tabTitleContainer.innerHTML = tabTitle;
            
           
            var table = multiplicationTable( hStart, hEnd,
                    vStart, vEnd);
            $(tabContentContainer).empty();
            manipHtmlElement(table, tabContentContainer);
        }
        
        var updateActiveTab = function(form){
            var activeTab = tabs.tabs('option', 'active');
            if( activeTab === false ) {
                makeTab(form);
            } else {
                var tabHandle = tabHandles.find('li').eq(activeTab);
                var tabTitleContainer = tabHandle.find('a');
                var tabContentContainer = $(tabTitleContainer.attr('href')); 
                addDataToTab(form, tabTitleContainer[0], tabContentContainer[0]);
                tabs.tabs('refresh');
            }
            
        }
        
        var makeTab = function(form) {
            if(!tabs.is(':visible')) {
                toggleVisibility(true);
            }
            
          
            var tabID = "tab-" + tabCounter;
            tabCounter++;
            
         
            var li = document.createElement('li');
            li.id = "handle-" + tabID;
            var a = document.createElement('a');
            a.href = "#" + tabID;
            li.appendChild(a);
            
           
            var div = document.createElement('div');
            div.className = "tabClose";
            div.appendChild(document.createTextNode('x'));
            li.appendChild(div);
            tabHandles.append(li);
            
            
            var div = document.createElement('div');
            div.id = tabID;
            tabs.append(div);
            
           
            addDataToTab(form, a, div);
            
            tabs.tabs('refresh');
            
           
            var idx = tabHandles.find('li').length-1;
            tabs.tabs("option", "active", idx);
        };
        
        return {
            init: init 
        };
    })();

    
    document.addEventListener('DOMContentLoaded', FormHandler.init);
};



