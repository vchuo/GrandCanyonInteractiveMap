var VernonChuo = VernonChuo || {};

VernonChuo.GrandCanyonInteractiveMapDimensions = function() {
	// constant for the width (in pixels) of the basemap image used
	var MAP_WIDTH = 2700,

	// constant for the height (in pixels) of the basemap image used
		MAP_HEIGHT = 2066;

	/**
	 * Sets loading screen dimensions and displays it.
	 */
	function displayLoadingScreenForInitialPageLoad() {
		document.getElementById("loading_screen").style.display = "block";
		setLoadingScreenDimensions();
	}

	/**
	 * Sets the dimensions of the loading screen and positions it so that it
	 * is either centered vertically. Horizontal centering is achieved using css.
	 */
	function setLoadingScreenDimensions() {
	 	var div_dimensions = getWindowAdjustedDivDimensions(),
	 		div_width = div_dimensions[0],
			div_height = div_dimensions[1];

		document.getElementById("loading_screen").style.height = div_height+"px";
		document.getElementById("loading_screen").style.width = div_width+"px";

		var offset_to_center_loading_screen_vertically = (window.innerHeight - div_height) / 2;
		document.getElementById("loading_screen").style.top = offset_to_center_loading_screen_vertically+"px";
		document.getElementById("loading_screen").style.bottom = "auto";
	 }

	/**
	 * This function resizes a set of html objects to fit to the size of the browser
	 * window.
	 */
	function setContentDimensions() {
		var div_dimensions = getWindowAdjustedDivDimensions(),
			div_width = div_dimensions[0],
			div_height = div_dimensions[1];

		document.getElementById("loading_screen").style.height = div_height+"px";
		document.getElementById("loading_screen").style.width = div_width+"px";
		document.getElementById("map_content_wrapper").style.height = div_height+"px";
		document.getElementById("map_content_wrapper").style.width = div_width+"px";
		document.getElementById("focal").style.height = div_height+"px";
		document.getElementById("focal").style.width = div_width+"px";
		document.getElementById("container").style.height = div_height+"px";
		document.getElementById("container").style.width = div_width+"px";
		document.getElementById("panzoom_parent").style.height = div_height+"px";
		document.getElementById("panzoom_parent").style.width = div_width+"px";
		document.getElementById("panzoom").style.height = div_height+"px";
		document.getElementById("panzoom").style.width = div_width+"px";
		document.getElementById("StationPointIconsSVGLayer").style.height = div_height+"px";
		document.getElementById("StationPointIconsSVGLayer").style.width = div_width+"px";
		document.getElementById("StationPointSVGLayerName").style.height = div_height+"px";
		document.getElementById("StationPointSVGLayerName").style.width = div_width+"px";
		document.getElementById("StationPointPopupDiv").style.height = div_height+"px";
		document.getElementById("StationPointPopupDiv").style.width = div_width+"px";

		var ViewshedSVGs = document.getElementsByClassName("ViewshedSVG"); // get all viewshed SVGs
		for(var i = 0; i < ViewshedSVGs.length; i++) {
			ViewshedSVGs[i].style.width = div_width+"px";
			ViewshedSVGs[i].style.height = div_height+"px";
		}

		var ViewshedPNGs = document.getElementsByClassName("ViewshedPNG"); // get all viewshed PNGs
		for(var i = 0; i < ViewshedPNGs.length; i++) {
			ViewshedPNGs[i].style.width = div_width+"px";
			ViewshedPNGs[i].style.height = div_height+"px";
		}

		var offset_to_center_map_viewport_vertically = (window.innerHeight - div_height) / 2;
		document.getElementById("loading_screen").style.top = offset_to_center_map_viewport_vertically+"px";
		document.getElementById("loading_screen").style.bottom = "auto";
		document.getElementById("map_content_wrapper").style.top = offset_to_center_map_viewport_vertically+"px";
		document.getElementById("loading_screen").style.bottom = "auto";
	}

	/**
	 * Returns the width and height that all divs need to have to be
	 * centered in the window.
	 */
	 function getWindowAdjustedDivDimensions() {
	 	var height = window.innerHeight,
			width = window.innerWidth,
			div_height,
			div_width,
			MIN_WINDOW_HEIGHT = 574,
			MIN_WINDOW_WIDTH = 750;

		// restrict map from resizing to a size smaller than its
		// minimum-allowed size
		if(height < MIN_WINDOW_HEIGHT && width < MIN_WINDOW_WIDTH) {
			height = MIN_WINDOW_HEIGHT;
			width = MIN_WINDOW_WIDTH;
		} else if (height < MIN_WINDOW_HEIGHT) {
			height = MIN_WINDOW_HEIGHT;
		} else if (width < MIN_WINDOW_WIDTH) {
			width = MIN_WINDOW_WIDTH;
		}
		
		// calculates new dimensions of divs to fit window size while
		// maintaining aspect ratio; aspect ratio is determined
		// by original basemap image size
		if(width/height > MAP_WIDTH/MAP_HEIGHT) {
			div_height = height;
			div_width = div_height*MAP_WIDTH/MAP_HEIGHT;
		} else {
			div_width = width;
			div_height = div_width*MAP_HEIGHT/MAP_WIDTH;
		}

		return [div_width,div_height];
	}

	var public_objects =
	{
		displayLoadingScreenForInitialPageLoad : displayLoadingScreenForInitialPageLoad,
		setContentDimensions : setContentDimensions
	};

	return public_objects;
}();