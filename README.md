# thingworx-canvasgauge-widget
[Unofficial/Not Supported] HTML5 Canvas-based Gauge (based on https://github.com/bernii/gauge.js )

### Wrapper for https://github.com/bernii/gauge.js that allows a Gauge with the following characteristics:
-Canvas-based rendering (less drawing time, lighter DOM)

-Debug Mode for easier debugging when in a ThingWorx Collection Widget

-Old/New property value check to reduce unnecessary redraws

-supports ThingWorx state-based formatting

-supports animations

Notes:

-it implements only the Gauge

-even if all the properties are binding sources and targets, only a couple of them are taken into consideration. Look in the runtime.js file in the updateProperty function to see the ones that were implemented.

The project was created in Visual Studio and it does not use any ant/gradle build system.
Packaging the extension is done by zipping the ui and metadata.xml in a zip file.
