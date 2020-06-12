TW.IDE.Widgets.canvasgauge = function () {
	this.widgetProperties = function () {
		return {
			'name' : 'canvasgauge',
			'description' : 'Vlads Gauge Widget',
			'category' : ['Common'],
			'isExtension':true,
			'supportsAutoResize': true,
			'properties' : {
				'LineWidth': {
                    'baseType' : 'NUMBER',
					'defaultValue' : 0.2,
					'isBindingTarget': true,
					'isBindingSource': true,
					'isVisible': true,
					'description':'Percentage from the maximum available Height of the widget',
				},
				'JSONConfiguration': {
                    'baseType' : 'JSON',
					'defaultValue' : '',
					'description':'This allows configuration based on a custom JSON that allows using all the underlying library capabilities. This property is not optimized for speed. Do not bind any of the other properties when using this.',
					'isBindingTarget': true,
					'isBindingSource': false,
					'isVisible': true
				},
				'IsJSONConfigured': {
                    'baseType' : 'BOOLEAN',
					'defaultValue' : false,
					'description':'If true, the widget will be configured from the JSONConfiguration property and all other properties will not be used',
					'isBindingTarget': true,
					'isBindingSource': false,
					'isVisible': true
                },
                'Angle': {
                    'baseType' : 'NUMBER',
					'defaultValue' : -0.4,
					'isBindingTarget': true,
					'isBindingSource': true,
					'description':'Span of the gauge arc. Min/Max: -0.5/+0.5. -0.5=360 degrees, 0.5=0 degrees',
					'isVisible': true
				},
				'StateFormatting': {
                    'baseType' : 'STATEFORMATTING',
					'description':'State based formatting for the gauge',
					'baseTypeInfotableProperty': 'Data'
				},
				'LimitMax': {
                    'baseType' : 'BOOLEAN',
					'defaultValue' : false,
					'description':'If false, max value increases automatically if value > maxValue',
					'isBindingTarget': true,
					'isBindingSource': true,
					'isVisible': true
                },
				'LimitMin': {
                    'baseType' : 'BOOLEAN',
					'description':'If true, the min value of the gauge will be fixed',
					'defaultValue' : false,
					'isBindingTarget': true,
					'isBindingSource': true,
					'isVisible': true
                },
				'ColorStart': {
                    'baseType' : 'STRING',
					'defaultValue' : '#6FADCF',
					'description':'The background color of the ring gauge from the Min value to the current Value',
					'isBindingTarget': true,
					'isBindingSource': true,
					'isVisible': true
				},
				'StrokeColor': {
                    'baseType' : 'STRING',
					'defaultValue' : '#E0E0E0',
					'description':'The background color of the ring gauge from the Current Value to the Max Value. Ignored if the StateFormatting is used',
					'isBindingTarget': true,
					'isBindingSource': true,
					'isVisible': true
				},
				'PointerColor': {
                    'baseType' : 'STRING',
					'defaultValue' : '#FFFFFF',
					'description':'The color of the pointer',
					'isBindingTarget': false,
					'isBindingSource': false,
					'isVisible': true
				},
				'HighDpiSupport': {
                    'baseType' : 'BOOLEAN',
					'defaultValue' : true,
					'description':'High resolution support',
					'isBindingTarget': true,
					'isBindingSource': true,
					'isVisible': true
				},
				'RadiusScale': {
                    'baseType' : 'NUMBER',
					'defaultValue' : 1,
					'isBindingTarget': true,
					'isBindingSource': true,
					'description':'The actual radius of the Gauge. Min/Max:0.1/2. Depending on the size of some labels, the radius Scale might need to be updated manually.',
					'isVisible': true
				},
				'LineWidth': {
                    'baseType' : 'NUMBER',
					'defaultValue' : 0.2,
					'isBindingTarget': true,
					'isBindingSource': true,
					'description':'The width of the Gauge ring. Relative. Min/Max:0.1/1.',
					'isVisible': true
				},
				'Data': {
                    'baseType' : 'NUMBER',
					'defaultValue' : 100,
					'isBindingTarget': true,
					'isBindingSource': true,
					'description':'Actual shown value',
					'isVisible': true
				},
				'DebugMode': {
                    'baseType' : 'BOOLEAN',
					'defaultValue' : false,
					'description':'Writes warn messages at specific times in the Developer Tools console.',
					'isVisible': true
				},
				'DebugContext': {
                    'baseType' : 'STRING',
					'defaultValue' : '',
					'description':'Custom string that will be appended in the front of the Debug messages. Useful to understand which widget triggered this in case of multiple uses in a collection. You must have the DebugContext as the first bounded parameter in a collection for this to work',
					'isBindingTarget': true,
					'isVisible': false
				},
				
				'MinValue': {
                    'baseType' : 'NUMBER',
					'defaultValue' : 0,
					'isBindingTarget': true,
					'isBindingSource': true,
					'description':'Minimum value',
					'isVisible': true
				},
				'MaxValue': {
                    'baseType' : 'NUMBER',
					'defaultValue' : 100,
					'isBindingTarget': true,
					'isBindingSource': true,
					'description':'Maximum value',
					'isVisible': true
				},
				'DataLabelTopAlignement': {
                    'baseType' : 'NUMBER',
					'defaultValue' : 60,
					'isBindingTarget': true,
					'isBindingSource': true,
					'description':'Top alignement for the Data Label; Min/Max:0/100; Unit of measure: %',
					'isVisible': true
				},/* 
				'DataLabelLeftAlignement': {
                    'baseType' : 'NUMBER',
					'defaultValue' : 50,
					'isBindingTarget': true,
					'isBindingSource': true,
					'description':'Left alignement for the Data Label; Min/Max:0/100; Unit of measure: %',
					'isVisible': true
				}, */
				//The gauge library does not support units of measure
				/* 'DataLabelUnitOfMeasure': {
                    'baseType' : 'STRING',
					'defaultValue' : '',
					'description':'Unit of Measure used for the Data Label. Leave empty if you do not want anything displayed',
					'isBindingTarget': true,
					'isBindingSource': true,
					'isVisible': true
				}, */
				'DataLabelFont': {
                    'baseType' : 'STRING',
					'defaultValue' : '400 20px sans-serif',
					'description':'Sets the Data Label HTML font style. For examples, search on W3Schools the "style font property"',
					'isBindingTarget': true,
					'isBindingSource': true,
					'isVisible': true
				},
				'DataLabelFractionDigits': {
                    'baseType' : 'NUMBER',
					'defaultValue' : '0',
					'description':'Sets the Data Label fraction digits. 0 is standard which means no digits are displayed',
					'isBindingTarget': true,
					'isBindingSource': true,
					'isVisible': true
				},
				'DataLabelBorderWidth': {
                    'baseType' : 'STRING',
					'defaultValue' : '3',
					'description':'Sets the Data Label HTML border width',
					'isBindingTarget': true,
					'isBindingSource': true,
					'isVisible': true
				},
				'AnimationSpeed': {
                    'baseType' : 'NUMBER',
					'defaultValue' : 1,
					'isBindingTarget': true,
					'isBindingSource': true,
					'description':'Animation speed. Min/Max: 1/128. 1 is the fastest, 128 is the slowest',
					'isVisible': true
				},
				'ShowTicks': {
                    'baseType' : 'BOOLEAN',
					'defaultValue' : true,
					'description':'Show render ticks.',
					'isBindingTarget': true,
					'isBindingSource': true,
					'isVisible': true
				},
				'DivisionCount': {
                    'baseType' : 'NUMBER',
					'defaultValue' : 5,
					'isBindingTarget': true,
					'isBindingSource': true,
					'description':'Number of main ticks',
					'isVisible': true
				},
				'DivisionWidth': {
                    'baseType' : 'NUMBER',
					'defaultValue' : 1.1,
					'isBindingTarget': true,
					'isBindingSource': true,
					'description':'Tick width',
					'isVisible': true
				},
				'DivisionLength': {
                    'baseType' : 'NUMBER',
					'defaultValue' : 0.7,
					'isBindingTarget': true,
					'isBindingSource': true,
					'description':'Fractional percentage of the height of your arc line. 0.7=70%',
					'isVisible': true
				},
				'DivisionColor': {
                    'baseType' : 'STRING',
					'defaultValue' : '#333333',
					'description':'Division color. Must be in Hex format.',
					'isBindingTarget': true,
					'isBindingSource': true,
					'isVisible': true
				},
				'SubdivisionCount': {
                    'baseType' : 'NUMBER',
					'defaultValue' : 3,
					'isBindingTarget': true,
					'isBindingSource': true,
					'description':'Number of secondary ticks',
					'isVisible': true
				},
				'SubdivisionWidth': {
                    'baseType' : 'NUMBER',
					'defaultValue' : 0.6,
					'isBindingTarget': true,
					'isBindingSource': true,
					'description':'Secondary tick width',
					'isVisible': true
				},
				'SubdivisionLength': {
                    'baseType' : 'NUMBER',
					'defaultValue' : 0.5,
					'isBindingTarget': true,
					'isBindingSource': true,
					'description':'Fractional percentage of the height of your arc line. 0.7=70%',
					'isVisible': true
				},
				'SubdivisionColor': {
                    'baseType' : 'STRING',
					'defaultValue' : '#666666',
					'description':'Subdivision color. Must be in Hex format.',
					'isBindingTarget': true,
					'isBindingSource': true,
					'isVisible': true
				},
				'StaticLabels': {
                    'baseType' : 'BOOLEAN',
					'defaultValue' : true,
					'description':'Displays values outside of the gauge arc',
					'isBindingTarget': true,
					'isBindingSource': true,
					'isVisible': true
				},
				'StaticLabelsFont': {
                    'baseType' : 'STRING',
					'defaultValue' : '13px sans-serif',
					'description':'Static labels font size and name ',
					'isBindingTarget': true,
					'isBindingSource': true,
					'isVisible': true
				},
				'StaticLabelsText': {
                    'baseType' : 'STRING',
					'defaultValue' : '',
					'description':'Static labels text. Example: [0, 25, 40, 75, 60, 80, 100]',
					'isBindingTarget': true,
					'isBindingSource': true,
					'isVisible': true
				},
				'StaticLabelsColor': {
                    'baseType' : 'STRING',
					'defaultValue' : '#000000',
					'description':'Static labels color. Must be in hexadecimal format',
					'isBindingTarget': true,
					'isBindingSource': true,
					'isVisible': true
				},
				'StaticLabelsFractionDigits': {
                    'baseType' : 'NUMBER',
					'defaultValue' : 0,
					'description':'Static labels numerical precision. 0=round off',
					'isBindingTarget': true,
					'isBindingSource': true,
					'isVisible': true
				},
				
				'ShowValuesAtStateFormattingSteps': {
                    'baseType' : 'BOOLEAN',
					'defaultValue' : false,
					'description':'Shows values outside of the gauge at the StateFormatting values',
					'isBindingTarget': true,
					'isBindingSource': true,
					'isVisible': true
				},
				'ShowValuesAtDivisionTicks': {
                    'baseType' : 'BOOLEAN',
					'defaultValue' : false,
					'description':'Shows values outside of the gauge at the Division ticks. Do not set this to true if ShowTicks is set to false.',
					'isBindingTarget': true,
					'isBindingSource': true,
					'isVisible': true
				}
				
			}
		};
	};
	 this.widgetServices = function () {
        return {
        };
    };
	 this.widgetEvents = function() {
      return {
        
      };
   };
	 this.renderHtml = function () {
	
        var html = '';
        html += '<div class="widget-content">';
        html += '<span>Vlads Gauge Widget here</span>';
        html += '</div>';
        return html;
    };
	
	this.afterRender = function () {
		//Nothing is rendered in the Mashup builder in edit mode.

};
		//this method is called anytime the user sets a property in the Mashup Builder
	    this.afterSetProperty = function (name, value) {
		//1. We check which property was modified. Only certain properties require visibility changes in other properties
		if (name==="DebugMode")
		{
			//1.1 We retrieve all the widget properties
			var properties = this.allWidgetProperties().properties;
			//1.2 Based on the new value of the property, we set the isVisible aspect for a dependent property
			(value===true)?properties["DebugContext"].isVisible = true:properties["DebugContext"].isVisible=false;
			//1.3 The properties are updated now. Setting isVisible is not enough to trigger the rendering.
			this.updatedProperties();
		}
		if (name==="ShowTicks")
		{
			//1.1 We retrieve all the widget properties
			var properties = this.allWidgetProperties().properties;
			//1.2 If show ticks is false, then any of the Division properties should not be seen
			(value===true)?properties["DivisionCount"].isVisible = true:properties["DivisionCount"].isVisible=false;
			(value===true)?properties["DivisionWidth"].isVisible = true:properties["DivisionWidth"].isVisible=false;
			(value===true)?properties["DivisionLength"].isVisible = true:properties["DivisionLength"].isVisible=false;
			(value===true)?properties["DivisionColor"].isVisible = true:properties["DivisionColor"].isVisible=false;

			(value===true)?properties["SubdivisionCount"].isVisible = true:properties["SubdivisionCount"].isVisible=false;
			(value===true)?properties["SubdivisionWidth"].isVisible = true:properties["SubdivisionWidth"].isVisible=false;
			(value===true)?properties["SubdivisionLength"].isVisible = true:properties["SubdivisionLength"].isVisible=false;
			(value===true)?properties["SubdivisionColor"].isVisible = true:properties["SubdivisionColor"].isVisible=false;

			if (value===true){
				properties["ShowValuesAtDivisionTicks"].isVisible = true;
				}
				else {properties["ShowValuesAtDivisionTicks"].isVisible=false;
				this.setProperty("ShowValuesAtDivisionTicks",false);
			}
		
			//1.3 The properties are updated now. Setting isVisible is not enough to trigger the rendering.
			this.updatedProperties();
		}
		
		

		//2. If this function returns true, then all the widget properties are rendered again (see ThingWorx Development Guide)
		return false;
	};
	

};