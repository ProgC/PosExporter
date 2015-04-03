// Export Layer Info to external file.
// Author : Kiyoung Moon
// Original code by bronzehedwick.

#target photoshop
app.bringToFront();

// Set active Document variable and decode name for output
var docRef = app.activeDocument;
var docName = decodeURI(activeDocument.name);

// Define pixels as unit of measurement
var defaultRulerUnits = preferences.rulerUnits;
preferences.rulerUnits = Units.PIXELS;

// Define variable for the number of layers in the active document
var layerNum = app.activeDocument.artLayers.length;

// track how many layers we exported.
var exportedLayerNum = 0;

// Define variable for the active layer in the active document
var layerRef = app.activeDocument.activeLayer;

// Define varibles for x and y of layers
var x = layerRef.bounds[0].value;
var y = layerRef.bounds[1].value;

// Contains all of position data!
var coords = "";

// Loop to iterate through all layers
function recurseLayers(currLayers) {
  for ( var i = 0; i < currLayers.layers.length; i++ ) {
    layerRef = currLayers.layers[i];
	
	if ( layerRef.visible == true )
	{	
		exportedLayerNum++;
		x = layerRef.bounds[0].value;
		y = layerRef.bounds[1].value;
		
		var x2 = layerRef.bounds[2].value;
		var y2 = layerRef.bounds[3].value;
		
		var width = x2 - x;
		var height = y2 - y;
				
		coords += layerRef.name + "\n";
		coords += x + " " + y + " " + width + " " + height + "\n";
		
		//test if it's a layer set
		if ( isLayerSet(currLayers.layers[i]) ) {
		  recurseLayers(currLayers.layers[i]);
		}
	}
  }
}

function isLayerSet(layer) {
  try {
    if ( layer.layers.length > 0 ) {
      return true;
    }
  }
  catch(err) {
    return false;
  }
}

// Ask the user for the folder to export to
var FPath = Folder.selectDialog("Save exported coordinates to");

// Detect line feed type
if ( $.os.search(/windows/i) !== -1 ) {
  fileLineFeed = "Windows";
}
else {
  fileLineFeed = "Macintosh";
}

// Export to txt file
function writeFile(info) {
  try {
    var f = new File(FPath + "/" + docName + ".txt");		
    f.remove();
    f.open('w', "TEXT");
    f.lineFeed = fileLineFeed;
    f.write(info);
    f.close();
  }
  catch(e){}
}

// Run the functions
recurseLayers(docRef);
preferences.rulerUnits = defaultRulerUnits; // Set preferences back to user 's defaults
writeFile(coords);

// Show results
if ( FPath == null ) {
  alert("Export aborted", "Canceled");
}
else {
  alert("Exported " + exportedLayerNum + " layer's coordinates to " + FPath + "/" + docName + ".txt " + "using " + fileLineFeed + " line feeds.", "Success!");
}
