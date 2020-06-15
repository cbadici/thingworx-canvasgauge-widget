TW.Runtime.Widgets.canvasgauge = function () {


	var localGauge;
	var opts, dbl_minValue, dbl_MaxValue, bool_SL, str_SLFont, str_SLText, str_SLColor, dbl_SLDigits, dbl_DataLabelTopAlignement, str_DataLabelFontWeight, dbl_RadiusScale, dbl_DataLabelFractionDigits,
		dbl_lineWidth, dbl_DataLabelBorderWidth, bool_DebugMode, str_DebugContext, str_PointerColor, json_RAWConfiguration, bool_IsRawConfig;
	//htmlElements
	var textDiv, gaugeCanvas;

	this.renderHtml = function () {
		var html = '<div class="widget-content widget-CanvasGauge">' +
			'<canvas> </canvas>' +
			//placeholder for the value
			(this.getProperty("IsJSONConfigured") === true ? '' : ('<div class="gaugeText" style="top:' + this.getProperty("DataLabelTopAlignement") + '%;font:' + this.getProperty("DataLabelFont") + ';z-index:-1;width:32px;text-align:center;"> </div>')) +
			'</div>';

		//since 8.5.1 includes requirejs, we need to properly load the modules after they were loaded there
		if (typeof window.define === 'function' && (window.define.amd != null)) {
			window.__define = window.define;
			window.define = undefined;
		}
		InitBerniisGaugeLib(window);
		if (typeof window.__define === 'function' && (window.__define.amd != null)) {
			window.define = window.__define;
			window.__define = undefined;
		}

		if (this.getProperty("DebugMode") === true) console.warn(new Date().toISOString() + str_DebugContext + ' Gauge entered the renderHtml() function.');

		return html;
	};



	//Utility function that converts from RGBA format to Hex. Used here because the Gauge library uses only Hex as a color format, and ThingWorx supplies that as RGBA
	function RGBAToHexA(value) {
		arrayValues = value.substring(value.indexOf("(", 0) + 1, value.indexOf(")", 0)).split(",");
		arrayValues = arrayValues.map(Number);
		r = arrayValues[0].toString(16);
		g = arrayValues[1].toString(16);
		b = arrayValues[2].toString(16);
		a = Math.round(arrayValues[3] * 255).toString(16);

		if (r.length == 1)
			r = "0" + r;
		if (g.length == 1)
			g = "0" + g;
		if (b.length == 1)
			b = "0" + b;
		if (a.length == 1)
			a = "0" + a;

		return "#" + r + g + b;
	}

	//Utility function that converts a ThingWorx StateFormat to a Bernie StateFormat
	function convertTWSFtoBernieSF(twSF, functionMinValue, functionMaxVal) {

		var staticZones = [];
		for (var x = 0; x < twSF.StateFormats.length; x++) {

			var stateFormat = twSF.StateFormats[x];
			var hexColor = RGBAToHexA(stateFormat.state.backgroundColor);
			var localMinValue = (x === 0) ? functionMinValue : parseFloat(staticZones[staticZones.length - 1].max);
			//this is the last state formatting, the default one from ThingWorx. It does not have a value, so we consider that as the globalMaxValue
			var localMaxValue = (stateFormat.value === undefined) ? functionMaxVal : parseFloat(stateFormat.value);
			//Global Max Value might be old
			if (functionMaxVal < localMinValue) {
				functionMaxVal = localMinValue;
				localMaxValue = localMinValue;
			}

			staticZones.push({ strokeStyle: hexColor, min: localMinValue, max: localMaxValue });
		}
		return staticZones;

	}

	function validateStateZones(stateZone) {
		var bool_IsValid = true;
		for (var m = 0; m < stateZone.length; m++) {
			var max = stateZone[m].max, min = stateZone[m].min;

			if (min == null || min == undefined || max == undefined || max == null || min == max) {
				bool_IsValid = false;
			}
		}
		return bool_IsValid;
	}

	//function to get the static labels text in case the property value is empty
	function GetStaticLabels(opts, widgetElement) {
		var staticLabels = [];
		var staticZones = opts.staticZones;
		//Should we display Values at the State Formatting Steps?
		if (widgetElement.getProperty('ShowValuesAtStateFormattingSteps') === true) {
			staticZones.forEach(element => { staticLabels.push(element.max); });
			staticLabels.push(staticZones[0].min);
		}
		//Should we display Values at the Division Ticks? (Minor ticks are not considered here)
		if (widgetElement.getProperty('ShowValuesAtDivisionTicks') === true) {
			var numberOfTicks = opts.renderTicks.divisions;
			var range = dbl_MaxValue - dbl_minValue;
			for (var k = 1; k <= numberOfTicks; k++) {
				staticLabels.push(range * k / numberOfTicks);
			}

		}

		staticLabels.sort();

		return staticLabels;

	}

	//basic check if a string is JSON format 
	function processJSON(JSONObject) {
		let noOfKeys = Object.keys(JSONObject).length;
		if (noOfKeys > 0 && noOfKeys<4)
		{return JSONObject;
		}
		else 

		{
			return JSON.parse(JSONObject);
		}
		
	}

	function isValidJSON(JSONObject)
	{
		let noOfKeys = Object.keys(JSONObject).length;
		return (noOfKeys > 0 && noOfKeys<4);
	}

	function setConfig(localGauge, json_RAWConfiguration, gaugeCanvas) {
		// fix for mashup builder conversion to string from Expression
		json_RAWConfiguration = processJSON(json_RAWConfiguration);
		if (isValidJSON(json_RAWConfiguration)) {
			if (bool_DebugMode) console.warn(new Date().toISOString() + str_DebugContext + ' New configuration received. Content: ' + JSON.stringify(json_RAWConfiguration));
			if (json_RAWConfiguration.recreate && json_RAWConfiguration.recreate === true)
				localGauge = new Gauge(gaugeCanvas);
			if (json_RAWConfiguration.methods) {
				for (var i = 0; i < json_RAWConfiguration.methods.length; i++) {
					let keyName = Object.keys(json_RAWConfiguration.methods[i])[0];
					let keyValue = json_RAWConfiguration.methods[i][keyName];
					localGauge[keyName](keyValue);
					//for the resize function to work without modifications
					if (keyName == "setOptions") opts = keyValue;
				}
			}
			if (json_RAWConfiguration.properties) {
				for (var i = 0; i < json_RAWConfiguration.properties.length; i++) {
					let keyName = Object.keys(json_RAWConfiguration.properties[i])[0];
					let keyValue = json_RAWConfiguration.properties[i][keyName];
					localGauge[keyName] = keyValue;
				}
			}
		}

	}


	this.afterRender = function () {
		textDiv = this.jqElement[0].childNodes[1];
		gaugeCanvas = this.jqElement[0].childNodes[0];
		gaugeCanvas.width = this.jqElement[0].offsetWidth;
		gaugeCanvas.height = this.jqElement[0].offsetHeight;
		//all the getProperty calls that happen in afterRender retrieve the values set in Composer (not the values obtained from the bindings).
		bool_IsRawConfig = this.getProperty('IsJSONConfigured');
		dbl_MaxValue = this.getProperty('MaxValue');
		dbl_minValue = this.getProperty('MinValue');
		var showTicks = this.getProperty('ShowTicks');
		bool_SL = this.getProperty('StaticLabels');
		bool_DebugMode = this.getProperty('DebugMode');
		dbl_RadiusScale = this.getProperty("RadiusScale");
		dbl_lineWidth = this.getProperty("LineWidth");
		dbl_DataLabelFractionDigits = this.getProperty('DataLabelFractionDigits');
		if (bool_IsRawConfig === false) textDiv.style.borderWidth = this.getProperty('DataLabelBorderWidth') + 'px';
		str_DebugContext = this.getProperty('DebugContext');
		str_PointerColor = this.getProperty('PointerColor');
		json_RAWConfiguration = this.getProperty('JSONConfiguration');

		//bool_IsRawConfig = isValidJSON(json_RAWConfiguration);


		//parsing the state formatting in the format recognized by this library
		if (bool_IsRawConfig === true) {
			//initialize the gauge first time
			if (!localGauge) localGauge = new Gauge(gaugeCanvas);
			setConfig(localGauge, json_RAWConfiguration, gaugeCanvas);
			if (bool_DebugMode) console.warn(new Date().toISOString() + str_DebugContext + ' Gauge was initialized first time from RAW Json.');
		}
		else {
			opts = {
				angle: this.getProperty('Angle'), /// The span of the gauge arc
				lineWidth: this.getProperty('LineWidth'), // The line thickness
				radiusScale: dbl_RadiusScale,
				lineWidth: dbl_lineWidth,
				pointer: {
					length: 0.54, // Relative to gauge radius
					strokeWidth: 0.035, // The thickness
					color: str_PointerColor
				},
				limitMax: this.getProperty('LimitMax'),
				limitMin: this.getProperty('LimitMin'),
				colorStart: this.getProperty('ColorStart'),   // Colors
				strokeColor: this.getProperty('StrokeColor'),   // to see which ones work best for you
				generateGradient: false,
				highDpiSupport: this.getProperty('HighDpiSupport')
			};
			var stateFormats = this.getProperty('StateFormatting');
			if (stateFormats !== undefined) {

				opts.staticZones = convertTWSFtoBernieSF(stateFormats, dbl_minValue, dbl_MaxValue);
			}
			if (showTicks !== undefined && showTicks === true) {
				opts.renderTicks = {
					divisions: this.getProperty('DivisionCount'),
					divWidth: this.getProperty('DivisionWidth'),
					divLength: this.getProperty('DivisionLength'),
					divColor: this.getProperty('DivisionColor'),
					subDivisions: this.getProperty('SubdivisionCount'),
					subLength: this.getProperty('SubdivisionLength'),
					subWidth: this.getProperty('SubdivisionWidth'),
					subColor: this.getProperty('SubdivisionColor')

				};

			}
			if (bool_SL !== undefined && bool_SL === true) {
				opts.staticLabels = {
					font: this.getProperty('StaticLabelsFont'),
					labels: this.getProperty('StaticLabelsText') === "" ? GetStaticLabels(opts, this) : this.getProperty('StaticLabelsText'),
					color: this.getProperty('StaticLabelsColor'),
					fractionDigits: this.getProperty('StaticLabelsFractionDigits')
				}

			}

			//the Gauge constructor needs a HTML canvas as a constructor
			localGauge = new Gauge(gaugeCanvas).setOptions(opts); // create gauge!
			if (bool_DebugMode) console.warn(new Date().toISOString() + str_DebugContext + ' After render init: ' + JSON.stringify(opts.staticZones));
			//the gauge needs a HTML div to write its value;
			localGauge.setTextField(textDiv, dbl_DataLabelFractionDigits);

			localGauge.maxValue = this.getProperty('MaxValue'); // set max gauge value
			localGauge.animationSpeed = this.getProperty('AnimationSpeed');
			localGauge.setMinValue(this.getProperty('MinValue'));  // set min value
			localGauge.set(this.getProperty('Data'));
		}
		if (bool_DebugMode) console.warn(new Date().toISOString() + str_DebugContext + ' After render init finished. Static Zones: ' + JSON.stringify(opts.staticZones));

	};

	//platform function which is called each time we bind a new value to a bindable property
	this.updateProperty = function (updatePropertyInfo) {
		var widgetElement = this.jqElement;

		// TargetProperty tells you which of your bound properties changed
		if (updatePropertyInfo.TargetProperty === 'Data') {
			//don't trigger redraw if the new value = old value; no longer requires the expressions
			var newValue = parseFloat(updatePropertyInfo.SinglePropertyValue);
			if (bool_IsRawConfig == false && localGauge.value !== newValue) localGauge.set(newValue);
		}
		if (updatePropertyInfo.TargetProperty === 'MinValue' && updatePropertyInfo.SinglePropertyValue != undefined) {
			//don't trigger redraw if the new value = old value; no longer requires the expressions
			var newValue = parseFloat(updatePropertyInfo.SinglePropertyValue);
			if (bool_IsRawConfig == false && localGauge.minValue !== newValue) {
				dbl_minValue = newValue;

				var newSF = convertTWSFtoBernieSF(this.getProperty('StateFormatting'), dbl_minValue, dbl_MaxValue);
				//2. Apply the new zones only if the new static zones are different than the old ones
				if (JSON.stringify(localGauge.options.staticZones) !== JSON.stringify(newSF)) {
					opts.staticZones = newSF;
					localGauge.setOptions(opts);

				}
				localGauge.setMinValue(newValue);
				localGauge.ctx.clearRect(0, 0, localGauge.ctx.canvas.width, localGauge.ctx.canvas.height);
				localGauge.render();
				if (bool_DebugMode) console.warn(new Date().toISOString() + str_DebugContext + ' Different Min Value detected and set: ' + newValue + '/n' + "; new Calculated StateFormatting is: " + JSON.stringify(newSF));
			}
		}
		if (updatePropertyInfo.TargetProperty === 'MaxValue' && updatePropertyInfo.SinglePropertyValue != undefined) {
			//don't trigger redraw if the new value = old value; no longer requires the expressions


			var newValue = parseFloat(updatePropertyInfo.SinglePropertyValue);
			if (bool_IsRawConfig == false && localGauge.maxValue !== newValue) {
				dbl_MaxValue = newValue;
				var newSF = convertTWSFtoBernieSF(this.getProperty('StateFormatting'), dbl_minValue, dbl_MaxValue);
				//2. Apply the new zones only if the new static zones are different than the old ones
				if (JSON.stringify(localGauge.options.staticZones) !== JSON.stringify(newSF)) {
					opts.staticZones = newSF;
					localGauge.setOptions(opts);
				}
				localGauge.maxValue = newValue;
				localGauge.ctx.clearRect(0, 0, localGauge.ctx.canvas.width, localGauge.ctx.canvas.height);
				localGauge.render();
				if (bool_DebugMode) console.warn(new Date().toISOString() + str_DebugContext + ' Different Max Value detected and set: ' + newValue + '/n' + "; new Calculated StateFormatting is: " + JSON.stringify(newSF));
			}
		}

		if (updatePropertyInfo.TargetProperty === 'Angle') {
			if (bool_IsRawConfig == false) {
				opts.angle = parseFloat(updatePropertyInfo.RawSinglePropertyValue);
				localGauge.setOptions(opts);
				localGauge.ctx.clearRect(0, 0, localGauge.ctx.canvas.width, localGauge.ctx.canvas.height);
				localGauge.render();
			}
		}

		if (updatePropertyInfo.TargetProperty === 'StateFormatting' && updatePropertyInfo.SinglePropertyValue != undefined) {
			//this is a two step process because once the state based formatting is changed, if show static labels is set, we need to set also the static labels

			//1. Get the new staticZones in the berniie format
			var newSF = convertTWSFtoBernieSF(this.getProperty('StateFormatting'), dbl_minValue, dbl_MaxValue);
			//2. Apply the new zones only if the new static zones are different than the old ones
			if (bool_IsRawConfig == false) {
				if (JSON.stringify(localGauge.options.staticZones) !== JSON.stringify(newSF)) {
					opts.staticZones = newSF;

				}
				//3. If the show static labels is set, we need to update the static labels
				if (bool_SL !== undefined && bool_SL === true && this.getProperty('StaticLabelsText') === "") {
					var new_SL = GetStaticLabels(opts, this);
					if (JSON.stringify(new_SL) != JSON.stringify(opts.staticLabels.labels)) {
						opts.staticLabels.labels = new_SL;
					}
				}
				//4. We set the new options object and rerender the gauge. Snippet obtained from the berniie project site
				localGauge.setOptions(opts);
				if (bool_DebugMode) console.warn(new Date().toISOString() + str_DebugContext + ' StateFormatting property changed;Static Zone set to: ' + JSON.stringify(newSF));
				localGauge.ctx.clearRect(0, 0, localGauge.ctx.canvas.width, localGauge.ctx.canvas.height);
				localGauge.render();

			}
		}
		if (updatePropertyInfo.TargetProperty === 'DivisionCount') {
			if (bool_IsRawConfig == false) {
				opts.renderTicks.divisions = parseInt(updatePropertyInfo.RawSinglePropertyValue);
				localGauge.setOptions(opts);
				localGauge.ctx.clearRect(0, 0, localGauge.ctx.canvas.width, localGauge.ctx.canvas.height);
				localGauge.render();
			}
		}
		if (updatePropertyInfo.TargetProperty === 'DataLabelTopAlignement') {
			var newTop = updatePropertyInfo.SinglePropertyValue;
			if (bool_IsRawConfig == false)
				textDiv.style.top = "" + newTop + "%";

		}
		/* if (updatePropertyInfo.TargetProperty === 'DataLabelLeftAlignement') {
			var newLeft = updatePropertyInfo.SinglePropertyValue;
			textDiv.style.left=""+newLeft+"%";
			
		} */
		if (updatePropertyInfo.TargetProperty === 'RadiusScale') {
			var dbl_newRadiusScale = parseFloat(updatePropertyInfo.RawSinglePropertyValue);
			if (bool_IsRawConfig == false && localGauge.options.radiusScale !== dbl_newRadiusScale) {
				dbl_RadiusScale = dbl_newRadiusScale;
				opts.radiusScale = dbl_newRadiusScale;
				localGauge.setOptions(opts);
				localGauge.ctx.clearRect(0, 0, localGauge.ctx.canvas.width, localGauge.ctx.canvas.height);
				localGauge.render();
			}
		}
		if (updatePropertyInfo.TargetProperty === 'LineWidth') {
			var dbl_newLineWidth = parseFloat(updatePropertyInfo.RawSinglePropertyValue);
			if (bool_IsRawConfig == false && localGauge.options.lineWidth !== dbl_newLineWidth) {
				dbl_lineWidth = dbl_newLineWidth;
				opts.lineWidth = dbl_newLineWidth;
				localGauge.setOptions(opts);
				localGauge.ctx.clearRect(0, 0, localGauge.ctx.canvas.width, localGauge.ctx.canvas.height);
				localGauge.render();
			}
		}
		if (updatePropertyInfo.TargetProperty === 'DataLabelFractionDigits') {
			var dbl_newFractionDigit = parseFloat(updatePropertyInfo.RawSinglePropertyValue);
			if (bool_IsRawConfig == false && localGauge.options.fractionDigits !== dbl_newFractionDigit) {
				dbl_DataLabelFractionDigits = dbl_newFractionDigit;
				localGauge.setTextField(textDiv, dbl_newFractionDigit);
				localGauge.ctx.clearRect(0, 0, localGauge.ctx.canvas.width, localGauge.ctx.canvas.height);
				localGauge.render();
			}
		}
		if (updatePropertyInfo.TargetProperty === 'DebugContext' && updatePropertyInfo.SinglePropertyValue != '') {
			var str_NewDebugContext = updatePropertyInfo.SinglePropertyValue;
			if (str_DebugContext != str_NewDebugContext)
				str_DebugContext = str_NewDebugContext;
		}
		if (updatePropertyInfo.TargetProperty === 'JSONConfiguration') {
			var newJSONRawConfig;
			(updatePropertyInfo.RawDataFromInvoke)?newJSONRawConfig = updatePropertyInfo.RawDataFromInvoke:newJSONRawConfig=updatePropertyInfo.RawSinglePropertyValue ;

			if (bool_IsRawConfig === true) setConfig(localGauge, newJSONRawConfig, gaugeCanvas);
		}





	};

	this.resize = function (width, height) {

		gaugeCanvas.width = this.jqElement[0].offsetWidth;
		gaugeCanvas.height = this.jqElement[0].offsetHeight;
		localGauge.ctx.clearRect(0, 0, localGauge.ctx.canvas.width, localGauge.ctx.canvas.height);
		localGauge.setOptions(opts);
		//	localGauge.render();
	};


}

