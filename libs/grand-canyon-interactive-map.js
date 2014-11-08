var VernonChuo = VernonChuo || {};

VernonChuo.GrandCanyonInteractiveMap = function()
{
	// stores the current horizontal offset of the cursor relative
	// to the left side of the window
	var current_mouse_x_coord,

	// stores the current vertical offset of the cursor relative
	// to the top of the window
		current_mouse_y_coord,

	// constant for the width (in pixels) of the basemap image used
		MAP_WIDTH = 2700,

	// constant for the height (in pixels) of the basemap image used
		MAP_HEIGHT = 2066,

	// constants for the minimum screen width/height (in pixels)
	// under which the application is not displayed and a relevant
	// message is displayed to prompt the user to use a device with
	// a larger screen to view this application
		MIN_SCREEN_WIDTH = 1000,
		MIN_SCREEN_HEIGHT = 600;

	var init = function()
	{
		/**
		 * Initializes and loads map when document is ready.
		 */
		function execute() {
			// only load map if device size meets minimum requirements
			if(isNotAMobileDevice()) {
				GrandCanyonInteractiveMapSVGCode.appendHTMLForStationPointAndViewshedSVGs();
				
				// resizes all content divs to fit window size
				VernonChuo.GrandCanyonInteractiveMapDimensions.setContentDimensions();
				checkWindowSize();
				
				hideAllViewshedPNGs();
				hideAllRolloverIcons();
				LandmarksToggle.hideLandmarksLayer();
				ViewshedAnglesToggle.hideViewshedAnglesLayer();

				ZoomControl.setupPanZoomElement();
				ExploreByStationPointMode.activateMode();
				displayMapElementAfterLoadingIsComplete();
				EventHandlers.attachAllEventHandlers();
			} else {
				hideLoadingScreen();
			}
		}
		
		/**
		 * Helper function called when map is initially loaded.
		 */
		function displayMapElementAfterLoadingIsComplete() {
			$("#map_content_wrapper").css({left: "0"});
		}
		
		/**
		 * Helper function called when map is initially loaded.
		 */
		function hideAllViewshedPNGs() {
			$(".ViewshedPNG").css({display: "none"});
		}

		/**
		 * Helper function called when map is initially loaded.
		 */
		function hideAllRolloverIcons()
		{
			hideAllModeButtonRolloverIcons();
			hideAllZoomButtonRolloverIcons();
			hideAllStationPointRolloverIcons();
		}

		/**
		 * Helper function called when map is initially loaded.
		 */
		function hideAllModeButtonRolloverIcons()
		{
			$("#Mode_Button_One_On").css({display: "none"});
			$("#Mode_Button_One_Hover").css({display: "none"});
			$("#Mode_Button_All_On").css({display: "none"});
			$("#Mode_Button_All_Hover").css({display: "none"});
		}

		/**
		 * Helper function called when map is initially loaded.
		 */
		function hideAllZoomButtonRolloverIcons()
		{
			$("#Zoom_In_Hover").css({display: "none"});
			$("#Zoom_In_In_Use").css({display: "none"});
			$("#Zoom_In_Max_Zoom").css({display: "none"});
			$("#Zoom_Out_Hover").css({display: "none"});
			$("#Zoom_Out_In_Use").css({display: "none"});
			$("#Zoom_Out_Max_Zoom").css({display: "none"});
		}

		/**
		 * Helper function called when map is initially loaded.
		 */
		function hideAllStationPointRolloverIcons()
		{
			var StationPointRolloverIcons = document.getElementsByClassName("StationPointRollover");
			for(var i = 0; i < StationPointRolloverIcons.length; i++) {
				StationPointRolloverIcons[i].style.display = "none";
			}
		}

		var public_objects =
		{
			execute : execute
		};

		return public_objects;
	}();

	var EventHandlers = function()
	{
		/**
		 * Called by init.execute() when document is ready.
		 */
		function attachAllEventHandlers() {
			// Note: the event handler for mousewheel events is attached in the
			// setupPanZoomElement function instead of here
			attachEventHandlersForModeButtons();
			attachEventHandlersForZoomButtons();
			attachEventHandlersForCheckboxes();
			attachEventHandlersForStationPointSVGs();
			attachEventHandlerForStationPointPopupDiv();
			attachEventHandlersForViewshedSVGs();
			attachEventHandlerForIntroductionPopupItems();
			attachEventHandlerForWindowSizeWarningPopup();
			attachEventHandlerForWindowObject();
			attachEventHandlerForDocumentObject();
		}
		
		/**
		 * Attaches event handlers for the "station point" mode and
		 * "location" mode buttons.
		 */
		function attachEventHandlersForModeButtons() {
			$("#station_point_mode").bind({
				click: function(){
					ExploreByStationPointMode.activateMode();
				},
				mouseover: function(){
					ExploreByStationPointMode.displayHint();
				},
				mouseout: function(){
					ExploreByStationPointMode.hideHint();
				}
			});
			$("#location_mode").bind({
				click: function(){
					ExploreByLocationMode.activateMode();
				},
				mouseover: function(){
					ExploreByLocationMode.displayHint();
				},
				mouseout: function(){
					ExploreByLocationMode.hideHint();
				}
			});
		}

		/**
		 * Attaches event handlers for the zoom in and zoom out buttons.
		 */
		function attachEventHandlersForZoomButtons() {
			$("#Zoom_In_Button").bind({
				mousedown: function() {
					ZoomControl.zoomButtonClicked("zoom_in");
				},
				mouseup: function() {
					ZoomControl.zoomButtonReleased();
				},
				mouseover: function() {
					ZoomControl.highlightZoomInButton();
				},
				mouseout: function() {
					ZoomControl.unhighlightZoomInButton();
				}
			});
			$("#Zoom_Out_Button").bind({
				mousedown: function() {
					ZoomControl.zoomButtonClicked("zoom_out");
				},
				mouseup: function() {
					ZoomControl.zoomButtonReleased();
				},
				mouseover: function() {
					ZoomControl.highlightZoomOutButton();
				},
				mouseout: function() {
					ZoomControl.unhighlightZoomOutButton();
				}
			});
		}

		/**
		 * Attaches event handlers for the display landmarks checkbox and the
		 * display viewshed angles checkbox.
		 */
		function attachEventHandlersForCheckboxes() {
			$("#landmarks_checkbox_unchecked").bind({
				click: function() {
					LandmarksToggle.triggerLandmarksToggleEvent();
				},
				mouseover: function() {
					LandmarksToggle.displayHint();
				},
				mouseout: function() {
					LandmarksToggle.hideHint();
				}
			});
			$("#viewshedangles_checkbox_unchecked").bind({
				click: function() {
					ViewshedAnglesToggle.triggerViewshedAnglesToggleEvent();
				},
				mouseover: function() {
					ViewshedAnglesToggle.displayHint();
				},
				mouseout: function() {
					ViewshedAnglesToggle.hideHint();
				}
			});
		}

		/**
		 * Attaches event handlers for all Station Point SVGs. Events will
		 * only be triggered in station point mode (and not location mode).
		 */
		function attachEventHandlersForStationPointSVGs() {
			$.each($(".station_point_svg"), function(index, value) {
				$("#"+value.id).bind({
					mouseover: function() {
						ExploreByStationPointMode.activateStationPointMouseoverEvents(value.id);
					},
					mouseout: function() {
						ExploreByStationPointMode.deactivateStationPointMouseoverEvents();
					},
					click: function() {
						ExploreByStationPointMode.displayStationPointPopup(value.id);
					}
				});
			});
		}

		/**
		 * Attaches event handler for the Station Point Popup Div. The popup div
		 * contains the photo corresponding to the station point that the user
		 * clicked on and has a dimmed background, so if the user clicks on
		 * the dimmed background (the popup div), the popup div will be hid
		 * and the user can return back to exploring other parts of the map.
		 */
		function attachEventHandlerForStationPointPopupDiv() {
			$("#StationPointPopupDiv").click(function(event) {
				ExploreByStationPointMode.hideStationPointPopup(event)
			});
		}

		/**
		 * Attaches event handlers for all Viewshed SVGs. Events will only
		 * be triggered in location mode (and not station point mode),
		 * where the user can drag his cursor around the map to see all the
		 * photos in which the location the cursor is pointing to is visible.
		 */
		function attachEventHandlersForViewshedSVGs() {
			$.each($(".ViewshedSVG"), function(index, value) {
				$("#"+value.id).click(function() {
					ExploreByLocationMode.displayLocationModePopup();
				});
			});
		}

		/**
		 * Attaches event handlers for all introduction popup items: the
		 * introduction popup itself and the button that displays the
		 * introduction popup when the cursor hovers over it. Initially
		 * when the map is loaded, the indroduction popup is displayed
		 * and the user is prompted to close the popup by clicking on the
		 * popup itself. Thereafter, if the user wants to revisit the
		 * introduction popup, he can mouse over the corresponding popup
		 * button.
		 */
		function attachEventHandlerForIntroductionPopupItems() {
			$("#introduction_popup").click(function() {
				$("#introduction_popup_container").css({left: "-99999px", right: "auto",
															backgroundColor: "transparent"});
				$(".introduction_popup_hint").remove();
				$("#introduction_popup_button").css({display: "block"});
				$("#introduction_popup_button").animate({opacity: 1}, 1500);
				$("#introduction_popup_content").css({marginTop: "35px", marginBottom: "40px"});
			});
			$("#introduction_popup_button").bind({
				mouseover: function() {
					$("#introduction_popup_container").css({left: "0", right: "auto"});
				},
				mouseout: function() {
					$("#introduction_popup_container").css({left: "-99999px", right: "auto"});
				}
			});
		}

		/**
		 * Attaches event handler for window size warning popup. The map
		 * has a minimum size under which it will no longer resize smaller
		 * as the window is resized smaller. When the window is resized small
		 * enough such that the map is not fully displayed (since it has already
		 * reached its minimum size and is no longer resizing smaller), a
		 * warning popup is displayed to prompt the user to expand the window
		 * to view the map in its entirety. The popup disappears when the user
		 * expands the window sufficiently to display the map in its entirety,
		 * when the user clicks on the popup.
		 */
		function attachEventHandlerForWindowSizeWarningPopup() {
			$("#window_size_warning_popup").click(function() {
				$("#window_size_warning_popup").css({display: "none"});
			})
		}

		/**
		 * Attaches event handlers for the window object. The loading screen
		 * initially displayed is hid when the window is loaded, and the
		 * map is resized when the window is resized (check resizePageContents()
		 * and its helper functions to learn more about the minimum size set for
		 * the map).
		 */
		function attachEventHandlerForWindowObject() {
			$(window).bind({
				load : function() {		
					hideLoadingScreen();
				},
				resize : function() {
					resizePageContents();
				}
			});
		}

		/**
		 * Attaches event handlers for the document object. The mousemove event
		 * handler that updates the user's cursor coordinates to help determine
		 * location mode events (when location mode is activated) is attached to
		 * document object instead of the map element itself for better accuracy
		 * when the map is being dragged fast.
		 */
		function attachEventHandlerForDocumentObject() {
			$(document).mousemove(function(event) {
				trackMouseCoordsAndCheckForExploreByLocationModeEvents(event);
			});
		}

		/**
		 * Helper function called by the resize event handler for the window object.
		 * It resets the zoom level of the map back to the minimum zoom level (there
		 * is a bug with the map not being contained inside its own viewport if the
		 * map is resized to a zoom level that is not its minimum zoom level) and calls
		 * the VernonChuo.GrandCanyonInteractiveMapDimensions.setContentDimensions()
		 * helper function which helps resize all the content divs of the map element
		 * accordingly.
		 */
		function resizePageContents() {
			displayLoadingScreen();

			var panzoom = $("#focal").find(".panzoom").panzoom();
			// resets panzoom element back to default settings because window resize may
			// temporarily violate containment of the panzoom element
			panzoom.panzoom("reset");
			VernonChuo.GrandCanyonInteractiveMapDimensions.setContentDimensions();
			checkWindowSize();
			// window is resized so to maintain containment of the map within the
			// map viewport, dimensions of the panzoom element must be recalculated
			panzoom.panzoom("resetDimensions");
			ZoomControl.resetZoomLevelToDefault();

			setTimeout(function(){
				hideLoadingScreen();
			},2000);
		}

		/**
		 * Helper function called by the mousemove event handler for the document
		 * object. It updates the coordinates of the cursor and makes calls to
		 * a helper function to check for location mode mouseover events.
		 */
		function trackMouseCoordsAndCheckForExploreByLocationModeEvents(event) {
			// store current mouse coordinates
			current_mouse_x_coord = event.clientX;
			current_mouse_y_coord = event.clientY;
			// if location mode is active, check for location mode events
			if(ExploreByLocationMode.getExploreByLocationModeStatus()) {
				ExploreByLocationMode.checkLocationModeMouseoverEvents();
			}
		}

		var public_objects =
		{
			attachAllEventHandlers : attachAllEventHandlers
		};

		return public_objects;
	}();


	var ZoomControl = function()
	{
		// variable to store the current zoom level of the map
		var current_zoom_level,
		
		// boolean variable stores whether the user is holding down the zoom in button
			zooming_in = false,
			
		// boolean variable stores whether the user is holding down the zoom out button
			zooming_out = false,
		
		// zooming is executed recursively for zoom button initiated zoom events;
		// this boolean variable is set to true when the user releases a zoom
		// button, and recursive calls to the corresponding zoom function is halted
			received_stop_zoom_signal = false,
		
		// minimum zoom level of the map
			MIN_ZOOM_LEVEL = 1,
			
		// maximum zoom level of the map
			MAX_ZOOM_LEVEL = 4,

		// increment at which the map zooms in/out when triggered by a mousewheel
		// event
			ZOOM_INCREMENT_MOUSEWHEEL = 0.01,

		// increment at which the map zooms in/out when triggered by a zoom button
		// event
			ZOOM_INCREMENT_BUTTON = 0.2;

		/**
		 * Called when the user clicks on either of the zoom buttons (zoom in, zoom out).
		 * This function determines which of the zoom buttons was clicked and makes
		 * the first call to the appropriate helper function (which would then recursively
		 * call itself until the user releases the mouse button or moves the cursor away
		 * from the pressed zoom button).
		 */
		function zoomButtonClicked(which_button) {
			switch(which_button) {
				case "zoom_in":
					zoomInByClick(); break;
				case "zoom_out":
					zoomOutByClick(); break;
				default: break;
			}
		}

		/**
		 * Called when the user releases a mouse button on either of the zoom buttons (zoom in,
		 * zoom out). If the map is zooming in/out, received_stop_zoom_signal is set to be
		 * true to halt the recursive calls to either the zoomInByClick() or zoomOutByClick()
		 * functions and therefore stop the previous zoom event.
		 */
		function zoomButtonReleased() {
			// first conduct a simple check to see that the map is currently either zooming in
			// or zooming out; it may be the case that the user had stopped the zooming in/out
			// by dragging the cursor off the zoom in / zoom out button, in which case we do
			// not want to set received_stop_zoom_signal to be true
			if(zooming_in || zooming_out) {
				received_stop_zoom_signal = true;
			}
		}

		/**
		 * Function that executes the zooming in process when the user clicks on the zoom in button.
		 * It does so by calling itself at fixed time intervals (50 ms), and increases its zoom level
		 * by .04 each time it is called. This process is exited either when (1) the user drags the
		 * cursor off the zoom in button, (2) the user releases the mouse button and
		 * "received_stop_zoom_signal" is set to be true by the zoomButtonReleased function, or (3) the
		 * user has zoomed in to the MAX_ZOOM_LEVEL.
		 * 
		 * Also considered using setInterval and clearInterval to implement zoom button functionality, 
		 * but doing so will require adding code to a mouseout or mousemove event handler to track
		 * whether the user has dragged the cursor off the zoom in button. Using the method below
		 * allows for all of the zoom in button functionality to be neatly encased in one function,
		 * promoting code readability.
		 */
		function zoomInByClick() {
			displayCorrespondingZoomIconIfAtMaxOrMinZoomLevel();
			var clicked_object = document.elementFromPoint(current_mouse_x_coord,current_mouse_y_coord);
			if(clicked_object.id != "Zoom_In_Button" || received_stop_zoom_signal || current_zoom_level == MAX_ZOOM_LEVEL) {
				// if user has either dragged cursor off zoom in button, released the mouse button or has
				// zoomed in to the MAX_ZOOM_LEVEL, reset corresponding zoom variables and stop zooming in
				stopZoomAndResetZoomVariables("zoom_in");
				hideLoadingScreenForZoomEvent();
				return;
			} else if (zooming_in) {
				sustainZoom("zoom_in");
				setTimeout(function(){
					zoomInByClick(); // recursive call
				},50);
			} else {
				// if not yet zooming in, begin zoom
				zooming_in = true;
				displayLoadingScreenForZoomEvent();
				$("#Zoom_In_In_Use").css({display: "block"});
				zoomInByClick(); // recursive call
			}
		}

		/**
		 * Function that executes the zooming out process when the user clicks on the zoom out button.
		 * It does so by calling itself at fixed time intervals (50 ms), and decreases its zoom level
		 * by .04 each time it is called. This process is exited either when (1) the user drags the
		 * cursor off the zoom out button, (2) the user releases the mouse button and
		 * "received_stop_zoom_signal" is set to be true by the zoomButtonReleased function, or (3) the
		 * user has zoomed out to the MIN_ZOOM_LEVEL.
		 * 
		 * Also considered using setInterval and clearInterval to implement zoom button functionality, 
		 * but doing so will require adding code to a mouseout or mousemove event handler to track
		 * whether the user has dragged the cursor off of the zoom out button. Using the method below
		 * allows for all of the zoom out button functionality to be neatly encased in one function,
		 * promoting code readability.
		 */
		function zoomOutByClick() {
			displayCorrespondingZoomIconIfAtMaxOrMinZoomLevel();
			var clicked_object = document.elementFromPoint(current_mouse_x_coord,current_mouse_y_coord);
			if(clicked_object.id != "Zoom_Out_Button" || received_stop_zoom_signal || current_zoom_level == MIN_ZOOM_LEVEL) {
				// if user has either dragged cursor off zoom out button, released the mouse button or has
				// zoomed out to the MIN_ZOOM_LEVEL, reset corresponding zoom variables and stop zooming out
				stopZoomAndResetZoomVariables("zoom_out");
				hideLoadingScreenForZoomEvent();
				return;
			} else if (zooming_out) {
				sustainZoom("zoom_out");
				setTimeout(function(){
					zoomOutByClick(); // recursive call
				},50);
			} else {
				// if not yet zooming out, begin zoom
				zooming_out = true;
				displayLoadingScreenForZoomEvent();
				$("#Zoom_Out_In_Use").css({display: "block"});
				zoomOutByClick(); // recursive call
			}
		}

		/**
		 * Called by the zoomInByClick() and zoomOutByClick() functions when (1) the
		 * user drags the cursor off the zoom in/out button, (2) the user releases
		 * the mouse button and "received_stop_zoom_signal" is set to be true by the
		 * zoomButtonReleased function, or (3) the user has zoomed in/out to the
		 * MIN_ZOOM_LEVEL/MAX_ZOOM_LEVEL. See the zoomInByClick() and zoomOutByClick()
		 * functions for further explanation.
		 */
		function stopZoomAndResetZoomVariables(stopped_zoom_process) {
			received_stop_zoom_signal = false;
			switch(stopped_zoom_process) {
				case "zoom_in":
					zooming_in = false;
					$("#Zoom_In_In_Use").css({display: "none"});
					break;
				case "zoom_out":
					zooming_out = false;
					$("#Zoom_Out_In_Use").css({display: "none"});
					break;
			}
		}

		/**
		 * Called by the zoomInByClick() and zoomOutByClick() functions to make the
		 * adjustments to the zoom level of the map given the current zoom process
		 * (zoom in / zoom out). If the updated zoom level is less than the MIN_ZOOM_LEVEL
		 * or is greater than the MAX_ZOOM_LEVEL, the zoom level is set to the corresponding
		 * zoom limit.
		 */
		function sustainZoom(sustained_zoom_process) {
			switch(sustained_zoom_process) {
				case "zoom_in":
					current_zoom_level += ZOOM_INCREMENT_BUTTON;
					if(current_zoom_level > MAX_ZOOM_LEVEL) {
						current_zoom_level = MAX_ZOOM_LEVEL;
					}
					break;
				case "zoom_out":
					current_zoom_level -= ZOOM_INCREMENT_BUTTON;
					if(current_zoom_level < MIN_ZOOM_LEVEL) {
						current_zoom_level = MIN_ZOOM_LEVEL;
					}
					break;
			}
			var panzoom = $("#focal").find(".panzoom").panzoom();
			panzoom.panzoom("zoom", current_zoom_level, { silent: true, transition: false });
		}

		/**
		 * Called when the user hovers the cursor over the zoom in button.
		 */
		function highlightZoomInButton() {
			$("#Zoom_In_Hover").css({display: "block"});
		}

		/**
		 * Called when the user moves the cursor away from the zoom in button.
		 */
		function unhighlightZoomInButton() {
			$("#Zoom_In_Hover").css({display: "none"});
		}

		/**
		 * Called when the user hovers the cursor over the zoom out button.
		 */
		function highlightZoomOutButton() {
			$("#Zoom_Out_Hover").css({display: "block"});
		}

		/**
		 * Called when the user moves the cursor away from the zoom out button.
		 */
		function unhighlightZoomOutButton() {
			$("#Zoom_Out_Hover").css({display: "none"});
		}

		/**
		 * Called when the map's current zoom level is either at MIN_ZOOM_LEVEL
		 * or MAX_ZOOM_LEVEL and displays the corresponding grayed icon to indicate
		 * that further zoom in the direction that has attained the zoom limit is not
		 * allowed.
		 */
		function displayCorrespondingZoomIconIfAtMaxOrMinZoomLevel() {
			// if at min zoom level, display min zoom level icon
			if(current_zoom_level == MIN_ZOOM_LEVEL) {
				$("#Zoom_Out_Max_Zoom").css({display: "block"});
			} else if (document.getElementById("Zoom_Out_Max_Zoom").style.display != "none") {
				$("#Zoom_Out_Max_Zoom").css({display: "none"});
			}
			// if at max zoom level, display max zoom level icon
			if(current_zoom_level == MAX_ZOOM_LEVEL) {
				$("#Zoom_In_Max_Zoom").css({display: "block"});
			} else if (document.getElementById("Zoom_In_Max_Zoom").style.display != "none") {
				$("#Zoom_In_Max_Zoom").css({display: "none"});
			}
		}

		/**
		 * Sets up the zoom and pan functionality using the PanZoom library.
		 */
		function setupPanZoomElement()
		{
			var panzoom = $("#focal").find(".panzoom").panzoom();
			attachMouseWheelEventHandler(panzoom);
			// set initial zoom level
			panzoom.panzoom("zoom", MIN_ZOOM_LEVEL, { silent: false });
			resetZoomLevelToDefault();

		}

		/**
		 * Attaches the mousewheel event handler to the parent div of the map
		 * element (panzoom). When a mousewheel event is triggered, a check is
		 * first done to determine whether the user is trying to zoom out past the
		 * minimum zoom level (MIN_ZOOM_LEVEL) or if the user is trying to zoom in
		 * past the maximum zoom levle (MAX_ZOOM_LEVEL). If so, nothing is done;
		 * otherwise, the map at the new zoom level is updated and displayed.
		 */
		function attachMouseWheelEventHandler(panzoom) {
			$("#panzoom_parent").mousewheel(function(event) {
				if(isMouseWheelEventInvalid(event)) {
					return;
				}
				handleMouseWheelZoomEventLoadingScreenDisplayTiming();
				event.preventDefault();
				var delta = event.delta || event.originalEvent.wheelDelta,
					zoomOut = delta ? delta < 0 : event.originalEvent.deltaY > 0;
				// set zoom settings and update current zoom level
				current_zoom_level = panzoom.panzoom("zoom", zoomOut, {
					increment: ZOOM_INCREMENT_MOUSEWHEEL,
					minScale: MIN_ZOOM_LEVEL,
					maxScale: MAX_ZOOM_LEVEL,
					focal: event
				});
				displayCorrespondingZoomIconIfAtMaxOrMinZoomLevel();
			});
		}

		/**
		 * Helper function to determine whether a mousewheel event is invalid, where
		 * such an event here is deemed invalid if the user tries to zoom out past the
	     * minimum zoom level (MIN_ZOOM_LEVEL) or if the user tries to zoom in past the
	     * maximum zoom level (MAX_ZOOM_LEVEL). Returns true if the mousewheel event
	     * is invalid, and false otherwise. Called by the
		 * attachMouseWheelEventHandler(...) function.
		 */
		function isMouseWheelEventInvalid(event) {
			var isUserTryingToZoomOutPastMinZoomLevel = (current_zoom_level == MIN_ZOOM_LEVEL) && (event.originalEvent.deltaY > 0),
				isUserTryingToZoomInPastMaxZoomLevel = (current_zoom_level == MAX_ZOOM_LEVEL) && (event.originalEvent.deltaY < 0);
			return (isUserTryingToZoomOutPastMinZoomLevel || isUserTryingToZoomInPastMaxZoomLevel);
		}

		/**
		 * Called by the attachMouseWheelEventHandler(...) function to display a loading
		 * screen when the mousewheel event is active. Since there does not seem to be a
		 * way to detect when the user has stopped scrolling using the mousewheel, this
		 * function effectively checks every 250ms for whether a mousewheel event is
		 * active and therefore determines that the user has stopped scrolling using the
		 * mousewheel if a mousewheel event has not been active in the past 250ms. This
		 * function is called for all mousewheel events, so when a new mousewheel event
		 * is registered, any setTimeout functions to hide the loading screen is cleared
		 * and delayed for another 250ms.
		 */
		function handleMouseWheelZoomEventLoadingScreenDisplayTiming() {
			clearTimeout($.data(this, "timer"));
			displayLoadingScreenForZoomEvent();
			$.data(this, "timer", setTimeout(function() {
				hideLoadingScreenForZoomEvent();
			}, 250));
		}

		/**
		 * Resets map zoom level to minimum zoom level for the initial load of the map
		 * or upon window resize. Map is reset to minimum zoom level when resized due
		 * to a bug that occurs when the map is resized not to the minimum zoom level
		 * (the map no longer stays contained in its viewport).
		 */
		function resetZoomLevelToDefault() {
			current_zoom_level = MIN_ZOOM_LEVEL;
			zooming_in = false;
			zooming_out = false;
			$("#Zoom_In_Max_Zoom").css({display: "none"});
			$("#Zoom_Out_Max_Zoom").css({display: "block"});
		}

		/**
		 * Called by the handleMouseWheelZoomEventLoadingScreenDisplayTiming() function
		 * to display the loading screen for a mousewheel zoom event.
		 */
		function displayLoadingScreenForZoomEvent() {
			$("#panzoom").css({left: "-99999px"});
			$("#loading_screen").css({display:"block", zIndex:"1"});
		}

		/**
		 * Called by the handleMouseWheelZoomEventLoadingScreenDisplayTiming() function
		 * to hide the loading screen after the user has stopped scrolling to zoom in/out
		 * using the mousewheel.
		 */
		function hideLoadingScreenForZoomEvent() {
			$("#panzoom").css({left: "0"});
			$("#loading_screen").css({display:"none", zIndex:"2000"});
		}

		var public_objects =
		{
			zoomButtonClicked : zoomButtonClicked,
			zoomButtonReleased : zoomButtonReleased,
			highlightZoomInButton : highlightZoomInButton,
			unhighlightZoomInButton : unhighlightZoomInButton,
			highlightZoomOutButton : highlightZoomOutButton,
			unhighlightZoomOutButton : unhighlightZoomOutButton,
			setupPanZoomElement : setupPanZoomElement,
			resetZoomLevelToDefault : resetZoomLevelToDefault
		}

		return public_objects;
	}();


	var ExploreByStationPointMode = function()
	{
		// boolean variable to store whether station point mode is active
		var is_explore_by_station_point_mode_active = false,

		// variable to store the current active station point; if no station point is
		// currently active, variable stores 'none'; a station point is deemed active if
		// the cursor is hovering it and its corresponding viewshed is displayed
			current_active_station_point = "none";

		/**
		 * Called when user clicks on the station point mode button.
		 */
		function activateMode()
		{
			// only activate station point mode if it is not already active
			if(!is_explore_by_station_point_mode_active) {
				is_explore_by_station_point_mode_active = true;
				ExploreByLocationMode.setExploreByLocationModeStatus(false);
				setAllStationPointIconsOpacity(1);
				VernonChuo.GrandCanyonInteractiveMapDimensions.setContentDimensions();
				// pulls up relevant png
				$("#Mode_Button_One_On").css({display: "block"});
				$("#Mode_Button_All_On").css({display: "none"});
				// place StationPointSVGLayer at top layer so that mouseevents over station points are active
				$("#StationPointSVGLayer").css({zIndex: 501});
				
				$("#StationPointMode_InfoBox").css({zIndex:1000});
				$("#LocationMode_InfoBox").css({left:"auto",right:"-99999px",zIndex:-1});
				
				// if a location popup is currently active, hide it
				if($("#popup_div").length > 0) {
					ExploreByLocationMode.destroyLocationModePopup();
				}
			}
		}
		
		/**
		 * Called when the user's cursor hovers over a station point. The number of this
		 * station point is then determined by the id (curr_elem_id) passed in to display
		 * the corresponding viewshed and station point rollover icon, and the id is
		 * stored in the current_active_station_point variable. This function calls the
		 * activateCorrespondingStationPointEvents() function, which accesses this variable
		 * to activate the features that differ between station points.
		 */
		function activateStationPointMouseoverEvents(curr_elem_id) {
			if(is_explore_by_station_point_mode_active) {
				var current_station_point_number = curr_elem_id.substring("StationPoint".length).toString();
				$("#Viewshed"+current_station_point_number+"PNG").css({display:"block"});
				$("#StationPoint"+current_station_point_number+"RolloverIcon").css({display:"block"});
				
				$("#StationPointMode_InfoBoxImage").css({border:"6px solid white"});
				$("#StationPointMode_StationPointLabel").css({backgroundColor:"rgba(256,256,256,0.8)"});

				current_active_station_point = curr_elem_id;
				setAllStationPointIconsOpacity(0.2);
				activateCorrespondingStationPointEvents();
			}
		}	

		/**
		 * Called when the user's cursor moves away from a station point. This function
		 * calls the deactivateCorrespondingStationPointEvents() function, which accesses
		 * the current_active_station_point variable to determine which features to
		 * deactivate.
		 */
		function deactivateStationPointMouseoverEvents() {
			if(is_explore_by_station_point_mode_active) {
				var current_station_point_number = current_active_station_point.substring("StationPoint".length).toString();
				$("#StationPoint"+current_station_point_number+"RolloverIcon").css({display:"none"});
				
				// hide photo associated with station point
				$("#StationPointMode_InfoBox").css({left:"auto",right:"-999999px"});
				$("#StationPointMode_InfoBoxImage").attr("src","");
				$("#StationPointMode_InfoBoxImage").css({border:"0"});
				$("#StationPointMode_StationPointLabel").html("");
				$("#StationPointMode_StationPointLabel").css({backgroundColor:"transparent"})
				
				if(LandmarksToggle.areLandmarksDisplayed()) {
					setAllStationPointIconsOpacity(0.5);
				} else {
					setAllStationPointIconsOpacity(1);
				}
				deactivateCorrespondingStationPointEvents();
				current_active_station_point = "none";
			}
		}

		/**
		 * Called by the activateStationPointMouseoverEvents(...) function. Accesses
		 * the current_active_station_point variable to determine which features to
		 * activate.
		 */
		function activateCorrespondingStationPointEvents() {
			switch(current_active_station_point) {
				case "StationPoint2":
					StationPointMouseoverEvents.activateStationPoint2Events(); break;
				case "StationPoint3":
					StationPointMouseoverEvents.activateStationPoint3Events(); break;
				case "StationPoint4":
					StationPointMouseoverEvents.activateStationPoint4Events(); break;
				case "StationPoint5":
					StationPointMouseoverEvents.activateStationPoint5Events(); break;
				case "StationPoint6":
					StationPointMouseoverEvents.activateStationPoint6Events(); break;
				case "StationPoint7":
					StationPointMouseoverEvents.activateStationPoint7Events(); break;
				case "StationPoint8":
					StationPointMouseoverEvents.activateStationPoint8Events(); break;
				case "StationPoint9":
					StationPointMouseoverEvents.activateStationPoint9Events(); break;
				case "StationPoint10":
					StationPointMouseoverEvents.activateStationPoint10Events(); break;
				case "StationPoint11":
					StationPointMouseoverEvents.activateStationPoint11Events(); break;
				case "StationPoint12":
					StationPointMouseoverEvents.activateStationPoint12Events(); break;
				case "StationPoint13":
					StationPointMouseoverEvents.activateStationPoint13Events(); break;
				case "StationPoint14":
					StationPointMouseoverEvents.activateStationPoint14Events(); break;
				case "StationPoint15":
					StationPointMouseoverEvents.activateStationPoint15Events(); break;
				case "StationPoint16":
					StationPointMouseoverEvents.activateStationPoint16Events(); break;
				case "StationPoint17":
					StationPointMouseoverEvents.activateStationPoint17Events(); break;
				case "StationPoint18":
					StationPointMouseoverEvents.activateStationPoint18Events(); break;
				case "StationPoint19":
					StationPointMouseoverEvents.activateStationPoint19Events(); break;
				case "StationPoint20":
					StationPointMouseoverEvents.activateStationPoint20Events(); break;
				case "StationPoint21":
					StationPointMouseoverEvents.activateStationPoint21Events(); break;
				case "StationPoint22":
					StationPointMouseoverEvents.activateStationPoint22Events(); break;
				case "StationPoint23":
					StationPointMouseoverEvents.activateStationPoint23Events(); break;
				case "StationPoint24":
					StationPointMouseoverEvents.activateStationPoint24Events(); break;
				case "StationPoint25":
					StationPointMouseoverEvents.activateStationPoint25Events(); break;
				case "StationPoint26":
					StationPointMouseoverEvents.activateStationPoint26Events(); break;
				case "StationPoint27":
					StationPointMouseoverEvents.activateStationPoint27Events(); break;
				case "StationPoint28":
					StationPointMouseoverEvents.activateStationPoint28Events(); break;
				case "StationPoint29":
					StationPointMouseoverEvents.activateStationPoint29Events(); break;
				case "StationPoint30":
					StationPointMouseoverEvents.activateStationPoint30Events(); break;
				case "StationPoint31":
					StationPointMouseoverEvents.activateStationPoint31Events(); break;
				case "StationPoint32":
					StationPointMouseoverEvents.activateStationPoint32Events(); break;
				case "StationPoint33":
					StationPointMouseoverEvents.activateStationPoint33Events(); break;
				case "StationPoint34":
					StationPointMouseoverEvents.activateStationPoint34Events(); break;
				case "StationPoint35":
					StationPointMouseoverEvents.activateStationPoint35Events(); break;
				case "StationPoint37":
					StationPointMouseoverEvents.activateStationPoint37Events(); break;
				case "StationPoint38":
					StationPointMouseoverEvents.activateStationPoint38Events(); break;
				case "StationPoint39":
					StationPointMouseoverEvents.activateStationPoint39Events(); break;
				case "StationPoint40":
					StationPointMouseoverEvents.activateStationPoint40Events(); break;
				case "StationPoint41":
					StationPointMouseoverEvents.activateStationPoint41Events(); break;
				case "StationPoint42":
					StationPointMouseoverEvents.activateStationPoint42Events(); break;
				case "StationPoint43":
					StationPointMouseoverEvents.activateStationPoint43Events(); break;
				default:
					break;
			}
		}

		/**
		 * Called by the deactivateStationPointMouseoverEvents(...) function. Accesses
		 * the current_active_station_point variable to determine which features to
		 * deactivate.
		 */
		function deactivateCorrespondingStationPointEvents() {
			switch(current_active_station_point) {
				case "StationPoint2":
					StationPointMouseoverEvents.deactivateStationPoint2Events(); break;
				case "StationPoint3":
					StationPointMouseoverEvents.deactivateStationPoint3Events(); break;
				case "StationPoint4":
					StationPointMouseoverEvents.deactivateStationPoint4Events(); break;
				case "StationPoint5":
					StationPointMouseoverEvents.deactivateStationPoint5Events(); break;
				case "StationPoint6":
					StationPointMouseoverEvents.deactivateStationPoint6Events(); break;
				case "StationPoint7":
					StationPointMouseoverEvents.deactivateStationPoint7Events(); break;
				case "StationPoint8":
					StationPointMouseoverEvents.deactivateStationPoint8Events(); break;
				case "StationPoint9":
					StationPointMouseoverEvents.deactivateStationPoint9Events(); break;
				case "StationPoint10":
					StationPointMouseoverEvents.deactivateStationPoint10Events(); break;
				case "StationPoint11":
					StationPointMouseoverEvents.deactivateStationPoint11Events(); break;
				case "StationPoint12":
					StationPointMouseoverEvents.deactivateStationPoint12Events(); break;
				case "StationPoint13":
					StationPointMouseoverEvents.deactivateStationPoint13Events(); break;
				case "StationPoint14":
					StationPointMouseoverEvents.deactivateStationPoint14Events(); break;
				case "StationPoint15":
					StationPointMouseoverEvents.deactivateStationPoint15Events(); break;
				case "StationPoint16":
					StationPointMouseoverEvents.deactivateStationPoint16Events(); break;
				case "StationPoint17":
					StationPointMouseoverEvents.deactivateStationPoint17Events(); break;
				case "StationPoint18":
					StationPointMouseoverEvents.deactivateStationPoint18Events(); break;
				case "StationPoint19":
					StationPointMouseoverEvents.deactivateStationPoint19Events(); break;
				case "StationPoint20":
					StationPointMouseoverEvents.deactivateStationPoint20Events(); break;
				case "StationPoint21":
					StationPointMouseoverEvents.deactivateStationPoint21Events(); break;
				case "StationPoint22":
					StationPointMouseoverEvents.deactivateStationPoint22Events(); break;
				case "StationPoint23":
					StationPointMouseoverEvents.deactivateStationPoint23Events(); break;
				case "StationPoint24":
					StationPointMouseoverEvents.deactivateStationPoint24Events(); break;
				case "StationPoint25":
					StationPointMouseoverEvents.deactivateStationPoint25Events(); break;
				case "StationPoint26":
					StationPointMouseoverEvents.deactivateStationPoint26Events(); break;
				case "StationPoint27":
					StationPointMouseoverEvents.deactivateStationPoint27Events(); break;
				case "StationPoint28":
					StationPointMouseoverEvents.deactivateStationPoint28Events(); break;
				case "StationPoint29":
					StationPointMouseoverEvents.deactivateStationPoint29Events(); break;
				case "StationPoint30":
					StationPointMouseoverEvents.deactivateStationPoint30Events(); break;
				case "StationPoint31":
					StationPointMouseoverEvents.deactivateStationPoint31Events(); break;
				case "StationPoint32":
					StationPointMouseoverEvents.deactivateStationPoint32Events(); break;
				case "StationPoint33":
					StationPointMouseoverEvents.deactivateStationPoint33Events(); break;
				case "StationPoint34":
					StationPointMouseoverEvents.deactivateStationPoint34Events(); break;
				case "StationPoint35":
					StationPointMouseoverEvents.deactivateStationPoint35Events(); break;
				case "StationPoint37":
					StationPointMouseoverEvents.deactivateStationPoint37Events(); break;
				case "StationPoint38":
					StationPointMouseoverEvents.deactivateStationPoint38Events(); break;
				case "StationPoint39":
					StationPointMouseoverEvents.deactivateStationPoint39Events(); break;
				case "StationPoint40":
					StationPointMouseoverEvents.deactivateStationPoint40Events(); break;
				case "StationPoint41":
					StationPointMouseoverEvents.deactivateStationPoint41Events(); break;
				case "StationPoint42":
					StationPointMouseoverEvents.deactivateStationPoint42Events(); break;
				case "StationPoint43":
					StationPointMouseoverEvents.deactivateStationPoint43Events(); break;
				default:
					break;
			}
		}

		var StationPointMouseoverEvents =
		{
			activateStationPoint2Events : function() {
				// position station point mode info box in map frame
				$("#StationPointMode_InfoBox").css({left:"auto",right:"60px"});
				// display photo associated with station point
				$("#StationPointMode_InfoBoxImage").attr("src","images/StationPointPhotos/2-Station-Point-Photo.jpg");
				$("#StationPointMode_InfoBoxImage").css({width:"100%",height:"auto",float:"right"});
				// display station point label
				$("#StationPointMode_StationPointLabel").html("<span class='StationPointMode_StationPointLabelTitle'>Station Point 2</span> <br> On Grand View Point");
				$("#StationPointMode_StationPointLabel").css({float: "right", height: "45px"});
			},
			deactivateStationPoint2Events : function() {
				$("#Viewshed2PNG").css({display:"none"});
			},
			activateStationPoint3Events : function() {
				// position station point mode info box in map frame
				$("#StationPointMode_InfoBox").css({left:"auto",right:"60px"});
				// display photo associated with station point
				$("#StationPointMode_InfoBoxImage").attr("src","images/StationPointPhotos/3-Station-Point-Photo.jpg");
				$("#StationPointMode_InfoBoxImage").css({width:"100%",height:"auto",float:"right"});
				// display station point label
				$("#StationPointMode_StationPointLabel").html("<span class='StationPointMode_StationPointLabelTitle'>Station Point 3</span> <br> Angel's Gate, Wotan's Throne <br> and Vishnu Temple");
				$("#StationPointMode_StationPointLabel").css({float: "right", height:"55px"});
			},
			deactivateStationPoint3Events : function() {
				$("#Viewshed3PNG").css({display:"none"});
			},
			activateStationPoint4Events : function() {
				// position station point mode info box in map frame
				$("#StationPointMode_InfoBox").css({left:"auto",right:"60px"});
				// display photo associated with station point
				$("#StationPointMode_InfoBoxImage").attr("src","images/StationPointPhotos/4-Station-Point-Photo.jpg");
				$("#StationPointMode_InfoBoxImage").css({width:"100%",height:"auto",float:"right"});
				// display station point label
				$("#StationPointMode_StationPointLabel").html("<span class='StationPointMode_StationPointLabelTitle'>Station Point 4</span> <br> Up Granite Gorge, from Grand View Trail");
				$("#StationPointMode_StationPointLabel").css({float: "right", height:"45px"});
			},
			deactivateStationPoint4Events : function() {
				$("#Viewshed4PNG").css({display:"none"});
			},
			activateStationPoint5Events : function() {
				// position station point mode info box in map frame
				$("#StationPointMode_InfoBox").css({left:"auto",right:"60px"});
				// display photo associated with station point
				$("#StationPointMode_InfoBoxImage").attr("src","images/StationPointPhotos/5-Station-Point-Photo.jpg");
				$("#StationPointMode_InfoBoxImage").css({width:"100%",height:"auto",float:"right"});
				// display station point label
				$("#StationPointMode_StationPointLabel").html("<span class='StationPointMode_StationPointLabelTitle'>Station Point 5</span> <br> Down Granite Gorge, from Grand View Trail");
				$("#StationPointMode_StationPointLabel").css({float: "right", height:"45px"});
			},
			deactivateStationPoint5Events : function() {
				$("#Viewshed5PNG").css({display:"none"});
			},
			activateStationPoint6Events : function() {
				// position station point mode info box in map frame
				$("#StationPointMode_InfoBox").css({left:"auto",left:"10px"});
				// display photo associated with station point
				$("#StationPointMode_InfoBoxImage").attr("src","images/StationPointPhotos/6-Station-Point-Photo.jpg");
				$("#StationPointMode_InfoBoxImage").css({width:"100%",height:"auto",float:"left"});
				// display station point label
				$("#StationPointMode_StationPointLabel").html("<span class='StationPointMode_StationPointLabelTitle'>Station Point 6</span> <br> Up Grand Canyon, from Moran Point");
				$("#StationPointMode_StationPointLabel").css({float: "left", height:"45px"});
			},
			deactivateStationPoint6Events : function() {
				$("#Viewshed6PNG").css({display:"none"});
			},
			activateStationPoint7Events : function() {
				// position station point mode info box in map frame
				$("#StationPointMode_InfoBox").css({left:"auto",left:"10px"});
				// display photo associated with station point
				$("#StationPointMode_InfoBoxImage").attr("src","images/StationPointPhotos/7-Station-Point-Photo.jpg");
				$("#StationPointMode_InfoBoxImage").css({width:"100%",height:"auto",float:"left"});
				// display station point label
				$("#StationPointMode_StationPointLabel").html("<span class='StationPointMode_StationPointLabelTitle'>Station Point 7</span> <br> Up Grand Canyon, from Zuni Point");
				$("#StationPointMode_StationPointLabel").css({float: "left", height:"45px"});
			},
			deactivateStationPoint7Events : function() {
				$("#Viewshed7PNG").css({display:"none"});
			},
			activateStationPoint8Events : function() {
				// position station point mode info box in map frame
				$("#StationPointMode_InfoBox").css({left:"auto",left:"10px"});
				// display photo associated with station point
				$("#StationPointMode_InfoBoxImage").attr("src","images/StationPointPhotos/8-Station-Point-Photo.jpg");
				$("#StationPointMode_InfoBoxImage").css({width:"100%",height:"auto",float:"left"});
				// display station point label
				$("#StationPointMode_StationPointLabel").html("<span class='StationPointMode_StationPointLabelTitle'>Station Point 8</span> <br> Up to Marble Gorge and Painted Desert, <br> from Lipan Point");
				$("#StationPointMode_StationPointLabel").css({float: "left", height:"55px"});
			},
			deactivateStationPoint8Events : function() {
				$("#Viewshed8PNG").css({display:"none"});
			},
			activateStationPoint9Events : function() {
				// position station point mode info box in map frame
				$("#StationPointMode_InfoBox").css({left:"auto",left:"10px"});
				// display photo associated with station point
				$("#StationPointMode_InfoBoxImage").attr("src","images/StationPointPhotos/9-Station-Point-Photo.jpg");
				$("#StationPointMode_InfoBoxImage").css({width:"100%",height:"auto",float:"left"});
				// display station point label
				$("#StationPointMode_StationPointLabel").html("<span class='StationPointMode_StationPointLabelTitle'>Station Point 9</span> <br> Up to Marble Gorge and Painted Desert, <br> from Desert View");
				$("#StationPointMode_StationPointLabel").css({float: "left", height:"55px"});
			},
			deactivateStationPoint9Events : function() {
				$("#Viewshed9PNG").css({display:"none"});
			},
			activateStationPoint10Events : function() {
				// position station point mode info box in map frame
				$("#StationPointMode_InfoBox").css({left:"auto",right:"60px"});
				// display photo associated with station point
				$("#StationPointMode_InfoBoxImage").attr("src","images/StationPointPhotos/10-Station-Point-Photo.jpg");
				$("#StationPointMode_InfoBoxImage").css({width:"100%",height:"auto",float:"right"});
				// display station point label
				$("#StationPointMode_StationPointLabel").html("<span class='StationPointMode_StationPointLabelTitle'>Station Point 10</span> <br> Down Grand Canyon, from Zuni Point");
				$("#StationPointMode_StationPointLabel").css({float: "right", height:"45px"});
			},
			deactivateStationPoint10Events : function() {
				$("#Viewshed10PNG").css({display:"none"});
			},
			activateStationPoint11Events : function() {
				// position station point mode info box in map frame
				$("#StationPointMode_InfoBox").css({left:"auto",right:"60px"});
				// display photo associated with station point
				$("#StationPointMode_InfoBoxImage").attr("src","images/StationPointPhotos/11-Station-Point-Photo.jpg");
				$("#StationPointMode_InfoBoxImage").css({width:"100%",height:"auto",float:"right"});
				// display station point label
				$("#StationPointMode_StationPointLabel").html("<span class='StationPointMode_StationPointLabelTitle'>Station Point 11</span> <br> Across Grand Canyon, near El Tovar");
				$("#StationPointMode_StationPointLabel").css({float: "right", height:"45px"});
			},
			deactivateStationPoint11Events : function() {
				$("#Viewshed11PNG").css({display:"none"});
			},
			activateStationPoint12Events : function() {
				// position station point mode info box in map frame
				$("#StationPointMode_InfoBox").css({left:"auto",right:"60px"});
				// display photo associated with station point
				$("#StationPointMode_InfoBoxImage").attr("src","images/StationPointPhotos/12-Station-Point-Photo.jpg");
				$("#StationPointMode_InfoBoxImage").css({width:"100%",height:"auto",float:"right"});
				// display station point label
				$("#StationPointMode_StationPointLabel").html("<span class='StationPointMode_StationPointLabelTitle'>Station Point 12</span> <br> Descending the Zigzags, Bright Angel Trail");
				$("#StationPointMode_StationPointLabel").css({float: "right", height:"45px"});
			},
			deactivateStationPoint12Events : function() {
				$("#Viewshed12PNG").css({display:"none"});
			},
			activateStationPoint13Events : function() {
				// position station point mode info box in map frame
				$("#StationPointMode_InfoBox").css({left:"auto",right:"60px"});
				// display photo associated with station point
				$("#StationPointMode_InfoBoxImage").attr("src","images/StationPointPhotos/13-Station-Point-Photo.jpg");
				$("#StationPointMode_InfoBoxImage").css({width:"100%",height:"auto",float:"right"});
				// display station point label
				$("#StationPointMode_StationPointLabel").html("<span class='StationPointMode_StationPointLabelTitle'>Station Point 13</span> <br> Colorado River and Zoroaster Temple, <br> Foot of Bright Angel Trail");
				$("#StationPointMode_StationPointLabel").css({float: "right", height:"55px"});
			},
			deactivateStationPoint13Events : function() {
				$("#Viewshed13PNG").css({display:"none"});
			},
			activateStationPoint14Events : function() {
				$("#StationPoint14RolloverIcon").css({display:"block"});
				// position station point mode info box in map frame
				$("#StationPointMode_InfoBox").css({left:"auto",right:"60px"});
				// display photo associated with station point
				$("#StationPointMode_InfoBoxImage").attr("src","images/StationPointPhotos/14-Station-Point-Photo.jpg");
				$("#StationPointMode_InfoBoxImage").css({width:"100%",height:"auto",float:"right"});
				// display station point label
				$("#StationPointMode_StationPointLabel").html("<span class='StationPointMode_StationPointLabelTitle'>Station Point 14</span> <br> Hopi Indian Buffalo Dance at El Tovar");
				$("#StationPointMode_StationPointLabel").css({float: "right", height:"45px"});
				// display notification box stating that this station point does not have a viewshed
				$("#StationPointNotificationBox").css({left:"39%",right:"39%"});
			},
			deactivateStationPoint14Events : function() {
				// hide notification box
				$("#StationPointNotificationBox").css({left:"-99999px",right:"auto"});
			},
			activateStationPoint15Events : function() {
				$("#StationPoint15RolloverIcon").css({display:"block"});
				// position station point mode info box in map frame
				$("#StationPointMode_InfoBox").css({left:"auto",right:"60px"});
				// display photo associated with station point
				$("#StationPointMode_InfoBoxImage").attr("src","images/StationPointPhotos/15-Station-Point-Photo.jpg");
				$("#StationPointMode_InfoBoxImage").css({width:"100%",height:"auto",float:"right"});
				// display station point label
				$("#StationPointMode_StationPointLabel").html("<span class='StationPointMode_StationPointLabelTitle'>Station Point 15</span> <br> Hopi Indian Eagle Dance at El Tovar");
				$("#StationPointMode_StationPointLabel").css({float: "right", height:"45px"});
				// display notification box stating that this station point does not have a viewshed
				$("#StationPointNotificationBox").css({left:"39%",right:"39%"});
			},
			deactivateStationPoint15Events : function() {
				// hide notification box
				$("#StationPointNotificationBox").css({left:"-99999px",right:"auto"});
			},
			activateStationPoint16Events : function() {
				$("#StationPoint16RolloverIcon").css({display:"block"});
				// position station point mode info box in map frame
				$("#StationPointMode_InfoBox").css({left:"auto",right:"60px"});
				// display photo associated with station point
				$("#StationPointMode_InfoBoxImage").attr("src","images/StationPointPhotos/16-Station-Point-Photo.jpg");
				$("#StationPointMode_InfoBoxImage").css({width:"100%",height:"auto",float:"right"});
				// display station point label
				$("#StationPointMode_StationPointLabel").html("<span class='StationPointMode_StationPointLabelTitle'>Station Point 16</span> <br> Hopi Indian War Dance at El Tovar");
				$("#StationPointMode_StationPointLabel").css({float: "right", height:"45px"});
				// display notification box stating that this station point does not have a viewshed
				$("#StationPointNotificationBox").css({left:"39%",right:"39%"});
			},
			deactivateStationPoint16Events : function() {
				// hide notification box
				$("#StationPointNotificationBox").css({left:"-99999px",right:"auto"});
			},
			activateStationPoint17Events : function() {
				// position station point mode info box in map frame
				$("#StationPointMode_InfoBox").css({left:"auto",right:"60px"});
				// display photo associated with station point
				$("#StationPointMode_InfoBoxImage").attr("src","images/StationPointPhotos/17-Station-Point-Photo.jpg");
				$("#StationPointMode_InfoBoxImage").css({width:"100%",height:"auto",float:"right"});
				// display station point label
				$("#StationPointMode_StationPointLabel").html("<span class='StationPointMode_StationPointLabelTitle'>Station Point 17</span> <br> Down Grand Canyon, from Hopi Point");
				$("#StationPointMode_StationPointLabel").css({float: "right", height:"45px"});
			},
			deactivateStationPoint17Events : function() {
				$("#Viewshed17PNG").css({display:"none"});
			},
			activateStationPoint18Events : function() {
				// position station point mode info box in map frame
				$("#StationPointMode_InfoBox").css({left:"auto",right:"60px"});
				// display photo associated with station point
				$("#StationPointMode_InfoBoxImage").attr("src","images/StationPointPhotos/18-Station-Point-Photo.jpg");
				$("#StationPointMode_InfoBoxImage").css({width:"100%",height:"auto",float:"right"});
				// display station point label
				$("#StationPointMode_StationPointLabel").html("<span class='StationPointMode_StationPointLabelTitle'>Station Point 18</span> <br> Eastern Outlook, from Havasupai Point");
				$("#StationPointMode_StationPointLabel").css({float: "right", height:"45px"});
			},
			deactivateStationPoint18Events : function() {
				$("#Viewshed18PNG").css({display:"none"});
			},
			activateStationPoint19Events : function() {
				// position station point mode info box in map frame
				$("#StationPointMode_InfoBox").css({left:"auto",right:"60px"});
				// display photo associated with station point
				$("#StationPointMode_InfoBoxImage").attr("src","images/StationPointPhotos/19-Station-Point-Photo.jpg");
				$("#StationPointMode_InfoBoxImage").css({width:"100%",height:"auto",float:"right"});
				// display station point label
				$("#StationPointMode_StationPointLabel").html("<span class='StationPointMode_StationPointLabelTitle'>Station Point 19</span> <br> Across Grand Scenic Divide, <br> from Havasupai Point");
				$("#StationPointMode_StationPointLabel").css({float: "right", height:"55px"});
			},
			deactivateStationPoint19Events : function() {
				$("#Viewshed19PNG").css({display:"none"});
			},
			activateStationPoint20Events : function() {
				// position station point mode info box in map frame
				$("#StationPointMode_InfoBox").css({left:"auto",right:"60px"});
				// display photo associated with station point
				$("#StationPointMode_InfoBoxImage").attr("src","images/StationPointPhotos/20-Station-Point-Photo.jpg");
				$("#StationPointMode_InfoBoxImage").css({width:"100%",height:"auto",float:"right"});
				// display station point label
				$("#StationPointMode_StationPointLabel").html("<span class='StationPointMode_StationPointLabelTitle'>Station Point 20</span> <br> Havasupai Point, from Grand Scenic Divide");
				$("#StationPointMode_StationPointLabel").css({float: "right", height:"45px"});
			},
			deactivateStationPoint20Events : function() {
				$("#Viewshed20PNG").css({display:"none"});
			},
			activateStationPoint21Events : function() {
				// position station point mode info box in map frame
				$("#StationPointMode_InfoBox").css({left:"auto",right:"60px"});
				// display photo associated with station point
				$("#StationPointMode_InfoBoxImage").attr("src","images/StationPointPhotos/21-Station-Point-Photo.jpg");
				$("#StationPointMode_InfoBoxImage").css({width:"100%",height:"auto",float:"right"});
				// display station point label
				$("#StationPointMode_StationPointLabel").html("<span class='StationPointMode_StationPointLabelTitle'>Station Point 21</span> <br> North Wall of Canyon, <br> from Grand Scenic Divide");
				$("#StationPointMode_StationPointLabel").css({float: "right", height:"55px"});
			},
			deactivateStationPoint21Events : function() {
				$("#Viewshed21PNG").css({display:"none"});
			},
			activateStationPoint22Events : function() {
				// position station point mode info box in map frame
				$("#StationPointMode_InfoBox").css({left:"auto",right:"60px"});
				// display photo associated with station point
				$("#StationPointMode_InfoBoxImage").attr("src","images/StationPointPhotos/22-Station-Point-Photo.jpg");
				$("#StationPointMode_InfoBoxImage").css({width:"100%",height:"auto",float:"right"});
				// display station point label
				$("#StationPointMode_StationPointLabel").html("<span class='StationPointMode_StationPointLabelTitle'>Station Point 22</span> <br> Up Grand Canyon, from Grand Scenic Divide");
				$("#StationPointMode_StationPointLabel").css({float: "right", height:"45px"});
			},
			deactivateStationPoint22Events : function() {
				$("#Viewshed22PNG").css({display:"none"});
			},
			activateStationPoint23Events : function() {
				// position station point mode info box in map frame
				$("#StationPointMode_InfoBox").css({left:"auto",left:"10px"});
				// display photo associated with station point
				$("#StationPointMode_InfoBoxImage").attr("src","images/StationPointPhotos/23-Station-Point-Photo.jpg");
				$("#StationPointMode_InfoBoxImage").css({width:"100%",height:"auto",float:"left"});
				// display station point label
				$("#StationPointMode_StationPointLabel").html("<span class='StationPointMode_StationPointLabelTitle'>Station Point 23</span> <br> Bird's-eye View of Grand Canyon, <br> from an Airplane");
				$("#StationPointMode_StationPointLabel").css({float: "left", height:"55px"});
			},
			deactivateStationPoint23Events : function() {
				$("#Viewshed23PNG").css({display:"none"});
			},
			activateStationPoint24Events : function() {
				// position station point mode info box in map frame
				$("#StationPointMode_InfoBox").css({left:"auto",left:"10px"});
				// display photo associated with station point
				$("#StationPointMode_InfoBoxImage").attr("src","images/StationPointPhotos/24-Station-Point-Photo.jpg");
				$("#StationPointMode_InfoBoxImage").css({width:"100%",height:"auto",float:"left"});
				// display station point label
				$("#StationPointMode_StationPointLabel").html("<span class='StationPointMode_StationPointLabelTitle'>Station Point 24</span> <br> Bright Angel Canyon, from Yavapai Point");
				$("#StationPointMode_StationPointLabel").css({float: "left", height:"45px"});
			},
			deactivateStationPoint24Events : function() {
				$("#Viewshed24PNG").css({display:"none"});
			},
			activateStationPoint25Events : function() {
				$("#StationPoint25RolloverIcon").css({display:"block"});
				// position station point mode info box in map frame
				$("#StationPointMode_InfoBox").css({left:"auto",right:"10px"});
				// display photo associated with station point
				$("#StationPointMode_InfoBoxImage").attr("src","images/StationPointPhotos/25-Station-Point-Photo.jpg");
				$("#StationPointMode_InfoBoxImage").css({width:"auto",height:"100%",float:"right"});
				// display station point label
				$("#StationPointMode_StationPointLabel").html("<span class='StationPointMode_StationPointLabelTitle'>Station Point 25</span> <br> Starting Down the Kaibab Trail, <br> from Yaki Point");
				$("#StationPointMode_StationPointLabel").css({float: "right", height:"55px"});
				// display notification box stating that this station point does not have a viewshed
				$("#StationPointNotificationBox").css({left:"39%",right:"39%"});
			},
			deactivateStationPoint25Events : function() {
				// hide notification box
				$("#StationPointNotificationBox").css({left:"-99999px",right:"auto"});
			},
			activateStationPoint26Events : function() {
				// position station point mode info box in map frame
				$("#StationPointMode_InfoBox").css({left:"auto",right:"60px"});
				// display photo associated with station point
				$("#StationPointMode_InfoBoxImage").attr("src","images/StationPointPhotos/26-Station-Point-Photo.jpg");
				$("#StationPointMode_InfoBoxImage").css({width:"100%",height:"auto",float:"right"});
				// display station point label
				$("#StationPointMode_StationPointLabel").html("<span class='StationPointMode_StationPointLabelTitle'>Station Point 26</span> <br> The Kaibab Suspension Bridge");
				$("#StationPointMode_StationPointLabel").css({float: "right", height:"45px"});
			},
			deactivateStationPoint26Events : function() {
				$("#Viewshed26PNG").css({display:"none"});
			},
			activateStationPoint27Events : function() {
				$("#StationPoint27RolloverIcon").css({display:"block"});
				// position station point mode info box in map frame
				$("#StationPointMode_InfoBox").css({left:"auto",right:"60px"});
				// display photo associated with station point
				$("#StationPointMode_InfoBoxImage").attr("src","images/StationPointPhotos/27-Station-Point-Photo.jpg");
				$("#StationPointMode_InfoBoxImage").css({width:"100%",height:"auto",float:"right"});
				// display station point label
				$("#StationPointMode_StationPointLabel").html("<span class='StationPointMode_StationPointLabelTitle'>Station Point 27</span> <br> Tunnel Approach to Bridge");
				$("#StationPointMode_StationPointLabel").css({float: "right", height:"45px"});
				// display notification box stating that this station point does not have a viewshed
				$("#StationPointNotificationBox").css({left:"39%",right:"39%"});
			},
			deactivateStationPoint27Events : function() {
				// hide notification box
				$("#StationPointNotificationBox").css({left:"-99999px",right:"auto"});
			},
			activateStationPoint28Events : function() {
				// position station point mode info box in map frame
				$("#StationPointMode_InfoBox").css({left:"auto",right:"60px"});
				// display photo associated with station point
				$("#StationPointMode_InfoBoxImage").attr("src","images/StationPointPhotos/28-Station-Point-Photo.jpg");
				$("#StationPointMode_InfoBoxImage").css({width:"100%",height:"auto",float:"right"});
				// display station point label
				$("#StationPointMode_StationPointLabel").html("<span class='StationPointMode_StationPointLabelTitle'>Station Point 28</span> <br> A Trail Party Crossing Bridge");
				$("#StationPointMode_StationPointLabel").css({float: "right", height:"45px"});
			},
			deactivateStationPoint28Events : function() {
				$("#Viewshed28PNG").css({display:"none"});
			},
			activateStationPoint29Events : function() {
				$("#StationPoint29RolloverIcon").css({display:"block"});
				// position station point mode info box in map frame
				$("#StationPointMode_InfoBox").css({left:"auto",right:"10px"});
				// display photo associated with station point
				$("#StationPointMode_InfoBoxImage").attr("src","images/StationPointPhotos/29-Station-Point-Photo.jpg");
				$("#StationPointMode_InfoBoxImage").css({width:"auto",height:"100%",float:"right"});
				// display station point label
				$("#StationPointMode_StationPointLabel").html("<span class='StationPointMode_StationPointLabelTitle'>Station Point 29</span> <br> Ribbon Falls, Bright Angel Canyon");
				$("#StationPointMode_StationPointLabel").css({float: "right", height:"45px"});
				// display notification box stating that this station point does not have a viewshed
				$("#StationPointNotificationBox").css({left:"39%",right:"39%"});
			},
			deactivateStationPoint29Events : function() {
				// hide notification box
				$("#StationPointNotificationBox").css({left:"-99999px",right:"auto"});
			},
			activateStationPoint30Events : function() {
				// position station point mode info box in map frame
				$("#StationPointMode_InfoBox").css({left:"auto",right:"10px"});
				// display photo associated with station point
				$("#StationPointMode_InfoBoxImage").attr("src","images/StationPointPhotos/30-Station-Point-Photo.jpg");
				$("#StationPointMode_InfoBoxImage").css({width:"auto",height:"100%",float:"right"});
				// display station point label
				$("#StationPointMode_StationPointLabel").html("<span class='StationPointMode_StationPointLabelTitle'>Station Point 30</span> <br> Across to Roaring Springs, from Kaibab Trail");
				$("#StationPointMode_StationPointLabel").css({float: "right", height:"45px"});
			},
			deactivateStationPoint30Events : function() {
				$("#Viewshed30PNG").css({display:"none"});
			},
			activateStationPoint31Events : function() {
				$("#StationPoint31RolloverIcon").css({display:"block"});
				// position station point mode info box in map frame
				$("#StationPointMode_InfoBox").css({left:"auto",right:"60px"});
				// display photo associated with station point
				$("#StationPointMode_InfoBoxImage").attr("src","images/StationPointPhotos/31-Station-Point-Photo.jpg");
				$("#StationPointMode_InfoBoxImage").css({width:"100%",height:"auto",float:"right"});
				// display station point label
				$("#StationPointMode_StationPointLabel").html("<span class='StationPointMode_StationPointLabelTitle'>Station Point 31</span> <br> On the Kaibab Trail Above Roaring Springs");
				$("#StationPointMode_StationPointLabel").css({float: "right", height:"45px"});
				// display notification box stating that this station point does not have a viewshed
				$("#StationPointNotificationBox").css({left:"39%",right:"39%"});
			},
			deactivateStationPoint31Events : function() {
				// hide notification box
				$("#StationPointNotificationBox").css({left:"-99999px",right:"auto"});
			},
			activateStationPoint32Events : function() {
				// position station point mode info box in map frame
				$("#StationPointMode_InfoBox").css({left:"auto",right:"60px"});
				// display photo associated with station point
				$("#StationPointMode_InfoBoxImage").attr("src","images/StationPointPhotos/32-Station-Point-Photo.jpg");
				$("#StationPointMode_InfoBoxImage").css({width:"100%",height:"auto",float:"right"});
				// display station point label
				$("#StationPointMode_StationPointLabel").html("<span class='StationPointMode_StationPointLabelTitle'>Station Point 32</span> <br> Up Grand Canyon, from Bright Angel Point");
				$("#StationPointMode_StationPointLabel").css({float: "right", height:"45px"});
			},
			deactivateStationPoint32Events : function() {
				$("#Viewshed32PNG").css({display:"none"});
			},
			activateStationPoint33Events : function() {
				// position station point mode info box in map frame
				$("#StationPointMode_InfoBox").css({left:"auto",right:"60px"});
				// display photo associated with station point
				$("#StationPointMode_InfoBoxImage").attr("src","images/StationPointPhotos/33-Station-Point-Photo.jpg");
				$("#StationPointMode_InfoBoxImage").css({width:"100%",height:"auto",float:"right"});
				// display station point label
				$("#StationPointMode_StationPointLabel").html("<span class='StationPointMode_StationPointLabelTitle'>Station Point 33</span> <br> Across Oza Butte to South Rim");
				$("#StationPointMode_StationPointLabel").css({float: "right", height:"45px"});
			},
			deactivateStationPoint33Events : function() {
				$("#Viewshed33PNG").css({display:"none"});
			},
			activateStationPoint34Events : function() {
				$("#StationPoint34RolloverIcon").css({display:"block"});
				// position station point mode info box in map frame
				$("#StationPointMode_InfoBox").css({left:"10px",right:"auto"});
				// display photo associated with station point
				$("#StationPointMode_InfoBoxImage").attr("src","images/StationPointPhotos/34-Station-Point-Photo.jpg");
				$("#StationPointMode_InfoBoxImage").css({width:"100%",height:"auto",float:"left"});
				// display station point label
				$("#StationPointMode_StationPointLabel").html("<span class='StationPointMode_StationPointLabelTitle'>Station Point 34</span> <br> A Grove of Pines in the Kaibab Forest");
				$("#StationPointMode_StationPointLabel").css({float: "left", height:"45px"});
				// display notification box stating that this station point does not have a viewshed
				$("#StationPointNotificationBox").css({left:"39%",right:"39%"});
			},
			deactivateStationPoint34Events : function() {
				// hide notification box
				$("#StationPointNotificationBox").css({left:"-99999px",right:"auto"});
			},
			activateStationPoint35Events : function() {
				// position station point mode info box in map frame
				$("#StationPointMode_InfoBox").css({left:"auto",right:"60px"});
				// display photo associated with station point
				$("#StationPointMode_InfoBoxImage").attr("src","images/StationPointPhotos/35-Station-Point-Photo.jpg");
				$("#StationPointMode_InfoBoxImage").css({width:"100%",height:"auto",float:"right"});
				// display station point label
				$("#StationPointMode_StationPointLabel").html("<span class='StationPointMode_StationPointLabelTitle'>Station Point 35</span> <br> Across Canyon to Havasupai Point, <br> from Pt. Sublime");
				$("#StationPointMode_StationPointLabel").css({float: "right", height:"55px"});
			},
			deactivateStationPoint35Events : function() {
				$("#Viewshed35PNG").css({display:"none"});
			},
			activateStationPoint37Events : function() {
				// position station point mode info box in map frame
				$("#StationPointMode_InfoBox").css({left:"auto",right:"60px"});
				// display photo associated with station point
				$("#StationPointMode_InfoBoxImage").attr("src","images/StationPointPhotos/37-Station-Point-Photo.jpg");
				$("#StationPointMode_InfoBoxImage").css({width:"100%",height:"auto",float:"right"});
				// display station point label
				$("#StationPointMode_StationPointLabel").html("<span class='StationPointMode_StationPointLabelTitle'>Station Point 37</span> <br> Up Canyon to Shiva Temple, <br> from Pt. Sublime");
				$("#StationPointMode_StationPointLabel").css({float: "right", height:"55px"});
			},
			deactivateStationPoint37Events : function() {
				$("#Viewshed37PNG").css({display:"none"});
			},
			activateStationPoint38Events : function() {
				// position station point mode info box in map frame
				$("#StationPointMode_InfoBox").css({left:"auto",right:"60px"});
				// display photo associated with station point
				$("#StationPointMode_InfoBoxImage").attr("src","images/StationPointPhotos/38-Station-Point-Photo.jpg");
				$("#StationPointMode_InfoBoxImage").css({width:"100%",height:"auto",float:"right"});
				// display station point label
				$("#StationPointMode_StationPointLabel").html("<span class='StationPointMode_StationPointLabelTitle'>Station Point 38</span> <br> Down Canyon to Shiva Temple, <br> from Cape Royal");
				$("#StationPointMode_StationPointLabel").css({float: "right", height:"55px"});
			},
			deactivateStationPoint38Events : function() {
				$("#Viewshed38PNG").css({display:"none"});
			},
			activateStationPoint39Events : function() {
				// position station point mode info box in map frame
				$("#StationPointMode_InfoBox").css({left:"auto",right:"60px"});
				// display photo associated with station point
				$("#StationPointMode_InfoBoxImage").attr("src","images/StationPointPhotos/39-Station-Point-Photo.jpg");
				$("#StationPointMode_InfoBoxImage").css({width:"100%",height:"auto",float:"right"});
				// display station point label
				$("#StationPointMode_StationPointLabel").html("<span class='StationPointMode_StationPointLabelTitle'>Station Point 39</span> <br> Angel's Window, on Cape Royal");
				$("#StationPointMode_StationPointLabel").css({float: "right", height:"45px"});
			},
			deactivateStationPoint39Events : function() {
				$("#Viewshed39PNG").css({display:"none"});
			},
			activateStationPoint40Events : function() {
				// position station point mode info box in map frame
				$("#StationPointMode_InfoBox").css({left:"10px",right:"auto"});
				// display photo associated with station point
				$("#StationPointMode_InfoBoxImage").attr("src","images/StationPointPhotos/40-Station-Point-Photo.jpg");
				$("#StationPointMode_InfoBoxImage").css({width:"100%",height:"auto",float:"left"});
				// display station point label
				$("#StationPointMode_StationPointLabel").html("<span class='StationPointMode_StationPointLabelTitle'>Station Point 40</span> <br> Across Marble Gorge to Painted Desert, <br> at Pt. Imperial");
				$("#StationPointMode_StationPointLabel").css({float: "left", height:"55px"});
			},
			deactivateStationPoint40Events : function() {
				$("#Viewshed40PNG").css({display:"none"});
			},
			activateStationPoint41Events : function() {
				// position station point mode info box in map frame
				$("#StationPointMode_InfoBox").css({left:"10px",right:"auto"});
				// display photo associated with station point
				$("#StationPointMode_InfoBoxImage").attr("src","images/StationPointPhotos/41-Station-Point-Photo.jpg");
				$("#StationPointMode_InfoBoxImage").css({width:"100%",height:"auto",float:"left"});
				// display station point label
				$("#StationPointMode_StationPointLabel").html("<span class='StationPointMode_StationPointLabelTitle'>Station Point 41</span> <br> Toward Little Colorado River, <br> from Pt. Imperial");
				$("#StationPointMode_StationPointLabel").css({float: "left", height:"55px"});
			},
			deactivateStationPoint41Events : function() {
				$("#Viewshed41PNG").css({display:"none"});
			},
			activateStationPoint42Events : function() {
				// position station point mode info box in map frame
				$("#StationPointMode_InfoBox").css({left:"auto",left:"10px"});
				// display photo associated with station point
				$("#StationPointMode_InfoBoxImage").attr("src","images/StationPointPhotos/42-Station-Point-Photo.jpg");
				$("#StationPointMode_InfoBoxImage").css({width:"100%",height:"auto",float:"left"});
				// display station point label
				$("#StationPointMode_StationPointLabel").html("<span class='StationPointMode_StationPointLabelTitle'>Station Point 42</span> <br> A Storm in the Grand Canyon");
				$("#StationPointMode_StationPointLabel").css({float: "left", height:"45px"});
			},
			deactivateStationPoint42Events : function() {
				$("#Viewshed42PNG").css({display:"none"});
			},
			activateStationPoint43Events : function() {
				// position station point mode info box in map frame
				$("#StationPointMode_InfoBox").css({left:"auto",left:"10px"});
				// display photo associated with station point
				$("#StationPointMode_InfoBoxImage").attr("src","images/StationPointPhotos/43-Station-Point-Photo.jpg");
				$("#StationPointMode_InfoBoxImage").css({width:"100%",height:"auto",float:"left"});
				// display station point label
				$("#StationPointMode_StationPointLabel").html("<span class='StationPointMode_StationPointLabelTitle'>Station Point 43</span> <br> After the Storm");
				$("#StationPointMode_StationPointLabel").css({float: "left", height:"45px"});
			},
			deactivateStationPoint43Events : function() {
				$("#Viewshed43PNG").css({display:"none"});
			}
		};

		/**
		 * Displays popup when user clicks on station point. Calls the
		 * displayCorrespondingStationPointPopup(...) function that executes
		 * the changes that differ between station points.
		 */
		function displayStationPointPopup(station_point_name) {
			if(is_explore_by_station_point_mode_active) {
				var current_station_point_number = station_point_name.substring("StationPoint".length).toString();
				$("#Viewshed"+current_station_point_number+"PNG").css({display: "none"});
				$("#StationPointPopup").attr("src","images/StationPointPhotos/"+current_station_point_number+"-Station-Point-Photo.jpg");

				$("#StationPointMode_InfoBox").css({left:"auto",right:"-999999px"});
				$("#StationPointMode_InfoBoxImage").attr("src","");
				$("#StationPointMode_InfoBoxImage").css({border:"0"});

				displayCorrespondingStationPointPopup(station_point_name);
				$("#StationPointNotificationBox").css({left:"-99999px",right:"auto"});
				$("#StationPointPopupDiv").css({display:"block",zIndex:4000});
				$("#StationPointPopupLink").attr("target","_blank");
			}
		}

		/**
		 * Called by the displayStationPointPopup(...) function. Executes the
		 * changes that differ between station points.
		 */
		function displayCorrespondingStationPointPopup(station_point_name) {
			switch(station_point_name) {
				case "StationPoint2":
					$("#StationPointPopup").css({width:"80%",height:"auto",left:"10%",right:"10%"});
					$("#StationPointPopup").css({top: getStationPointPopupOffset("StationPoint2")+"px"});
					$("#StationPointPopupLink").attr("href","http://enchantingthedesert.com/2-on-grand-view-point/");
					break;
				case "StationPoint3":
					$("#StationPointPopup").css({width:"80%",height:"auto",left:"10%",right:"10%"});
					$("#StationPointPopup").css({top: getStationPointPopupOffset("StationPoint3")+"px"});
					$("#StationPointPopupLink").attr("href","http://enchantingthedesert.com/3-angels-gate-wotans-throne-and-vishnu-temple/");
					break;
				case "StationPoint4":
					$("#StationPointPopup").css({width:"80%",height:"auto",left:"10%",right:"10%"});
					$("#StationPointPopup").css({top: getStationPointPopupOffset("StationPoint4")+"px"});
					$("#StationPointPopupLink").attr("href","http://enchantingthedesert.com/4-up-granite-gorge/");
					break;
				case "StationPoint5":
					$("#StationPointPopup").css({width:"80%",height:"auto",left:"10%",right:"10%"});
					$("#StationPointPopup").css({top: getStationPointPopupOffset("StationPoint5")+"px"});
					$("#StationPointPopupLink").attr("href","http://enchantingthedesert.com/5-down-granite-gorge-from-grand-view-trail/");
					break;
				case "StationPoint6":
					$("#StationPointPopup").css({width:"80%",height:"auto",left:"10%",right:"10%"});
					$("#StationPointPopup").css({top: getStationPointPopupOffset("StationPoint6")+"px"});
					$("#StationPointPopupLink").attr("href","http://enchantingthedesert.com/6-up-grand-canyon-from-moran-point/");
					break;
				case "StationPoint7":
					$("#StationPointPopup").css({width:"80%",height:"auto",left:"10%",right:"10%"});
					$("#StationPointPopup").css({top: getStationPointPopupOffset("StationPoint7")+"px"});
					$("#StationPointPopupLink").attr("href","http://enchantingthedesert.com/7-up-grand-canyon-from-zuni-point/");
					break;
				case "StationPoint8":
					$("#StationPointPopup").css({width:"80%",height:"auto",left:"10%",right:"10%"});
					$("#StationPointPopup").css({top: getStationPointPopupOffset("StationPoint8")+"px"});
					$("#StationPointPopupLink").attr("href","http://enchantingthedesert.com/8-up-to-marble-gorge-and-painted-desert-from-lipan-point/");
					break;
				case "StationPoint9":
					$("#StationPointPopup").css({width:"80%",height:"auto",left:"10%",right:"10%"});
					$("#StationPointPopup").css({top: getStationPointPopupOffset("StationPoint9")+"px"});
					$("#StationPointPopupLink").attr("href","http://enchantingthedesert.com/9-up-to-marble-gorge-and-painted-desert-from-desert-view/");
					break;
				case "StationPoint10":
					$("#StationPointPopup").css({width:"80%",height:"auto",left:"10%",right:"10%"});
					$("#StationPointPopup").css({top: getStationPointPopupOffset("StationPoint10")+"px"});
					$("#StationPointPopupLink").attr("href","http://enchantingthedesert.com/10-down-grand-canyon-from-zuni-point/");
					break;
				case "StationPoint11":
					$("#StationPointPopup").css({width:"80%",height:"auto",left:"10%",right:"10%"});
					$("#StationPointPopup").css({top: getStationPointPopupOffset("StationPoint11")+"px"});
					$("#StationPointPopupLink").attr("href","http://enchantingthedesert.com/11-across-grand-canyon-near-el-tovar/");
					break;
				case "StationPoint12":
					$("#StationPointPopup").css({width:"80%",height:"auto",left:"10%",right:"10%"});
					$("#StationPointPopup").css({top: getStationPointPopupOffset("StationPoint12")+"px"});
					$("#StationPointPopupLink").attr("href","http://enchantingthedesert.com/12-descending-the-zigzags-bright-angel-trail/");
					break;
				case "StationPoint13":
					$("#StationPointPopup").css({width:"80%",height:"auto",left:"10%",right:"10%"});
					$("#StationPointPopup").css({top: getStationPointPopupOffset("StationPoint13")+"px"});
					$("#StationPointPopupLink").attr("href","http://enchantingthedesert.com/13-colorado-river-and-zoroaster-temple-foot-of-bright-angel-trail/");
					break;
				case "StationPoint14":
					$("#StationPointPopup").css({width:"80%",height:"auto",left:"10%",right:"10%"});
					$("#StationPointPopup").css({top: getStationPointPopupOffset("StationPoint14")+"px"});
					$("#StationPointPopupLink").attr("href","http://enchantingthedesert.com/14-hopi-indian-buffalo-dance-at-el-tovar/");
					break;
				case "StationPoint15":
					$("#StationPointPopup").css({width:"80%",height:"auto",left:"10%",right:"10%"});
					$("#StationPointPopup").css({top: getStationPointPopupOffset("StationPoint15")+"px"});
					$("#StationPointPopupLink").attr("href","http://enchantingthedesert.com/15-hopi-indian-eagle-dance-at-el-tovar/");
					break;
				case "StationPoint16":
					$("#StationPointPopup").css({width:"80%",height:"auto",left:"10%",right:"10%"});
					$("#StationPointPopup").css({top: getStationPointPopupOffset("StationPoint16")+"px"});
					$("#StationPointPopupLink").attr("href","http://enchantingthedesert.com/16-hopi-indian-war-dance-at-el-tovar/");
					break;
				case "StationPoint17":
					$("#StationPointPopup").css({width:"80%",height:"auto",left:"10%",right:"10%"});
					$("#StationPointPopup").css({top: getStationPointPopupOffset("StationPoint17")+"px"});
					$("#StationPointPopupLink").attr("href","http://enchantingthedesert.com/17-down-grand-canyon-from-hopi-point/");
					break;
				case "StationPoint18":
					$("#StationPointPopup").css({width:"80%",height:"auto",left:"10%",right:"10%"});
					$("#StationPointPopup").css({top: getStationPointPopupOffset("StationPoint18")+"px"});
					$("#StationPointPopupLink").attr("href","http://enchantingthedesert.com/18-eastern-outlook-from-havasupai-point/");
					break;
				case "StationPoint19":
					$("#StationPointPopup").css({width:"80%",height:"auto",left:"10%",right:"10%"});
					$("#StationPointPopup").css({top: getStationPointPopupOffset("StationPoint19")+"px"});
					$("#StationPointPopupLink").attr("href","http://enchantingthedesert.com/19-across-grand-scenic-divide-from-havasupai-point/");
					break;
				case "StationPoint20":
					$("#StationPointPopup").css({width:"80%",height:"auto",left:"10%",right:"10%"});
					$("#StationPointPopup").css({top: getStationPointPopupOffset("StationPoint20")+"px"});
					$("#StationPointPopupLink").attr("href","http://enchantingthedesert.com/20-havasupai-point-from-grand-scenic-divide/");
					break;
				case "StationPoint21":
					$("#StationPointPopup").css({width:"80%",height:"auto",left:"10%",right:"10%"});
					$("#StationPointPopup").css({top: getStationPointPopupOffset("StationPoint21")+"px"});
					$("#StationPointPopupLink").attr("href","http://enchantingthedesert.com/21-north-wall-of-canyon-from-grand-scenic-divide/");
					break;
				case "StationPoint22":
					$("#StationPointPopup").css({width:"80%",height:"auto",left:"10%",right:"10%"});
					$("#StationPointPopup").css({top: getStationPointPopupOffset("StationPoint22")+"px"});
					$("#StationPointPopupLink").attr("href","http://enchantingthedesert.com/22-up-grand-canyon-from-grand-scenic-divide/");
					break;
				case "StationPoint23":
					$("#StationPointPopup").css({width:"80%",height:"auto",left:"10%",right:"10%"});
					$("#StationPointPopup").css({top: getStationPointPopupOffset("StationPoint23")+"px"});
					$("#StationPointPopupLink").attr("href","http://enchantingthedesert.com/23-birds-eye-view-of-grand-canyon-from-an-airplane/");
					break;
				case "StationPoint24":
					$("#StationPointPopup").css({width:"80%",height:"auto",left:"10%",right:"10%"});
					$("#StationPointPopup").css({top: getStationPointPopupOffset("StationPoint24")+"px"});
					$("#StationPointPopupLink").attr("href","http://enchantingthedesert.com/24-bright-angel-canyon-from-yavapai-point/");
					break;
				case "StationPoint25":
					$("#StationPointPopup").css({width:"auto",height:"80%",top:"9%",bottom:"11%"});
					$("#StationPointPopup").css({left: getStationPointPopupOffset("StationPoint25")+"px"});
					$("#StationPointPopupLink").attr("href","http://enchantingthedesert.com/25-starting-down-the-kaibab-trail-from-yaki-point/");
					break;
				case "StationPoint26":
					$("#StationPointPopup").css({width:"80%",height:"auto",left:"10%",right:"10%"});
					$("#StationPointPopup").css({top: getStationPointPopupOffset("StationPoint26")+"px"});
					$("#StationPointPopupLink").attr("href","http://enchantingthedesert.com/26-the-kaibab-suspension-bridge/");
					break;
				case "StationPoint27":
					$("#StationPointPopup").css({width:"80%",height:"auto",left:"10%",right:"10%"});
					$("#StationPointPopup").css({top: getStationPointPopupOffset("StationPoint27")+"px"});
					$("#StationPointPopupLink").attr("href","http://enchantingthedesert.com/27-tunnel-approach-to-bridge/");
					break;
				case "StationPoint28":
					$("#StationPointPopup").css({width:"80%",height:"auto",left:"10%",right:"10%"});
					$("#StationPointPopup").css({top: getStationPointPopupOffset("StationPoint28")+"px"});
					$("#StationPointPopupLink").attr("href","http://enchantingthedesert.com/28-a-trail-party-crossing-bridge/");
					break;
				case "StationPoint29":
					$("#StationPointPopup").css({width:"auto",height:"80%",top:"9%",bottom:"11%"});
					$("#StationPointPopup").css({left: getStationPointPopupOffset("StationPoint29")+"px"});
					$("#StationPointPopupLink").attr("href","http://enchantingthedesert.com/29-ribbon-falls-bright-angel-canyon/");
					break;
				case "StationPoint30":
					$("#StationPointPopup").css({width:"auto",height:"80%",top:"9%",bottom:"11%"});
					$("#StationPointPopup").css({left: getStationPointPopupOffset("StationPoint30")+"px"});
					$("#StationPointPopupLink").attr("href","http://enchantingthedesert.com/30-across-to-roaring-springs-from-kaibab-trail/");
					break;
				case "StationPoint31":
					$("#StationPointPopup").css({width:"80%",height:"auto",left:"10%",right:"10%"});
					$("#StationPointPopup").css({top: getStationPointPopupOffset("StationPoint31")+"px"});
					$("#StationPointPopupLink").attr("href","http://enchantingthedesert.com/31-on-the-kaibab-trail-above-roaring-springs/");
					break;
				case "StationPoint32":
					$("#StationPointPopup").css({width:"80%",height:"auto",left:"10%",right:"10%"});
					$("#StationPointPopup").css({top: getStationPointPopupOffset("StationPoint32")+"px"});
					$("#StationPointPopupLink").attr("href","http://enchantingthedesert.com/32-up-grand-canyon-from-bright-angel-point-2/");
					break;
				case "StationPoint33":
					$("#StationPointPopup").css({width:"80%",height:"auto",left:"10%",right:"10%"});
					$("#StationPointPopup").css({top: getStationPointPopupOffset("StationPoint33")+"px"});
					$("#StationPointPopupLink").attr("href","http://enchantingthedesert.com/33-across-oza-butte-to-south-rim/");
					break;
				case "StationPoint34":
					$("#StationPointPopup").css({width:"80%",height:"auto",left:"10%",right:"10%"});
					$("#StationPointPopup").css({top: getStationPointPopupOffset("StationPoint34")+"px"});
					$("#StationPointPopupLink").attr("href","http://enchantingthedesert.com/34-a-grove-of-pines-in-the-kaibab-forest/");
					break;
				case "StationPoint35":
					$("#StationPointPopup").css({width:"80%",height:"auto",left:"10%",right:"10%"});
					$("#StationPointPopup").css({top: getStationPointPopupOffset("StationPoint35")+"px"});
					$("#StationPointPopupLink").attr("href","http://enchantingthedesert.com/35-across-canyon-to-havasupai-point-from-pt-sublime/");
					break;
				case "StationPoint37":
					$("#StationPointPopup").css({width:"80%",height:"auto",left:"10%",right:"10%"});
					$("#StationPointPopup").css({top: getStationPointPopupOffset("StationPoint37")+"px"});
					$("#StationPointPopupLink").attr("href","http://enchantingthedesert.com/37-up-canyon-to-shiva-temple-from-pt-sublime/");
					break;
				case "StationPoint38":
					$("#StationPointPopup").css({width:"80%",height:"auto",left:"10%",right:"10%"});
					$("#StationPointPopup").css({top: getStationPointPopupOffset("StationPoint38")+"px"});
					$("#StationPointPopupLink").attr("href","http://enchantingthedesert.com/38-down-canyon-to-shiva-temple-from-cape-royal/");
					break;
				case "StationPoint39":
					$("#StationPointPopup").css({width:"80%",height:"auto",left:"10%",right:"10%"});
					$("#StationPointPopup").css({top: getStationPointPopupOffset("StationPoint39")+"px"});
					$("#StationPointPopupLink").attr("href","http://enchantingthedesert.com/39-angels-window-on-cape-royal/");
					break;
				case "StationPoint40":
					$("#StationPointPopup").css({width:"80%",height:"auto",left:"10%",right:"10%"});
					$("#StationPointPopup").css({top: getStationPointPopupOffset("StationPoint40")+"px"});
					$("#StationPointPopupLink").attr("href","http://enchantingthedesert.com/40-across-marble-gorge-to-painted-desert-at-pt-imperial/");
					break;
				case "StationPoint41":
					$("#StationPointPopup").css({width:"80%",height:"auto",left:"10%",right:"10%"});
					$("#StationPointPopup").css({top: getStationPointPopupOffset("StationPoint41")+"px"});
					$("#StationPointPopupLink").attr("href","http://enchantingthedesert.com/41-toward-little-colorado-river-from-point-imperial/");
					break;
				case "StationPoint42":
					$("#StationPointPopup").css({width:"80%",height:"auto",left:"10%",right:"10%"});
					$("#StationPointPopup").css({top: getStationPointPopupOffset("StationPoint42")+"px"});
					$("#StationPointPopupLink").attr("href","http://enchantingthedesert.com/42-a-storm-in-the-grand-canyon/");
					break;
				case "StationPoint43":
					$("#StationPointPopup").css({width:"80%",height:"auto",left:"10%",right:"10%"});
					$("#StationPointPopup").css({top: getStationPointPopupOffset("StationPoint43")+"px"});
					$("#StationPointPopupLink").attr("href","http://enchantingthedesert.com/43-after-the-storm/");
					break;
				default:
					break;
			}
		}

		/**
		 * Returns the top offset needed to vertically center the popup image for
		 * the current active station point.
		 */
		 function getStationPointPopupOffset(active_station_point) {
		 	// retrieve the station point popup image's aspect ratio
		 	var stationpoint_popup_image_aspect_ratio = getStationPointPopupImageAspectRatio(active_station_point);

		 	var stationpoint_popup_width, stationpoint_popup_height;

		 	if(stationpoint_popup_image_aspect_ratio < 1) {
		 		// if the image is wider than it is tall
		 		stationpoint_popup_width = $("#StationPointPopupDiv").width() * 0.8;
				stationpoint_popup_height = stationpoint_popup_width * stationpoint_popup_image_aspect_ratio;
				// return the value of the top offset of the popup image that centers it vertically;
				// subtract an additional 10px from the correct value for stylistic purposes
				return (($("#StationPointPopupDiv").height() - stationpoint_popup_height) / 2) - 10;
		 	} else {
		 		// if the image is taller than it is wide
		 		stationpoint_popup_height = $("#StationPointPopupDiv").height() * 0.8;
		 		stationpoint_popup_width = stationpoint_popup_height / stationpoint_popup_image_aspect_ratio;
		 		return ($("#StationPointPopupDiv").width() - stationpoint_popup_width) / 2;
		 	}
		}

		/**
		 * Returns the aspect ratio of the popup image for the station point
		 * corresponding to the active_station_point parameter. Aspect ratio
		 * here defined as (height in pixels)/(width in pixels).
		 */
		function getStationPointPopupImageAspectRatio(active_station_point) {
			switch(active_station_point) {
		 		case "StationPoint2":
		 			return 485/700;
		 		case "StationPoint3":
		 			return 486/700;
		 		case "StationPoint4":
		 			return 576/700;
		 		case "StationPoint5":
		 			return 563/700;
		 		case "StationPoint6":
		 			return 553/700;
		 		case "StationPoint7":
		 			return 551/700;
		 		case "StationPoint8":
		 			return 500/700;
		 		case "StationPoint9":
		 			return 487/700;
		 		case "StationPoint10":
		 			return 549/700;
		 		case "StationPoint11":
		 			return 498/700;
		 		case "StationPoint12":
		 			return 546/700;
		 		case "StationPoint13":
		 			return 526/700;
		 		case "StationPoint14":
		 			return 486/700;
		 		case "StationPoint15":
		 			return 502/700;
		 		case "StationPoint16":
		 			return 497/700;
		 		case "StationPoint17":
		 			return 552/700;
		 		case "StationPoint18":
		 			return 551/700;
		 		case "StationPoint19":
		 			return 550/700;
		 		case "StationPoint20":
		 			return 560/700;
		 		case "StationPoint21":
		 			return 562/700;
		 		case "StationPoint22":
		 			return 548/700;
		 		case "StationPoint23":
		 			return 503/700;
		 		case "StationPoint24":
		 			return 549/700;
		 		case "StationPoint25":
		 			return 700/493;
		 		case "StationPoint26":
		 			return 486/700;
		 		case "StationPoint27":
		 			return 491/700;
		 		case "StationPoint28":
		 			return 550/700;
		 		case "StationPoint29":
		 			return 700/499;
		 		case "StationPoint30":
		 			return 700/487;
		 		case "StationPoint31":
		 			return 487/700;
		 		case "StationPoint32":
		 			return 486/700;
		 		case "StationPoint33":
		 			return 434/700;
		 		case "StationPoint34":
		 			return 475/700;
		 		case "StationPoint35":
		 			return 476/700;
		 		case "StationPoint37":
		 			return 475/700;
		 		case "StationPoint38":
		 			return 473/700;
		 		case "StationPoint39":
		 			return 490/700;
		 		case "StationPoint40":
		 			return 494/700;
		 		case "StationPoint41":
		 			return 487/700;
		 		case "StationPoint42":
		 			return 485/700;
		 		case "StationPoint43":
		 			return 548/700;
		 		default:
		 			return 500/700;
		 	}
		}

		/**
		 * If the user has clicked on the grayed out background of the station point
		 * popup itself (and not on the popup image), hide the station point popup
		 * (along with the popup image, as it is contained in the station point popup).
		 */
		function hideStationPointPopup(event) {
			var clicked_object = document.elementFromPoint(event.clientX,event.clientY);
			if(clicked_object.id != "StationPointPopup") {
				$("#StationPointPopupDiv").css({display:"none",zIndex:-1});
			}
		}

		/**
		 * Allows ExploreByLocationMode to set private variable's status (i.e. when
		 * location mode is activated and is_explore_by_station_point_mode_active
		 * has to be set to false).
		 */
		function setExploreByStationPointModeStatus(status) {
			is_explore_by_station_point_mode_active = status;
		}

		/**
		 * Allows ExploreByLocationMode to get private variable's status (i.e. when
		 * determining whether to respond location mode events).
		 */
		function getExploreByStationPointModeStatus() {
			return is_explore_by_station_point_mode_active;
		}

		/**
		 * Displays hint for the station point mode button.
		 */
		function displayHint() {
			$("#station_point_mode_button_hint_container").css({left: "0", right: "0"});
			$("#Mode_Button_One_Hover").css({display: "block"});
		}

		/**
		 * Hides hint for the station point mode button.
		 */
		function hideHint() {
			$("#station_point_mode_button_hint_container").css({left: "-99999px", right: "auto"});
			$("#Mode_Button_One_Hover").css({display: "none"});	
		}
		
		var public_objects =
		{
			activateMode : activateMode,
			activateStationPointMouseoverEvents : activateStationPointMouseoverEvents,
			deactivateStationPointMouseoverEvents : deactivateStationPointMouseoverEvents,
			displayStationPointPopup : displayStationPointPopup,
			hideStationPointPopup : hideStationPointPopup,
			setExploreByStationPointModeStatus : setExploreByStationPointModeStatus,
			getExploreByStationPointModeStatus : getExploreByStationPointModeStatus,
			displayHint : displayHint,
			hideHint : hideHint
		};

		return public_objects;
	}();


	var ExploreByLocationMode = function()
	{
		var is_explore_by_location_mode_active = false,

			// boolean variable to store information about whether a popup div is currently fading out;
			// used to make sure the user does not click to open another popup before the current
			// popup has finished fading out and is removed
			popup_fade_out_in_progress = false; 

		/**
		 * Called when user clicks on the location mode button.
		 */
		function activateMode()
		{
			// only activate location mode if it is not already active
			if(!is_explore_by_location_mode_active) {
				is_explore_by_location_mode_active = true;
				ExploreByStationPointMode.setExploreByStationPointModeStatus(false);
				setAllStationPointIconsOpacity(0.6);
				
				VernonChuo.GrandCanyonInteractiveMapDimensions.setContentDimensions();
				$("#Mode_Button_All_On").css({display: "block"});
				$("#Mode_Button_One_On").css({display: "none"});
				//place StationPointSVGLayer at a lower layer so that the viewshed layers
				//can be accessed from the top
				$("#StationPointSVGLayer").css({zIndex:400});
				
				$("#StationPointMode_InfoBox").css({left:"auto",right:"-99999px",zIndex:-1});
				$("#LocationMode_InfoBox").css({left:"auto",right:"60px",zIndex:1000});
			}
		}

		/**
		 * Called by the trackMouseCoordsAndCheckForExploreByLocationModeEvents(...)
		 * function for all mousemove events if location mode is activated. Finds
		 * all active station points and displays the rollover icons for them. A station
		 * point is deemed active if the location the user's cursor is pointing to on the
		 * map can be seen from the photo corresponding to the station point.
		 */
		function checkLocationModeMouseoverEvents()
		{
			// create array to store active station points
			var active_station_points_arr = [];

			active_station_points_arr = findActiveStationPoints(active_station_points_arr);
			displayActiveStationPointsNames(active_station_points_arr);
			positionLocationModeInfoBox(active_station_points_arr);

			var StationPointIcons = document.getElementsByClassName("StationPointIcon");
			if(active_station_points_arr.length > 0) {
				for(var i = 0; i < StationPointIcons.length; i++) {
					StationPointIcons[i].style.display = "none";
				}
				for(var i = 0; i <= active_station_points_arr.length; i++) {
					$("#StationPoint"+active_station_points_arr[i]+"Icon").css({display:"block"});
				}
			} else {
				for(var i = 0; i < StationPointIcons.length; i++) {
					$("#"+StationPointIcons[i].id).css({display:"block"});
				}
			}
			// reset z-index values for all viewsheds
			setViewshedDivZIndexValues();
		}

		/**
		 * Helper function called by the checkLocationModeMouseoverEvents() function.
		 * Returns an array containing all of the active station points. A station
		 * point is deemed active if the location the user's cursor is pointing to on the
		 * map can be seen from the photo corresponding to the station point. Since the
		 * viewshed of a photo represents what can be seen in a photo, to find all the
		 * active station points, this function iteratively switches the various viewshed
		 * divs to be at the top z-index layer (each viewshed div is positioned at a different
		 * z-index) to use the elementFromPoint(...) function to determine whether the
		 * user's cursor is pointing to the viewshed corresponding to a Viewshed Div.
		 *
		 * For example, Viewshed2Div is the container div that contains the SVGs for
		 * viewshed 2. Currently, Viewshed2Div is placed at the top z-index layer, so
		 * we could determine whether the user's cursor is pointing to any of the SVGs
		 * corresponding to viewshed 2, and therefore determine whether station point 2
		 * is an active station point. However, we cannot determine this information for
		 * any of the other viewsheds yet because Viewshed3Div, Viewshed4Div, ..., are all
		 * at lower z-index layers and therefore the SVGs corresponding to their viewsheds
		 * cannot be detected using the elementFromPoint(...) function. Hence, the function
		 * below, iteratively changes the z-index of the Viewshed Div currently at the top
		 * z-index layer to a lower z-index layer so as to access the Viewshed Divs below
		 * it. Using this method, we can then determine all of the photos from which the
		 * location the user's cursor is pointing to on the map can be seen. Indeed, this
		 * method is not very scalable if we are talking about thousands of viewsheds, but
		 * as this project will only be limited to 33 viewsheds, this method is feasible
		 * and works well in practice.
		 */
		function findActiveStationPoints(active_station_points_arr) {
			// array of z-indices used in this function to place the current viewshed div (in
			// the current iteration of the for loop below) at a lower z-index relative to the other
			// viewshed divs so that we can access the events of the viewshed divs that were originally
			// at lower z-indices relative to the current viewshed div
			var temp_zindex_arr = [];
			for(var i = 400; i > 367; i--) temp_zindex_arr.push(i);

			// array for iteration through station points with viewsheds (not all station points have
			// corresponding viewsheds)
			var stationpoints_with_viewsheds = ["StationPoint2","StationPoint3","StationPoint4","StationPoint5","StationPoint6","StationPoint7","StationPoint8","StationPoint9","StationPoint10","StationPoint11","StationPoint12","StationPoint13","StationPoint17","StationPoint18","StationPoint19","StationPoint20","StationPoint21","StationPoint22","StationPoint23","StationPoint24","StationPoint26","StationPoint28","StationPoint30","StationPoint32","StationPoint33","StationPoint35","StationPoint37","StationPoint38","StationPoint39","StationPoint40","StationPoint41","StationPoint42","StationPoint43"];

			// array used for access to the Viewshed Div corresopnding to the ith iteration of the for loop below
			var viewshed_div_names = ["Viewshed2Div","Viewshed3Div","Viewshed4Div","Viewshed5Div","Viewshed6Div","Viewshed7Div","Viewshed8Div","Viewshed9Div","Viewshed10Div","Viewshed11Div","Viewshed12Div","Viewshed13Div","Viewshed17Div","Viewshed18Div","Viewshed19Div","Viewshed20Div","Viewshed21Div","Viewshed22Div","Viewshed23Div","Viewshed24Div","Viewshed26Div","Viewshed28Div","Viewshed30Div","Viewshed32Div","Viewshed33Div","Viewshed35Div","Viewshed37Div","Viewshed38Div","Viewshed39Div","Viewshed40Div","Viewshed41Div","Viewshed42Div","Viewshed43Div"];

			for(var i = 0; i < 33; i++) {
				var object_at_cursor = document.elementFromPoint(current_mouse_x_coord,current_mouse_y_coord);
				var current_station_point_number = $("#"+stationpoints_with_viewsheds[i]).attr("id").substring("StationPoint".length).toString();
				if(object_at_cursor.tagName != null && object_at_cursor.tagName == "path") {
					$("#StationPoint"+current_station_point_number+"RolloverIcon").css({display: "block"});
					$("#Viewshed"+current_station_point_number+"PNG").css({display: "block"});
					active_station_points_arr.push(current_station_point_number);
				} else {
					$("#StationPoint"+current_station_point_number+"RolloverIcon").css({display: "none"});
					$("#Viewshed"+current_station_point_number+"PNG").css({display: "none"});
				}
				// set current viewshed layer to a lower z-index (stored in 
				// temp_zindex_arr) to access lower viewshed layers
				$("#"+viewshed_div_names[i]).css({zIndex: temp_zindex_arr[i]});
			}
			return active_station_points_arr;
		}

		/**
		 * Iterates through the array containing all of the active station points
		 * and displays their names in the information box for location mode.
		 */
		function displayActiveStationPointsNames(active_station_points_arr)
		{
			for(var i = 1; i <= active_station_points_arr.length; i++) {
				switch(i) {
					case 1:
						$("#LocationMode_1stStationPoint").html("Station Point " + active_station_points_arr[0]);
						break;
					case 2:
						$("#LocationMode_2ndStationPoint").html("Station Point " + active_station_points_arr[1]);
						break;
					case 3:
						$("#LocationMode_3rdStationPoint").html("Station Point " + active_station_points_arr[2]);
						break;
					case 4:
						$("#LocationMode_4thStationPoint").html("Station Point " + active_station_points_arr[3]);
						break;
					case 5:
						$("#LocationMode_5thStationPoint").html("Station Point " + active_station_points_arr[4]);
						break;
					case 6:
						$("#LocationMode_6thStationPoint").html("Station Point " + active_station_points_arr[5]);
						break;
					case 7:
						$("#LocationMode_7thStationPoint").html("Station Point " + active_station_points_arr[6]);
						break;
					case 8:
						$("#LocationMode_8thStationPoint").html("Station Point " + active_station_points_arr[7]);
						break;
					default:
						break;
				}
			}
			for(var i = active_station_points_arr.length+1; i <= 8; i++) {
				switch(i) {
					case 1:
						$("#LocationMode_1stStationPoint").html("");
						break;
					case 2:
						$("#LocationMode_2ndStationPoint").html("");
						break;
					case 3:
						$("#LocationMode_3rdStationPoint").html("");
						break;
					case 4:
						$("#LocationMode_4thStationPoint").html("");
						break;
					case 5:
						$("#LocationMode_5thStationPoint").html("");
						break;
					case 6:
						$("#LocationMode_6thStationPoint").html("");
						break;
					case 7:
						$("#LocationMode_7thStationPoint").html("");
						break;
					case 8:
						$("#LocationMode_8thStationPoint").html("");
						break;
					default:
						break;
				}
			}
		}

		/**
		 * Positions the LocationMode_InfoBox either at the top-left corner
		 * or at the top-right corner of the map depending on which station
		 * points are active. Some active station points may benefit more
		 * from having the LocationMode_InfoBox being placed at a specific
		 * corner of the map because, for example, their viewsheds may
		 * cross over to the top-right corner of the map and if the
		 * LocationMode_InfoBox were positioned at the top-right corner, it
		 * may obstruct the user from fully investigating the viewsheds;
		 * hence, in this case, the LocationMode_InfoBox could be positioned
		 * at the top-left corner of the map.
		 */
		function positionLocationModeInfoBox(active_station_points_arr) {
			// array of station points that would benefit from having the
			// LocationMode_InfoBox positioned on the left side of the map
			// i.e. viewsheds may be covered by the info box
			var station_points_right_arr = [
				"2", "6", "7", "8", "9", "23", "30", "40", "41", "42", "43"],
			// array of station points that would benefit from having the
			// LocationMode_InfoBox positioned on the right side of the map;
			// i.e. viewsheds may be covered by the info box
				station_points_left_arr = [
				"10", "11", "12", "17", "18", "19", "20", "21", "22", "35", "37"];
			if(atLeastOneInputItemInActiveStationPointsArr(station_points_right_arr, 
				active_station_points_arr)) {
				$("#LocationMode_InfoBox").css({left:"20px",right:"auto"});
			}
			if(atLeastOneInputItemInActiveStationPointsArr(station_points_left_arr, 
				active_station_points_arr)) {
				$("#LocationMode_InfoBox").css({left:"auto",right:"60px"});
			}
		}

		/**
		 * Returns true if at least one of the items in station_points_arr
		 * is found in active_station_points_arr. Used by the 
		 * positionLocationModeInfoBox(...) function to determine whether to 
		 * position the LocationMode_InfoBox on the left or the right side
		 * of the map.
		 */
		function atLeastOneInputItemInActiveStationPointsArr(station_points_arr, active_station_points_arr) {
			for(var i = 0; i < station_points_arr.length; i++) {
				if($.inArray(station_points_arr[i], active_station_points_arr) != -1) {
					return true;
				}
			}
			return false;
		}

		/**
		 * This function resets z-index values for all viewshed divs to defaults.
		 */
		function setViewshedDivZIndexValues() {
			var temp_ind = [];
			for(var i = 500; i > 466; i--) temp_ind.push(i);

			var ViewshedDivs = document.getElementsByClassName("ViewshedDivs");
			for(var i = 0; i < ViewshedDivs.length; i++) {
				$("#"+ViewshedDivs[i].id).css({zIndex:temp_ind[i]});
			}
		}

		/**
		 * Function displays popup when user clicks on viewshed and when location mode is active.
		 */
		function displayLocationModePopup() {
			// if location mode is active
			if(!ExploreByStationPointMode.getExploreByStationPointModeStatus() && !popup_fade_out_in_progress) {
				
				// array to store which station points the location the user clicked on is visible
				var stationpoints_visible = [];

				stationpoints_visible = findActiveStationPoints(stationpoints_visible);
				
				// if the user has clicked on a location with a viewshed
				if(stationpoints_visible.length > 0) {
					// if a popup already exists, remove the popup to allow the creation of a new one
					if($("#popup_div").length > 0)
						$("#popup_div").remove();
					
					// create new popup div
					var popup_div = document.createElement("div");
					popup_div.id = "popup_div";
					popup_div.className = "zoomable_element"; //to identify as a popup element and as a zoomable element
					popup_div.style.cssText = "position: absolute; left: 20%; right: 20%; bottom: 40px; border-radius: 25px; z-index: 600; background-color: rgba(256,256,256,0.75); text-align: center; color: black;";

					// create exit button for popup div
					var exit_button = document.createElement("img");
					exit_button.src = "./images/Popup-Window-Exit-Button.png";
					exit_button.id = "exit_button";
					exit_button.className = "zoomable_element";
					exit_button.style.cssText = "position: absolute; top: 15px; right: 15px; width: 25px; height: 25px; border-radius:5px; background-color: rgba(150,150,150,0.8); cursor: pointer";
					popup_div.appendChild(exit_button);
			
					// add intro text to popup div
					addIntroTextToLocationModePopup(popup_div,stationpoints_visible);
					
					// add links to popup div
					addLinksToLocationModePopup(popup_div,stationpoints_visible);

					// Use different heights for popup divs depending on how many links
					// will be displayed (stationpoints_visible.length == # of links)
					switch(stationpoints_visible.length) {
						case 1:
							popup_div.style.height = "100px"; break;
						case 2:
							popup_div.style.height = "120px"; break;
						case 3:
							popup_div.style.height = "144px"; break;
						case 4:
							popup_div.style.height = "161px"; break;
						case 5:
							popup_div.style.height = "178px"; break;
						case 6:
							popup_div.style.height = "195px"; break;
						case 7:
							popup_div.style.height = "212px"; break;
						case 8:
							popup_div.style.height = "229px"; break;
						default:
							popup_div.style.height = "229px"; break;
					}
						
					$("#panzoom_parent").append(popup_div);
					
					// Destroy popup when user clicks on it
					$("#exit_button").click(function() {
						destroyLocationModePopup();
					});

				}
			}
		}

		/**
		 * Called by the displayLocationModePopup() function to add the links
		 * of all of the current active station points to the popup.
		 */
		function addLinksToLocationModePopup(popup_div,stationpoints_visible) {
			var stationpoint_link1, stationpoint_link2, stationpoint_link3, stationpoint_link4, stationpoint_link5, stationpoint_link6, stationpoint_link7, stationpoint_link8;
			var stationpoint_links = [stationpoint_link1, stationpoint_link2, stationpoint_link3, stationpoint_link4, stationpoint_link5, stationpoint_link6, stationpoint_link7, stationpoint_link8];
			for(var i = 0; i < stationpoints_visible.length; i++) {
				stationpoint_links[i] = document.createElement("a");
				stationpoint_links[i].className = "zoomable_element"; //to identify as a popup element
				stationpoint_links[i].style.fontSize = "12px";
				stationpoint_links[i].target = "_blank"; // make link open up in new tab
				stationpoint_links[i].href = getLocationModePopupLink(stationpoints_visible[i]);
				stationpoint_links[i].appendChild(document.createTextNode("Go to Station Point " + stationpoints_visible[i] + " Photo Module."));
				stationpoint_links[i].appendChild(document.createElement("br"));
				popup_div.appendChild(stationpoint_links[i]);
			}
		}

		/**
		 * Returns the link corresponding to a station point given its index
		 * number. For example, Station Point 2's index is simply 2. Links are
		 * to the photo modules created as part of the parent project.
		 */
		function getLocationModePopupLink(stationpoint_index) {
			switch(parseInt(stationpoint_index)) {
				case 2:
					return "http://enchantingthedesert.com/2-on-grand-view-point/"; break;
				case 3:
					return "http://enchantingthedesert.com/3-angels-gate-wotans-throne-and-vishnu-temple/"; break;
				case 4:
					return "http://enchantingthedesert.com/4-up-granite-gorge/"; break;
				case 5:
					return "http://enchantingthedesert.com/5-down-granite-gorge-from-grand-view-trail/"; break;	
				case 6:
					return "http://enchantingthedesert.com/6-up-grand-canyon-from-moran-point/"; break;
				case 7:
					return "http://enchantingthedesert.com/7-up-grand-canyon-from-zuni-point/"; break;
				case 8:
					return "http://enchantingthedesert.com/8-up-to-marble-gorge-and-painted-desert-from-lipan-point/"; break;	
				case 9:
					return "http://enchantingthedesert.com/9-up-to-marble-gorge-and-painted-desert-from-desert-view/"; break;	
				case 10:
					return "http://enchantingthedesert.com/10-down-grand-canyon-from-zuni-point/"; break;
				case 11:
					return "http://enchantingthedesert.com/11-across-grand-canyon-near-el-tovar/"; break;	
				case 12:
					return "http://enchantingthedesert.com/12-descending-the-zigzags-bright-angel-trail/"; break;
				case 13:
					return "http://enchantingthedesert.com/13-colorado-river-and-zoroaster-temple-foot-of-bright-angel-trail/"; break;
				case 14:
					return "http://enchantingthedesert.com/14-hopi-indian-buffalo-dance-at-el-tovar/"; break;
				case 15:
					return "http://enchantingthedesert.com/15-hopi-indian-eagle-dance-at-el-tovar/"; break;
				case 16:
					return "http://enchantingthedesert.com/16-hopi-indian-war-dance-at-el-tovar/"; break;
				case 17:
					return "http://enchantingthedesert.com/17-down-grand-canyon-from-hopi-point/"; break;
				case 18:
					return "http://enchantingthedesert.com/18-eastern-outlook-from-havasupai-point/"; break;
				case 19:
					return "http://enchantingthedesert.com/19-across-grand-scenic-divide-from-havasupai-point/"; break;
				case 20:
					return "http://enchantingthedesert.com/20-havasupai-point-from-grand-scenic-divide/"; break;
				case 21:
					return "http://enchantingthedesert.com/21-north-wall-of-canyon-from-grand-scenic-divide/"; break;
				case 22:
					return "http://enchantingthedesert.com/22-up-grand-canyon-from-grand-scenic-divide/"; break;
				case 23:
					return "http://enchantingthedesert.com/23-birds-eye-view-of-grand-canyon-from-an-airplane/"; break;
				case 24:
					return "http://enchantingthedesert.com/24-bright-angel-canyon-from-yavapai-point/"; break;
				case 25:
					return "http://enchantingthedesert.com/25-starting-down-the-kaibab-trail-from-yaki-point/"; break;
				case 26:
					return "http://enchantingthedesert.com/26-the-kaibab-suspension-bridge/"; break;
				case 27:
					return "http://enchantingthedesert.com/27-tunnel-approach-to-bridge/"; break;
				case 28:
					return "http://enchantingthedesert.com/28-a-trail-party-crossing-bridge/"; break;
				case 29:
					return "http://enchantingthedesert.com/29-ribbon-falls-bright-angel-canyon/"; break;
				case 30:
					return "http://enchantingthedesert.com/30-across-to-roaring-springs-from-kaibab-trail/"; break;
				case 31:
					return "http://enchantingthedesert.com/31-on-the-kaibab-trail-above-roaring-springs/"; break;
				case 32:
					return "http://enchantingthedesert.com/32-up-grand-canyon-from-bright-angel-point-2/"; break;
				case 33:
					return "http://enchantingthedesert.com/33-across-oza-butte-to-south-rim/"; break;
				case 34:
					return "http://enchantingthedesert.com/34-a-grove-of-pines-in-the-kaibab-forest/"; break;
				case 35:
					return "http://enchantingthedesert.com/35-across-canyon-to-havasupai-point-from-pt-sublime/"; break;
				case 37:
					return "http://enchantingthedesert.com/37-up-canyon-to-shiva-temple-from-pt-sublime/"; break;
				case 38:
					return "http://enchantingthedesert.com/38-down-canyon-to-shiva-temple-from-cape-royal/"; break;
				case 39:
					return "http://enchantingthedesert.com/39-angels-window-on-cape-royal/"; break;
				case 40:
					return "http://enchantingthedesert.com/40-across-marble-gorge-to-painted-desert-at-pt-imperial/"; break;
				case 41:
					return "http://enchantingthedesert.com/41-toward-little-colorado-river-from-point-imperial/"; break;
				case 42:
					return "http://enchantingthedesert.com/42-a-storm-in-the-grand-canyon/"; break;
				case 43:
					return "http://enchantingthedesert.com/43-after-the-storm/"; break;		
				default:
					return "http://enchantingthedesert.com/2-on-grand-view-point/"; break;
			}
		}

		/**
		 * Called by the displayLocationModePopup() function. Adds text content to the
		 * popup based on the number of station points active (visible).
		 */
		function addIntroTextToLocationModePopup(popup_div,stationpoints_visible) {
			// variable to store the sentence in the popup that describes which station points
			// the user-clicked location are visible from
			var intro = document.createElement("p"), intro_text = "";
			intro.className = "zoomable_element"; //to identify as a popup element
			// add the names of the station points to intro_text of the station points
			// the user-clicked location are visible from
			if(stationpoints_visible.length != 0) { //if user has clicked on a viewshed
				if(stationpoints_visible.length == 1) {
					// if there is only one station point to be included in the sentence
					intro_text += "The location you clicked is visible from station point " + stationpoints_visible[0];
				} else {
					// if there is more than one station point to be included in the sentence
					intro_text = "The location you clicked is visible from station points ";
					for(var i = 0; i < stationpoints_visible.length; i++) {
						if(i == stationpoints_visible.length - 1) {
							// if this is the last station point to be added to the sentence
							intro_text += " and " + stationpoints_visible[i];
						} else {
							if(stationpoints_visible.length == 2 && i == 0) {
								// if there is only two station points, don't add the comma before
								// the "and" word
								intro_text += stationpoints_visible[i];
							} else {
								intro_text += stationpoints_visible[i] + ", ";
							}
						}
					}
				}
				intro_text += ".";
				intro_text = document.createTextNode(intro_text);
				intro.appendChild(intro_text);
				intro.style.cssText = "font-size: 14px; font-weight: 400; margin-top: 18px; margin-left: 50px; margin-right: 50px; text-align: center;";
				popup_div.appendChild(intro);
			}
		}

		/**
		 * Function destroys active popup with id "popup_div" by first executing a fadeout,
		 * then removing the popup_div element
		 */
		function destroyLocationModePopup() {
			$("#popup_div").fadeOut(500);
			popup_fade_out_in_progress = true;
			setTimeout(function(){
				$("#popup_div").remove();
				popup_fade_out_in_progress = false;
			},500);
		}

		/**
		 * Allows ExploreByStationPointMode to set private variable's status (i.e. when
		 * station point mode is activated and is_explore_by_location_mode_active
		 * has to be set to false).
		 */
		function setExploreByLocationModeStatus(status) {
			is_explore_by_location_mode_active = status;
		}

		/**
		 * Allows ExploreByStationPointMode to get private variable's status (i.e. when
		 * determining whether to respond station point mode events).
		 */
		function getExploreByLocationModeStatus() {
			return is_explore_by_location_mode_active;
		}

		/**
		 * Displays hint for the location mode button.
		 */
		function displayHint() {
			$("#location_mode_button_hint_container").css({left: "0", right: "0"});
			$("#Mode_Button_All_Hover").css({display: "block"});
		}

		/**
		 * Hides hint for the location mode button.
		 */
		function hideHint() {
			$("#location_mode_button_hint_container").css({left: "-99999px", right: "auto"});
			$("#Mode_Button_All_Hover").css({display: "none"});
		}

		var public_objects =
		{
			activateMode : activateMode,
			checkLocationModeMouseoverEvents : checkLocationModeMouseoverEvents,
			displayLocationModePopup : displayLocationModePopup,
			destroyLocationModePopup : destroyLocationModePopup,
			setExploreByLocationModeStatus : setExploreByLocationModeStatus,
			getExploreByLocationModeStatus : getExploreByLocationModeStatus,
			displayHint : displayHint,
			hideHint : hideHint
		};

		return public_objects;
	}();

	/*
	--------------- Functions to toggle landmarks on and off ---------------
	*/

	var LandmarksToggle = function()
	{
		var is_landmarks_layer_displayed = false;

		/**
		 * This function is called when the user clicks on the "checkbox" for "Landmarks".
		 * As this "checkbox" is not actually a checkbox object, the internals of determining
		 * what events to trigger following the clicking of the "checkbox" is determined in this
		 * function.
		 */
		function triggerLandmarksToggleEvent() {
			if(!is_landmarks_layer_displayed) {
				activateLandmarksToggle();
			} else {
				deactivateLandmarksToggle();
			}
		}

		/**
		 * This function displays the landmarks and sets the corresponding global variable 
		 * (is_landmarks_layer_displayed) to reflect that its status is "active".
		 */
		function activateLandmarksToggle() {
			is_landmarks_layer_displayed = true;
			$("#landmarks_checkbox_unchecked").css({opacity:0});
			displayLandmarksLayer();
			setAllStationPointIconsOpacity(0.2);
		}

		/**
		 * This function hides the landmarks and sets the corresponding global variable 
		 * (is_landmarks_layer_displayed) to reflect that its status is "inactive".
		 */
		function deactivateLandmarksToggle() {
			is_landmarks_layer_displayed = false;
			$("#landmarks_checkbox_unchecked").css({opacity:1});
			hideLandmarksLayer();
			if(ExploreByLocationMode.getExploreByLocationModeStatus()) {
				setAllStationPointIconsOpacity(0.6);
			} else {
				setAllStationPointIconsOpacity(1);
			}
		}

		/**
		 * Called when user checks Landmarks checkbox.
		 */
		function displayLandmarksLayer() {
			$("#LandmarksLayer").css({left:"0", right:"auto"});
		}

		/**
		 * Called when user unchecks Landmarks checkbox.
		 */
		function hideLandmarksLayer() {
			$("#LandmarksLayer").css({left:"-99999px", right:"auto"});
		}

		/**
		 * Displays Landmarks Layer hint when user hovers cursor over Landmarks 
		 * checkbox.
		 */
		function displayHint() {
			$("#landmarks_toggle_checkbox_hint_container").css({left: "0", right: "0"});
			if(!is_landmarks_layer_displayed) {
				$("#landmarks_checkbox_unchecked").css({opacity:0.6});
			}
		}

		/**
		 * Hides Landmarks Layer hint when user moves cursor away from Landmarks 
		 * checkbox.
		 */
		function hideHint() {
			$("#landmarks_toggle_checkbox_hint_container").css({left: "-99999px", right: "auto"});
			if(!is_landmarks_layer_displayed) {
				$("#landmarks_checkbox_unchecked").css({opacity:1});
			}
		}

		/**
		 * Returns true if the Landmarks Layer is currently being displayed, and 
		 * false otherwise.
		 */
		function areLandmarksDisplayed() {
			return is_landmarks_layer_displayed;
		}

		var public_objects =
		{
			triggerLandmarksToggleEvent : triggerLandmarksToggleEvent,
			hideLandmarksLayer : hideLandmarksLayer,
			displayHint : displayHint,
			hideHint : hideHint,
			areLandmarksDisplayed : areLandmarksDisplayed
		};

		return public_objects;
	}();


	var ViewshedAnglesToggle = function()
	{
		var is_viewshed_angles_layer_displayed = false;

		/**
		 * This function is called when the user clicks on the "checkbox" for "View Angles".
		 * As this "checkbox" is not actually a checkbox object, the internals of determining
		 * what events to trigger following the clicking of the "checkbox" is determined in this
		 * function.
		 */
		function triggerViewshedAnglesToggleEvent() {
			if(!is_viewshed_angles_layer_displayed) {
				activateViewshedAnglesToggle();
			} else {
				deactivateViewshedAnglesToggle();
			}
		}

		/**
		 * This function displays the view angles and sets the corresponding global variable 
		 * (is_viewshed_angles_layer_displayed) to reflect that its status is "active".
		 */
		function activateViewshedAnglesToggle() {
			is_viewshed_angles_layer_displayed = true;
			displayViewshedAnglesLayer();
			document.getElementById("viewshedangles_checkbox_unchecked").style.opacity = 0;
		}

		/**
		 * This function hides the view angles and sets the corresponding global variable 
		 * (is_viewshed_angles_layer_displayed) to reflect that its status is "inactive".
		 */
		function deactivateViewshedAnglesToggle() {
			is_viewshed_angles_layer_displayed = false;
			hideViewshedAnglesLayer();
			document.getElementById("viewshedangles_checkbox_unchecked").style.opacity = 1;
		}

		/**
		 * Called when user checks Viewshed Angles checkbox.
		 */
		function displayViewshedAnglesLayer() {
			$("#ViewshedAnglesLayer").css({left: "0", right: "auto"});
		}

		/**
		 * Called when user unchecks Viewshed Angles checkbox.
		 */
		function hideViewshedAnglesLayer() {
			$("#ViewshedAnglesLayer").css({left: "-99999px", right: "auto"});
		}

		/**
		 * Displays Viewshed Angles Layer hint when user hovers cursor over Viewshed 
		 * Angles checkbox.
		 */
		function displayHint() {
			$("#viewshedangles_toggle_checkbox_hint_container").css({left: "0", right: "0"});
			if(!is_viewshed_angles_layer_displayed) {
				$("#viewshedangles_checkbox_unchecked").css({opacity: 0.6});
			}
		}

		/**
		 * Hides Viewshed Angles Layer hint when user moves cursor away from Viewshed 
		 * Angles checkbox.
		 */
		function hideHint() {
			$("#viewshedangles_toggle_checkbox_hint_container").css({left: "-99999px", right: "auto"});
			if(!is_viewshed_angles_layer_displayed) {
				$("#viewshedangles_checkbox_unchecked").css({opacity: 1});
			}
		}

		var public_objects =
		{
			triggerViewshedAnglesToggleEvent : triggerViewshedAnglesToggleEvent,
			hideViewshedAnglesLayer : hideViewshedAnglesLayer,
			displayHint : displayHint,
			hideHint : hideHint
		};

		return public_objects;
	}();

	/**
	 * Displays loading screen.
	 */
	function displayLoadingScreen() {
		$("#loading_screen").css({display:"block"});
	}

	/**
	 * Hides loading screen.
	 */
	function hideLoadingScreen() {
		$("#loading_screen").css({display:"none"});
	}

	/**
	 * Called when changing the active mode (Station Point Mode or
	 * Location Mode), when displaying/hiding a toggled layer
	 * (Landmarks Layer or Viewshed Angles Layer) or when
	 * a Station Point Mode mouseover event is fired (all station 
	 * points apart from the active station point are temporarily
	 * switched to a lower opacity).
	 */
	function setAllStationPointIconsOpacity(opacity) {
		$(".StationPointIcon").css({opacity: opacity, zIndex: "3"});
	}

	function checkWindowSize() {
		var height = window.innerHeight,
			width = window.innerWidth,
			MIN_WINDOW_HEIGHT = 574,
			MIN_WINDOW_WIDTH = 750;

		if(height < MIN_WINDOW_HEIGHT || width < MIN_WINDOW_WIDTH) {
			// display warning popup indicating that the map is not 
			// displayed in its entirety
			if(height < MIN_WINDOW_HEIGHT && width < MIN_WINDOW_WIDTH) {
				document.getElementById("window_size_warning_popup").innerHTML = "Please expand your window to view this map in its entirety.";
			} else if (height < MIN_WINDOW_HEIGHT) {
				document.getElementById("window_size_warning_popup").innerHTML = "Please expand your window vertically to view this map in its entirety.";
			} else if (width < MIN_WINDOW_WIDTH) {
				document.getElementById("window_size_warning_popup").innerHTML = "Please expand your window horizontally to view this map in its entirety.";
			}
			document.getElementById("window_size_warning_popup").style.display = "block";
		} else {
			// if map is displayed in its entirety, hide warning popup
			document.getElementById("window_size_warning_popup").style.display = "none";
		}
	}

	/**
	 * Returns true if the screen size of the user's device is larger
	 * than a set threshold; false otherwise.
	 */
	function isNotAMobileDevice() {
		return (screen.width > MIN_SCREEN_WIDTH && screen.height > MIN_SCREEN_HEIGHT);
	}
	
	var public_objects =
	{
		init : init
	};

	return public_objects;
}();

$(document).ready(function() {
	VernonChuo.GrandCanyonInteractiveMap.init.execute();
});