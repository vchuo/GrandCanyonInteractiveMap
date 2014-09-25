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
		MAP_HEIGHT = 2066;

	var init = function()
	{
		function execute() {
			hideMapElementWhileLoading();
			// resizes loading screen to fit window size
			setLoadingScreenDimensions();
			displayLoadingScreen();

			GrandCanyonInteractiveMapSVGCode.appendHTMLForStationPointAndViewshedSVGs();
			
			// resizes all content divs to fit window size
			setContentDimensions();
			
			hideAllViewshedPNGs();
			hideAllRolloverIcons();
			LandmarksToggle.hideLandmarksLayer();
			ViewshedAnglesToggle.hideViewshedAnglesLayer();

			ZoomControl.setupPanZoomElement();
			ExploreByStationPointMode.activateMode();
			displayMapElementAfterLoadingIsComplete();
			EventHandlers.attachAllEventHandlers();
		}

		function hideMapElementWhileLoading() {
			$('#map_content_wrapper').css({left: "-99999px"});
		}
		
		function displayMapElementAfterLoadingIsComplete() {
			$('#map_content_wrapper').css({left: "0px"});
		}
		
		function hideAllViewshedPNGs() {
			$(".ViewshedPNG").css({display: "none"});
		}

		function hideAllRolloverIcons()
		{
			hideAllModeButtonRolloverIcons();
			hideAllZoomButtonRolloverIcons();
			hideAllStationPointRolloverIcons();
		}

		function hideAllModeButtonRolloverIcons()
		{
			$('#Mode_Button_One_On').css({display: "none"});
			$('#Mode_Button_One_Hover').css({display: "none"});
			$('#Mode_Button_All_On').css({display: "none"});
			$('#Mode_Button_All_Hover').css({display: "none"});
		}

		function hideAllZoomButtonRolloverIcons()
		{
			$('#Zoom_In_Hover').css({display: "none"});
			$('#Zoom_In_In_Use').css({display: "none"});
			$('#Zoom_In_Max_Zoom').css({display: "none"});
			$('#Zoom_Out_Hover').css({display: "none"});
			$('#Zoom_Out_In_Use').css({display: "none"});
			$('#Zoom_Out_Max_Zoom').css({display: "none"});
		}

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
		function attachAllEventHandlers() {
			// Note: the event handler for mousewheel events is attached in the
			// setupPanZoomElement function instead of here
			attachEventHandlersForModeButtons();
			attachEventHandlersForZoomButtons();
			attachEventHandlersForCheckboxes();
			attachEventHandlersForStationPointSVGs();
			attachEventHandlerForStationPointPopupDiv();
			attachEventHandlersForViewshedSVGs();
			attachEventHandlerForWelcomeMessagePopupItems();
			attachEventHandlerForWindowObject();
			attachEventHandlerForDocumentObject();
		}
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
		function attachEventHandlerForStationPointPopupDiv() {
			$("#StationPointPopupDiv").click(function(event) {
				ExploreByStationPointMode.hideStationPointPopup(event)
			});
		}
		function attachEventHandlersForViewshedSVGs() {
			$.each($(".ViewshedSVG"), function(index, value) {
				$("#"+value.id).click(function() {
					ExploreByLocationMode.displayLocationModePopup();
				});
			});
		}
		function attachEventHandlerForWelcomeMessagePopupItems() {
			$("#welcome_message_popup").click(function() {
				$("#welcome_message_popup_container").css({left: "-99999px", right: "auto",
															backgroundColor: "transparent"});
				$(".welcome_message_popup_hint").remove();
				$("#welcome_message_popup_button").css({display: "block"});
				$("#welcome_message_popup_button").animate({opacity: 1}, 1500);
				$("#welcome_message_popup_content").css({marginTop: "35px", marginBottom: "40px"});
			});
			$("#welcome_message_popup_button").bind({
				mouseover: function() {
					$("#welcome_message_popup_container").css({left: "0px", right: "auto"});
				},
				mouseout: function() {
					$("#welcome_message_popup_container").css({left: "-99999px", right: "auto"});
				}
			});
		}
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
		function attachEventHandlerForDocumentObject() {
			$(document).mousemove(function(event) {
				trackMouseCoordsAndCheckForExploreByLocationModeEvents(event);
			});
		}

		function resizePageContents() {
			displayLoadingScreen();

			var panzoom = $("#focal").find(".panzoom").panzoom();
			// resets panzoom element back to default settings because window resize may
			// temporarily violate containment of the panzoom element
			panzoom.panzoom("reset");
			setContentDimensions();
			// window is resized so to maintain containment of the map within the
			// map viewport, dimensions of the panzoom element must be recalculated
			panzoom.panzoom("resetDimensions");
			ZoomControl.resetZoomLevelToDefault();

			setTimeout(function(){
				hideLoadingScreen();
			},2000);
		}

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
			
			received_stop_zoom_signal = false,
			
			MIN_ZOOM_LEVEL = 1,
			
			MAX_ZOOM_LEVEL = 4,

			ZOOM_INCREMENT_MOUSEWHEEL = 0.01,

			ZOOM_INCREMENT_BUTTON = 0.2;

		/*
		 * Function: zoomButtonClicked
		 * --------------
		 * Called when user clicks on either of the zoom buttons (zoom in, zoom out).
		 * This function then determines which of the zoom buttons was clicked through
		 * 'which_button', which  is either 'zoom_in' or 'zoom_out'.
		 */
		function zoomButtonClicked(which_button) {
			switch(which_button) {
				case 'zoom_in':
					zoomInByClick(); break;
				case 'zoom_out':
					zoomOutByClick(); break;
				default: break;
			}
		}
		/*
		 * Function: zoomButtonReleased
		 * --------------
		 * Called when user releases a mouse button on either of the zoom buttons (zoom in,
		 * zoom out). This function then determines which of the zoom buttons was the cursor
		 * was on when the mouse button was released through 'which_button', which  is either
		 * 'zoom_in' or 'zoom_out'.
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
		/*
		 * Function: zoomInByClick
		 * --------------
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
				$('#Zoom_In_In_Use').css({display: "block"});
				zoomInByClick(); // recursive call
			}
		}
		/*
		 * Function: zoomOutByClick
		 * --------------
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
				$('#Zoom_Out_In_Use').css({display: "block"});
				zoomOutByClick(); // recursive call
			}
		}
		function stopZoomAndResetZoomVariables(stopped_zoom_process) {
			received_stop_zoom_signal = false;
			switch(stopped_zoom_process) {
				case "zoom_in":
					zooming_in = false;
					$('#Zoom_In_In_Use').css({display: "none"});
					break;
				case "zoom_out":
					zooming_out = false;
					$('#Zoom_Out_In_Use').css({display: "none"});
					break;
			}
		}
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
			panzoom.panzoom('zoom', current_zoom_level, { silent: true, transition: false });
		}

		function highlightZoomInButton() {
			$('#Zoom_In_Hover').css({display: "block"});
		}

		function unhighlightZoomInButton() {
			$('#Zoom_In_Hover').css({display: "none"});
		}

		function highlightZoomOutButton() {
			$('#Zoom_Out_Hover').css({display: "block"});
		}

		function unhighlightZoomOutButton() {
			$('#Zoom_Out_Hover').css({display: "none"});
		}
		
		function displayCorrespondingZoomIconIfAtMaxOrMinZoomLevel() {
			// if at min zoom level, display min zoom level icon
			if(current_zoom_level == MIN_ZOOM_LEVEL) {
				$('#Zoom_Out_Max_Zoom').css({display: "block"});
			} else if (document.getElementById('Zoom_Out_Max_Zoom').style.display != "none") {
				$('#Zoom_Out_Max_Zoom').css({display: "none"});
			}
			// if at max zoom level, display max zoom level icon
			if(current_zoom_level == MAX_ZOOM_LEVEL) {
				$('#Zoom_In_Max_Zoom').css({display: "block"});
			} else if (document.getElementById('Zoom_In_Max_Zoom').style.display != "none") {
				$('#Zoom_In_Max_Zoom').css({display: "none"});
			}
		}

		/*
		 * Function: setupPanZoomElement
		 * --------------
		 * Implements zoom and pan functionality using the PanZoom library.
		 */
		function setupPanZoomElement()
		{
			var panzoom = $("#focal").find(".panzoom").panzoom();
			attachMouseWheelEventHandler(panzoom);
			// set initial zoom level
			panzoom.panzoom("zoom", MIN_ZOOM_LEVEL, { silent: false });
			resetZoomLevelToDefault();

		}

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

		function isMouseWheelEventInvalid(event) {
			// mouse wheel event is "invalid" if user tries to zoom out past the
			// minimum zoom level, or if the user tries to zoom in past the maximum
			// zoom level
			var isUserTryingToZoomOutPastMinZoomLevel = (current_zoom_level == MIN_ZOOM_LEVEL) && (event.originalEvent.deltaY > 0),
				isUserTryingToZoomInPastMaxZoomLevel = (current_zoom_level == MAX_ZOOM_LEVEL) && (event.originalEvent.deltaY < 0);
			return (isUserTryingToZoomOutPastMinZoomLevel || isUserTryingToZoomInPastMaxZoomLevel);
		}

		function handleMouseWheelZoomEventLoadingScreenDisplayTiming() {
			clearTimeout($.data(this, "timer"));
			displayLoadingScreenForZoomEvent();
			$.data(this, "timer", setTimeout(function() {
				hideLoadingScreenForZoomEvent();
			}, 250));
		}

		function resetZoomLevelToDefault() {
			// reset map zoom level to minimum zoom level upon window resize
			current_zoom_level = MIN_ZOOM_LEVEL;
			zooming_in = false;
			zooming_out = false;
			$('#Zoom_In_Max_Zoom').css({display: "none"});
			$('#Zoom_Out_Max_Zoom').css({display: "block"});
		}

		function displayLoadingScreenForZoomEvent() {
			$("#panzoom").css({left: "-99999px"});
			$("#loading_screen").css({display:"block", zIndex:"1"});
		}

		function hideLoadingScreenForZoomEvent() {
			$("#panzoom").css({left: "0px"});
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
		// variable to store the current active station point; if no station point is
		// currently active, variable stores 'none'; a station point is deemed active if
		// the cursor is hovering it and its corresponding viewshed is displayed
		var is_explore_by_station_point_mode_active = false,
			current_active_station_point = "none";

		/*
		 * Function: activateMode
		 * --------------
		 * Called when user clicks on the station point mode button.
		 */
		function activateMode()
		{
			// only activate station point mode if it is not already active
			if(!is_explore_by_station_point_mode_active) {
				is_explore_by_station_point_mode_active = true;
				ExploreByLocationMode.setExploreByLocationModeStatus(false);
				setAllStationPointIconsOpacity(1);
				setContentDimensions();
				// Pulls up relevant png
				$('#Mode_Button_One_On').css({display: "block"});
				$('#Mode_Button_All_On').css({display: "none"});
				// Place StationPointSVGLayer at top layer so that mouseevents over station points are active
				$('#StationPointSVGLayer').css({zIndex: 501});
				
				$('#StationPointMode_InfoBox').css({zIndex:1000});
				$('#LocationMode_InfoBox').css({left:"auto",right:"-99999px",zIndex:-1});
				
				// If a location popup is currently active, hide it
				if($('#popup_div').length > 0)
					ExploreByLocationMode.destroyLocationModePopup();
			}
		}
		
		function activateStationPointMouseoverEvents(curr_elem_id) {
			if(is_explore_by_station_point_mode_active) {
				var current_station_point_number = curr_elem_id.substring("StationPoint".length).toString();
				$("#Viewshed"+current_station_point_number+"PNG").css({display:"block"});
				$("#StationPoint"+current_station_point_number+"RolloverIcon").css({display:"block"});
				
				$('#StationPointMode_InfoBoxImage').css({border:"6px solid white"});
				$('#StationPointMode_StationPointLabel').css({backgroundColor:"rgba(256,256,256,0.8)"});

				current_active_station_point = curr_elem_id;
				setAllStationPointIconsOpacity(0.2);
				activateCorrespondingStationPointEvents();
			}
		}	

		function deactivateStationPointMouseoverEvents() {
		if(is_explore_by_station_point_mode_active) {
			var current_station_point_number = current_active_station_point.substring("StationPoint".length).toString();
			$("#StationPoint"+current_station_point_number+"RolloverIcon").css({display:"none"});
			
			// hide photo associated with station point
			$('#StationPointMode_InfoBox').css({left:"auto",right:"-999999px"});
			$('#StationPointMode_InfoBoxImage').attr("src","");
			$('#StationPointMode_InfoBoxImage').css({border:"0px"});
			$('#StationPointMode_StationPointLabel').html("");
			$('#StationPointMode_StationPointLabel').css({backgroundColor:"transparent"})
			
			if(LandmarksToggle.areLandmarksDisplayed()) {
				setAllStationPointIconsOpacity(0.5);
			} else {
				setAllStationPointIconsOpacity(1);
			}
			deactivateCorrespondingStationPointEvents();
			current_active_station_point = 'none';
		}
	}

		function activateCorrespondingStationPointEvents() {
			switch(current_active_station_point) {
				case 'StationPoint2':
					StationPointMouseoverEvents.activateStationPoint2Events(); break;
				case 'StationPoint3':
					StationPointMouseoverEvents.activateStationPoint3Events(); break;
				case 'StationPoint4':
					StationPointMouseoverEvents.activateStationPoint4Events(); break;
				case 'StationPoint5':
					StationPointMouseoverEvents.activateStationPoint5Events(); break;
				case 'StationPoint6':
					StationPointMouseoverEvents.activateStationPoint6Events(); break;
				case 'StationPoint7':
					StationPointMouseoverEvents.activateStationPoint7Events(); break;
				case 'StationPoint8':
					StationPointMouseoverEvents.activateStationPoint8Events(); break;
				case 'StationPoint9':
					StationPointMouseoverEvents.activateStationPoint9Events(); break;
				case 'StationPoint10':
					StationPointMouseoverEvents.activateStationPoint10Events(); break;
				case 'StationPoint11':
					StationPointMouseoverEvents.activateStationPoint11Events(); break;
				case 'StationPoint12':
					StationPointMouseoverEvents.activateStationPoint12Events(); break;
				case 'StationPoint13':
					StationPointMouseoverEvents.activateStationPoint13Events(); break;
				case 'StationPoint14':
					StationPointMouseoverEvents.activateStationPoint14Events(); break;
				case 'StationPoint15':
					StationPointMouseoverEvents.activateStationPoint15Events(); break;
				case 'StationPoint16':
					StationPointMouseoverEvents.activateStationPoint16Events(); break;
				case 'StationPoint17':
					StationPointMouseoverEvents.activateStationPoint17Events(); break;
				case 'StationPoint18':
					StationPointMouseoverEvents.activateStationPoint18Events(); break;
				case 'StationPoint19':
					StationPointMouseoverEvents.activateStationPoint19Events(); break;
				case 'StationPoint20':
					StationPointMouseoverEvents.activateStationPoint20Events(); break;
				case 'StationPoint21':
					StationPointMouseoverEvents.activateStationPoint21Events(); break;
				case 'StationPoint22':
					StationPointMouseoverEvents.activateStationPoint22Events(); break;
				case 'StationPoint23':
					StationPointMouseoverEvents.activateStationPoint23Events(); break;
				case 'StationPoint24':
					StationPointMouseoverEvents.activateStationPoint24Events(); break;
				case 'StationPoint25':
					StationPointMouseoverEvents.activateStationPoint25Events(); break;
				case 'StationPoint26':
					StationPointMouseoverEvents.activateStationPoint26Events(); break;
				case 'StationPoint27':
					StationPointMouseoverEvents.activateStationPoint27Events(); break;
				case 'StationPoint28':
					StationPointMouseoverEvents.activateStationPoint28Events(); break;
				case 'StationPoint29':
					StationPointMouseoverEvents.activateStationPoint29Events(); break;
				case 'StationPoint30':
					StationPointMouseoverEvents.activateStationPoint30Events(); break;
				case 'StationPoint31':
					StationPointMouseoverEvents.activateStationPoint31Events(); break;
				case 'StationPoint32':
					StationPointMouseoverEvents.activateStationPoint32Events(); break;
				case 'StationPoint33':
					StationPointMouseoverEvents.activateStationPoint33Events(); break;
				case 'StationPoint34':
					StationPointMouseoverEvents.activateStationPoint34Events(); break;
				case 'StationPoint35':
					StationPointMouseoverEvents.activateStationPoint35Events(); break;
				case 'StationPoint37':
					StationPointMouseoverEvents.activateStationPoint37Events(); break;
				case 'StationPoint38':
					StationPointMouseoverEvents.activateStationPoint38Events(); break;
				case 'StationPoint39':
					StationPointMouseoverEvents.activateStationPoint39Events(); break;
				case 'StationPoint40':
					StationPointMouseoverEvents.activateStationPoint40Events(); break;
				case 'StationPoint41':
					StationPointMouseoverEvents.activateStationPoint41Events(); break;
				case 'StationPoint42':
					StationPointMouseoverEvents.activateStationPoint42Events(); break;
				case 'StationPoint43':
					StationPointMouseoverEvents.activateStationPoint43Events(); break;
				default:
					break;
			}
		}

		function deactivateCorrespondingStationPointEvents() {
			switch(current_active_station_point) {
				case 'StationPoint2':
					StationPointMouseoverEvents.deactivateStationPoint2Events(); break;
				case 'StationPoint3':
					StationPointMouseoverEvents.deactivateStationPoint3Events(); break;
				case 'StationPoint4':
					StationPointMouseoverEvents.deactivateStationPoint4Events(); break;
				case 'StationPoint5':
					StationPointMouseoverEvents.deactivateStationPoint5Events(); break;
				case 'StationPoint6':
					StationPointMouseoverEvents.deactivateStationPoint6Events(); break;
				case 'StationPoint7':
					StationPointMouseoverEvents.deactivateStationPoint7Events(); break;
				case 'StationPoint8':
					StationPointMouseoverEvents.deactivateStationPoint8Events(); break;
				case 'StationPoint9':
					StationPointMouseoverEvents.deactivateStationPoint9Events(); break;
				case 'StationPoint10':
					StationPointMouseoverEvents.deactivateStationPoint10Events(); break;
				case 'StationPoint11':
					StationPointMouseoverEvents.deactivateStationPoint11Events(); break;
				case 'StationPoint12':
					StationPointMouseoverEvents.deactivateStationPoint12Events(); break;
				case 'StationPoint13':
					StationPointMouseoverEvents.deactivateStationPoint13Events(); break;
				case 'StationPoint14':
					StationPointMouseoverEvents.deactivateStationPoint14Events(); break;
				case 'StationPoint15':
					StationPointMouseoverEvents.deactivateStationPoint15Events(); break;
				case 'StationPoint16':
					StationPointMouseoverEvents.deactivateStationPoint16Events(); break;
				case 'StationPoint17':
					StationPointMouseoverEvents.deactivateStationPoint17Events(); break;
				case 'StationPoint18':
					StationPointMouseoverEvents.deactivateStationPoint18Events(); break;
				case 'StationPoint19':
					StationPointMouseoverEvents.deactivateStationPoint19Events(); break;
				case 'StationPoint20':
					StationPointMouseoverEvents.deactivateStationPoint20Events(); break;
				case 'StationPoint21':
					StationPointMouseoverEvents.deactivateStationPoint21Events(); break;
				case 'StationPoint22':
					StationPointMouseoverEvents.deactivateStationPoint22Events(); break;
				case 'StationPoint23':
					StationPointMouseoverEvents.deactivateStationPoint23Events(); break;
				case 'StationPoint24':
					StationPointMouseoverEvents.deactivateStationPoint24Events(); break;
				case 'StationPoint25':
					StationPointMouseoverEvents.deactivateStationPoint25Events(); break;
				case 'StationPoint26':
					StationPointMouseoverEvents.deactivateStationPoint26Events(); break;
				case 'StationPoint27':
					StationPointMouseoverEvents.deactivateStationPoint27Events(); break;
				case 'StationPoint28':
					StationPointMouseoverEvents.deactivateStationPoint28Events(); break;
				case 'StationPoint29':
					StationPointMouseoverEvents.deactivateStationPoint29Events(); break;
				case 'StationPoint30':
					StationPointMouseoverEvents.deactivateStationPoint30Events(); break;
				case 'StationPoint31':
					StationPointMouseoverEvents.deactivateStationPoint31Events(); break;
				case 'StationPoint32':
					StationPointMouseoverEvents.deactivateStationPoint32Events(); break;
				case 'StationPoint33':
					StationPointMouseoverEvents.deactivateStationPoint33Events(); break;
				case 'StationPoint34':
					StationPointMouseoverEvents.deactivateStationPoint34Events(); break;
				case 'StationPoint35':
					StationPointMouseoverEvents.deactivateStationPoint35Events(); break;
				case 'StationPoint37':
					StationPointMouseoverEvents.deactivateStationPoint37Events(); break;
				case 'StationPoint38':
					StationPointMouseoverEvents.deactivateStationPoint38Events(); break;
				case 'StationPoint39':
					StationPointMouseoverEvents.deactivateStationPoint39Events(); break;
				case 'StationPoint40':
					StationPointMouseoverEvents.deactivateStationPoint40Events(); break;
				case 'StationPoint41':
					StationPointMouseoverEvents.deactivateStationPoint41Events(); break;
				case 'StationPoint42':
					StationPointMouseoverEvents.deactivateStationPoint42Events(); break;
				case 'StationPoint43':
					StationPointMouseoverEvents.deactivateStationPoint43Events(); break;
				default:
					break;
			}
		}

		var StationPointMouseoverEvents =
		{
			activateStationPoint2Events : function() {
				// position station point mode info box in map frame
				$('#StationPointMode_InfoBox').css({left:"auto",right:"60px"});
				// display photo associated with station point
				$('#StationPointMode_InfoBoxImage').attr("src","images/StationPointPhotos/2-Station-Point-Photo.jpg");
				$('#StationPointMode_InfoBoxImage').css({width:"100%",height:"auto",float:"right"});
				// display station point label
				$('#StationPointMode_StationPointLabel').html("<span class='StationPointMode_StationPointLabelTitle'>Station Point 2</span> <br> On Grand View Point");
				$('#StationPointMode_StationPointLabel').css({float: "right", height: "50px"});
			},
			deactivateStationPoint2Events : function() {
				$('#Viewshed2PNG').css({display:"none"});
			},
			activateStationPoint3Events : function() {
				// position station point mode info box in map frame
				$('#StationPointMode_InfoBox').css({left:"auto",right:"60px"});
				// display photo associated with station point
				$('#StationPointMode_InfoBoxImage').attr("src","images/StationPointPhotos/3-Station-Point-Photo.jpg");
				$('#StationPointMode_InfoBoxImage').css({width:"100%",height:"auto",float:"right"});
				// display station point label
				$('#StationPointMode_StationPointLabel').html("<span class='StationPointMode_StationPointLabelTitle'>Station Point 3</span> <br> Angel's Gate, Wotan's Throne <br> and Vishnu Temple");
				$('#StationPointMode_StationPointLabel').css({float: "right", height:"65px"});
			},
			deactivateStationPoint3Events : function() {
				$('#Viewshed3PNG').css({display:"none"});
			},
			activateStationPoint4Events : function() {
				// position station point mode info box in map frame
				$('#StationPointMode_InfoBox').css({left:"auto",right:"60px"});
				// display photo associated with station point
				$('#StationPointMode_InfoBoxImage').attr("src","images/StationPointPhotos/4-Station-Point-Photo.jpg");
				$('#StationPointMode_InfoBoxImage').css({width:"100%",height:"auto",float:"right"});
				// display station point label
				$('#StationPointMode_StationPointLabel').html("<span class='StationPointMode_StationPointLabelTitle'>Station Point 4</span> <br> Up Granite Gorge, from Grand View Trail");
				$('#StationPointMode_StationPointLabel').css({float: "right", height:"50px"});
			},
			deactivateStationPoint4Events : function() {
				$('#Viewshed4PNG').css({display:"none"});
			},
			activateStationPoint5Events : function() {
				// position station point mode info box in map frame
				$('#StationPointMode_InfoBox').css({left:"auto",right:"60px"});
				// display photo associated with station point
				$('#StationPointMode_InfoBoxImage').attr("src","images/StationPointPhotos/5-Station-Point-Photo.jpg");
				$('#StationPointMode_InfoBoxImage').css({width:"100%",height:"auto",float:"right"});
				// display station point label
				$('#StationPointMode_StationPointLabel').html("<span class='StationPointMode_StationPointLabelTitle'>Station Point 5</span> <br> Down Granite Gorge, from Grand View Trail");
				$('#StationPointMode_StationPointLabel').css({float: "right", height:"50px"});
			},
			deactivateStationPoint5Events : function() {
				$('#Viewshed5PNG').css({display:"none"});
			},
			activateStationPoint6Events : function() {
				// position station point mode info box in map frame
				$('#StationPointMode_InfoBox').css({left:"auto",left:"10px"});
				// display photo associated with station point
				$('#StationPointMode_InfoBoxImage').attr("src","images/StationPointPhotos/6-Station-Point-Photo.jpg");
				$('#StationPointMode_InfoBoxImage').css({width:"100%",height:"auto",float:"left"});
				// display station point label
				$('#StationPointMode_StationPointLabel').html("<span class='StationPointMode_StationPointLabelTitle'>Station Point 6</span> <br> Up Grand Canyon, from Moran Point");
				$('#StationPointMode_StationPointLabel').css({float: "left", height:"50px"});
			},
			deactivateStationPoint6Events : function() {
				$('#Viewshed6PNG').css({display:"none"});
			},
			activateStationPoint7Events : function() {
				// position station point mode info box in map frame
				$('#StationPointMode_InfoBox').css({left:"auto",left:"10px"});
				// display photo associated with station point
				$('#StationPointMode_InfoBoxImage').attr("src","images/StationPointPhotos/7-Station-Point-Photo.jpg");
				$('#StationPointMode_InfoBoxImage').css({width:"100%",height:"auto",float:"left"});
				// display station point label
				$('#StationPointMode_StationPointLabel').html("<span class='StationPointMode_StationPointLabelTitle'>Station Point 7</span> <br> Up Grand Canyon, from Zuni Point");
				$('#StationPointMode_StationPointLabel').css({float: "left", height:"50px"});
			},
			deactivateStationPoint7Events : function() {
				$('#Viewshed7PNG').css({display:"none"});
			},
			activateStationPoint8Events : function() {
				// position station point mode info box in map frame
				$('#StationPointMode_InfoBox').css({left:"auto",left:"10px"});
				// display photo associated with station point
				$('#StationPointMode_InfoBoxImage').attr("src","images/StationPointPhotos/8-Station-Point-Photo.jpg");
				$('#StationPointMode_InfoBoxImage').css({width:"100%",height:"auto",float:"left"});
				// display station point label
				$('#StationPointMode_StationPointLabel').html("<span class='StationPointMode_StationPointLabelTitle'>Station Point 8</span> <br> Up to Marble Gorge and Painted Desert, <br> from Lipan Point");
				$('#StationPointMode_StationPointLabel').css({float: "left", height:"65px"});
			},
			deactivateStationPoint8Events : function() {
				$('#Viewshed8PNG').css({display:"none"});
			},
			activateStationPoint9Events : function() {
				// position station point mode info box in map frame
				$('#StationPointMode_InfoBox').css({left:"auto",left:"10px"});
				// display photo associated with station point
				$('#StationPointMode_InfoBoxImage').attr("src","images/StationPointPhotos/9-Station-Point-Photo.jpg");
				$('#StationPointMode_InfoBoxImage').css({width:"100%",height:"auto",float:"left"});
				// display station point label
				$('#StationPointMode_StationPointLabel').html("<span class='StationPointMode_StationPointLabelTitle'>Station Point 9</span> <br> Up to Marble Gorge and Painted Desert, <br> from Desert View");
				$('#StationPointMode_StationPointLabel').css({float: "left", height:"65px"});
			},
			deactivateStationPoint9Events : function() {
				$('#Viewshed9PNG').css({display:"none"});
			},
			activateStationPoint10Events : function() {
				// position station point mode info box in map frame
				$('#StationPointMode_InfoBox').css({left:"auto",right:"60px"});
				// display photo associated with station point
				$('#StationPointMode_InfoBoxImage').attr("src","images/StationPointPhotos/10-Station-Point-Photo.jpg");
				$('#StationPointMode_InfoBoxImage').css({width:"100%",height:"auto",float:"right"});
				// display station point label
				$('#StationPointMode_StationPointLabel').html("<span class='StationPointMode_StationPointLabelTitle'>Station Point 10</span> <br> Down Grand Canyon, from Zuni Point");
				$('#StationPointMode_StationPointLabel').css({float: "right", height:"50px"});
			},
			deactivateStationPoint10Events : function() {
				$('#Viewshed10PNG').css({display:"none"});
			},
			activateStationPoint11Events : function() {
				// position station point mode info box in map frame
				$('#StationPointMode_InfoBox').css({left:"auto",right:"60px"});
				// display photo associated with station point
				$('#StationPointMode_InfoBoxImage').attr("src","images/StationPointPhotos/11-Station-Point-Photo.jpg");
				$('#StationPointMode_InfoBoxImage').css({width:"100%",height:"auto",float:"right"});
				// display station point label
				$('#StationPointMode_StationPointLabel').html("<span class='StationPointMode_StationPointLabelTitle'>Station Point 11</span> <br> Across Grand Canyon, near El Tovar");
				$('#StationPointMode_StationPointLabel').css({float: "right", height:"50px"});
			},
			deactivateStationPoint11Events : function() {
				$('#Viewshed11PNG').css({display:"none"});
			},
			activateStationPoint12Events : function() {
				// position station point mode info box in map frame
				$('#StationPointMode_InfoBox').css({left:"auto",right:"60px"});
				// display photo associated with station point
				$('#StationPointMode_InfoBoxImage').attr("src","images/StationPointPhotos/12-Station-Point-Photo.jpg");
				$('#StationPointMode_InfoBoxImage').css({width:"100%",height:"auto",float:"right"});
				// display station point label
				$('#StationPointMode_StationPointLabel').html("<span class='StationPointMode_StationPointLabelTitle'>Station Point 12</span> <br> Descending the Zigzags, Bright Angel Trail");
				$('#StationPointMode_StationPointLabel').css({float: "right", height:"50px"});
			},
			deactivateStationPoint12Events : function() {
				$('#Viewshed12PNG').css({display:"none"});
			},
			activateStationPoint13Events : function() {
				// position station point mode info box in map frame
				$('#StationPointMode_InfoBox').css({left:"auto",right:"60px"});
				// display photo associated with station point
				$('#StationPointMode_InfoBoxImage').attr("src","images/StationPointPhotos/13-Station-Point-Photo.jpg");
				$('#StationPointMode_InfoBoxImage').css({width:"100%",height:"auto",float:"right"});
				// display station point label
				$('#StationPointMode_StationPointLabel').html("<span class='StationPointMode_StationPointLabelTitle'>Station Point 13</span> <br> Colorado River and Zoroaster Temple, <br> Foot of Bright Angel Trail");
				$('#StationPointMode_StationPointLabel').css({float: "right", height:"65px"});
			},
			deactivateStationPoint13Events : function() {
				$('#Viewshed13PNG').css({display:"none"});
			},
			activateStationPoint14Events : function() {
				$('#StationPoint14RolloverIcon').css({display:"block"});
				// position station point mode info box in map frame
				$('#StationPointMode_InfoBox').css({left:"auto",right:"60px"});
				// display photo associated with station point
				$('#StationPointMode_InfoBoxImage').attr("src","images/StationPointPhotos/14-Station-Point-Photo.jpg");
				$('#StationPointMode_InfoBoxImage').css({width:"100%",height:"auto",float:"right"});
				// display station point label
				$('#StationPointMode_StationPointLabel').html("<span class='StationPointMode_StationPointLabelTitle'>Station Point 14</span> <br> Hopi Indian Buffalo Dance at El Tovar");
				$('#StationPointMode_StationPointLabel').css({float: "right", height:"50px"});
				// display notification box stating that this station point does not have a viewshed
				$('#StationPointNotificationBox').css({left:"35%",right:"35%"});
			},
			deactivateStationPoint14Events : function() {
				// hide notification box
				$('#StationPointNotificationBox').css({left:"-99999px",right:"auto"});
			},
			activateStationPoint15Events : function() {
				$('#StationPoint15RolloverIcon').css({display:"block"});
				// position station point mode info box in map frame
				$('#StationPointMode_InfoBox').css({left:"auto",right:"60px"});
				// display photo associated with station point
				$('#StationPointMode_InfoBoxImage').attr("src","images/StationPointPhotos/15-Station-Point-Photo.jpg");
				$('#StationPointMode_InfoBoxImage').css({width:"100%",height:"auto",float:"right"});
				// display station point label
				$('#StationPointMode_StationPointLabel').html("<span class='StationPointMode_StationPointLabelTitle'>Station Point 15</span> <br> Hopi Indian Eagle Dance at El Tovar");
				$('#StationPointMode_StationPointLabel').css({float: "right", height:"50px"});
				// display notification box stating that this station point does not have a viewshed
				$('#StationPointNotificationBox').css({left:"35%",right:"35%"});
			},
			deactivateStationPoint15Events : function() {
				// hide notification box
				$('#StationPointNotificationBox').css({left:"-99999px",right:"auto"});
			},
			activateStationPoint16Events : function() {
				$('#StationPoint16RolloverIcon').css({display:"block"});
				// position station point mode info box in map frame
				$('#StationPointMode_InfoBox').css({left:"auto",right:"60px"});
				// display photo associated with station point
				$('#StationPointMode_InfoBoxImage').attr("src","images/StationPointPhotos/16-Station-Point-Photo.jpg");
				$('#StationPointMode_InfoBoxImage').css({width:"100%",height:"auto",float:"right"});
				// display station point label
				$('#StationPointMode_StationPointLabel').html("<span class='StationPointMode_StationPointLabelTitle'>Station Point 16</span> <br> Hopi Indian War Dance at El Tovar");
				$('#StationPointMode_StationPointLabel').css({float: "right", height:"50px"});
				// display notification box stating that this station point does not have a viewshed
				$('#StationPointNotificationBox').css({left:"35%",right:"35%"});
			},
			deactivateStationPoint16Events : function() {
				// hide notification box
				$('#StationPointNotificationBox').css({left:"-99999px",right:"auto"});
			},
			activateStationPoint17Events : function() {
				// position station point mode info box in map frame
				$('#StationPointMode_InfoBox').css({left:"auto",right:"60px"});
				// display photo associated with station point
				$('#StationPointMode_InfoBoxImage').attr("src","images/StationPointPhotos/17-Station-Point-Photo.jpg");
				$('#StationPointMode_InfoBoxImage').css({width:"100%",height:"auto",float:"right"});
				// display station point label
				$('#StationPointMode_StationPointLabel').html("<span class='StationPointMode_StationPointLabelTitle'>Station Point 17</span> <br> Down Grand Canyon, from Hopi Point");
				$('#StationPointMode_StationPointLabel').css({float: "right", height:"50px"});
			},
			deactivateStationPoint17Events : function() {
				$('#Viewshed17PNG').css({display:"none"});
			},
			activateStationPoint18Events : function() {
				// position station point mode info box in map frame
				$('#StationPointMode_InfoBox').css({left:"auto",right:"60px"});
				// display photo associated with station point
				$('#StationPointMode_InfoBoxImage').attr("src","images/StationPointPhotos/18-Station-Point-Photo.jpg");
				$('#StationPointMode_InfoBoxImage').css({width:"100%",height:"auto",float:"right"});
				// display station point label
				$('#StationPointMode_StationPointLabel').html("<span class='StationPointMode_StationPointLabelTitle'>Station Point 18</span> <br> Eastern Outlook, from Havasupai Point");
				$('#StationPointMode_StationPointLabel').css({float: "right", height:"50px"});
			},
			deactivateStationPoint18Events : function() {
				$('#Viewshed18PNG').css({display:"none"});
			},
			activateStationPoint19Events : function() {
				// position station point mode info box in map frame
				$('#StationPointMode_InfoBox').css({left:"auto",right:"60px"});
				// display photo associated with station point
				$('#StationPointMode_InfoBoxImage').attr("src","images/StationPointPhotos/19-Station-Point-Photo.jpg");
				$('#StationPointMode_InfoBoxImage').css({width:"100%",height:"auto",float:"right"});
				// display station point label
				$('#StationPointMode_StationPointLabel').html("<span class='StationPointMode_StationPointLabelTitle'>Station Point 19</span> <br> Across Grand Scenic Divide, <br> from Havasupai Point");
				$('#StationPointMode_StationPointLabel').css({float: "right", height:"65px"});
			},
			deactivateStationPoint19Events : function() {
				$('#Viewshed19PNG').css({display:"none"});
			},
			activateStationPoint20Events : function() {
				// position station point mode info box in map frame
				$('#StationPointMode_InfoBox').css({left:"auto",right:"60px"});
				// display photo associated with station point
				$('#StationPointMode_InfoBoxImage').attr("src","images/StationPointPhotos/20-Station-Point-Photo.jpg");
				$('#StationPointMode_InfoBoxImage').css({width:"100%",height:"auto",float:"right"});
				// display station point label
				$('#StationPointMode_StationPointLabel').html("<span class='StationPointMode_StationPointLabelTitle'>Station Point 20</span> <br> Havasupai Point, from Grand Scenic Divide");
				$('#StationPointMode_StationPointLabel').css({float: "right", height:"50px"});
			},
			deactivateStationPoint20Events : function() {
				$('#Viewshed20PNG').css({display:"none"});
			},
			activateStationPoint21Events : function() {
				// position station point mode info box in map frame
				$('#StationPointMode_InfoBox').css({left:"auto",right:"60px"});
				// display photo associated with station point
				$('#StationPointMode_InfoBoxImage').attr("src","images/StationPointPhotos/21-Station-Point-Photo.jpg");
				$('#StationPointMode_InfoBoxImage').css({width:"100%",height:"auto",float:"right"});
				// display station point label
				$('#StationPointMode_StationPointLabel').html("<span class='StationPointMode_StationPointLabelTitle'>Station Point 21</span> <br> North Wall of Canyon, <br> from Grand Scenic Divide");
				$('#StationPointMode_StationPointLabel').css({float: "right", height:"65px"});
			},
			deactivateStationPoint21Events : function() {
				$('#Viewshed21PNG').css({display:"none"});
			},
			activateStationPoint22Events : function() {
				// position station point mode info box in map frame
				$('#StationPointMode_InfoBox').css({left:"auto",right:"60px"});
				// display photo associated with station point
				$('#StationPointMode_InfoBoxImage').attr("src","images/StationPointPhotos/22-Station-Point-Photo.jpg");
				$('#StationPointMode_InfoBoxImage').css({width:"100%",height:"auto",float:"right"});
				// display station point label
				$('#StationPointMode_StationPointLabel').html("<span class='StationPointMode_StationPointLabelTitle'>Station Point 22</span> <br> Up Grand Canyon, from Grand Scenic Divide");
				$('#StationPointMode_StationPointLabel').css({float: "right", height:"50px"});
			},
			deactivateStationPoint22Events : function() {
				$('#Viewshed22PNG').css({display:"none"});
			},
			activateStationPoint23Events : function() {
				// position station point mode info box in map frame
				$('#StationPointMode_InfoBox').css({left:"auto",left:"10px"});
				// display photo associated with station point
				$('#StationPointMode_InfoBoxImage').attr("src","images/StationPointPhotos/23-Station-Point-Photo.jpg");
				$('#StationPointMode_InfoBoxImage').css({width:"100%",height:"auto",float:"left"});
				// display station point label
				$('#StationPointMode_StationPointLabel').html("<span class='StationPointMode_StationPointLabelTitle'>Station Point 23</span> <br> Bird's-eye View of Grand Canyon, <br> from an Airplane");
				$('#StationPointMode_StationPointLabel').css({float: "left", height:"65px"});
			},
			deactivateStationPoint23Events : function() {
				$('#Viewshed23PNG').css({display:"none"});
			},
			activateStationPoint24Events : function() {
				// position station point mode info box in map frame
				$('#StationPointMode_InfoBox').css({left:"auto",left:"10px"});
				// display photo associated with station point
				$('#StationPointMode_InfoBoxImage').attr("src","images/StationPointPhotos/24-Station-Point-Photo.jpg");
				$('#StationPointMode_InfoBoxImage').css({width:"100%",height:"auto",float:"left"});
				// display station point label
				$('#StationPointMode_StationPointLabel').html("<span class='StationPointMode_StationPointLabelTitle'>Station Point 24</span> <br> Bright Angel Canyon, from Yavapai Point");
				$('#StationPointMode_StationPointLabel').css({float: "left", height:"50px"});
			},
			deactivateStationPoint24Events : function() {
				$('#Viewshed24PNG').css({display:"none"});
			},
			activateStationPoint25Events : function() {
				$('#StationPoint25RolloverIcon').css({display:"block"});
				// position station point mode info box in map frame
				$('#StationPointMode_InfoBox').css({left:"auto",right:"10px"});
				// display photo associated with station point
				$('#StationPointMode_InfoBoxImage').attr("src","images/StationPointPhotos/25-Station-Point-Photo.jpg");
				$('#StationPointMode_InfoBoxImage').css({width:"auto",height:"100%",float:"right"});
				// display station point label
				$('#StationPointMode_StationPointLabel').html("<span class='StationPointMode_StationPointLabelTitle'>Station Point 25</span> <br> Starting Down the Kaibab Trail, <br> from Yaki Point");
				$('#StationPointMode_StationPointLabel').css({float: "right", height:"65px"});
				// display notification box stating that this station point does not have a viewshed
				$('#StationPointNotificationBox').css({left:"35%",right:"35%"});
			},
			deactivateStationPoint25Events : function() {
				// hide notification box
				$('#StationPointNotificationBox').css({left:"-99999px",right:"auto"});
			},
			activateStationPoint26Events : function() {
				// position station point mode info box in map frame
				$('#StationPointMode_InfoBox').css({left:"auto",right:"60px"});
				// display photo associated with station point
				$('#StationPointMode_InfoBoxImage').attr("src","images/StationPointPhotos/26-Station-Point-Photo.jpg");
				$('#StationPointMode_InfoBoxImage').css({width:"100%",height:"auto",float:"right"});
				// display station point label
				$('#StationPointMode_StationPointLabel').html("<span class='StationPointMode_StationPointLabelTitle'>Station Point 26</span> <br> The Kaibab Suspension Bridge");
				$('#StationPointMode_StationPointLabel').css({float: "right", height:"50px"});
			},
			deactivateStationPoint26Events : function() {
				$('#Viewshed26PNG').css({display:"none"});
			},
			activateStationPoint27Events : function() {
				$('#StationPoint27RolloverIcon').css({display:"block"});
				// position station point mode info box in map frame
				$('#StationPointMode_InfoBox').css({left:"auto",right:"60px"});
				// display photo associated with station point
				$('#StationPointMode_InfoBoxImage').attr("src","images/StationPointPhotos/27-Station-Point-Photo.jpg");
				$('#StationPointMode_InfoBoxImage').css({width:"100%",height:"auto",float:"right"});
				// display station point label
				$('#StationPointMode_StationPointLabel').html("<span class='StationPointMode_StationPointLabelTitle'>Station Point 27</span> <br> Tunnel Approach to Bridge");
				$('#StationPointMode_StationPointLabel').css({float: "right", height:"50px"});
				// display notification box stating that this station point does not have a viewshed
				$('#StationPointNotificationBox').css({left:"35%",right:"35%"});
			},
			deactivateStationPoint27Events : function() {
				// hide notification box
				$('#StationPointNotificationBox').css({left:"-99999px",right:"auto"});
			},
			activateStationPoint28Events : function() {
				// position station point mode info box in map frame
				$('#StationPointMode_InfoBox').css({left:"auto",right:"60px"});
				// display photo associated with station point
				$('#StationPointMode_InfoBoxImage').attr("src","images/StationPointPhotos/28-Station-Point-Photo.jpg");
				$('#StationPointMode_InfoBoxImage').css({width:"100%",height:"auto",float:"right"});
				// display station point label
				$('#StationPointMode_StationPointLabel').html("<span class='StationPointMode_StationPointLabelTitle'>Station Point 28</span> <br> A Trail Party Crossing Bridge");
				$('#StationPointMode_StationPointLabel').css({float: "right", height:"50px"});
			},
			deactivateStationPoint28Events : function() {
				$('#Viewshed28PNG').css({display:"none"});
			},
			activateStationPoint29Events : function() {
				$('#StationPoint29RolloverIcon').css({display:"block"});
				// position station point mode info box in map frame
				$('#StationPointMode_InfoBox').css({left:"auto",right:"10px"});
				// display photo associated with station point
				$('#StationPointMode_InfoBoxImage').attr("src","images/StationPointPhotos/29-Station-Point-Photo.jpg");
				$('#StationPointMode_InfoBoxImage').css({width:"auto",height:"100%",float:"right"});
				// display station point label
				$('#StationPointMode_StationPointLabel').html("<span class='StationPointMode_StationPointLabelTitle'>Station Point 29</span> <br> Ribbon Falls, Bright Angel Canyon");
				$('#StationPointMode_StationPointLabel').css({float: "right", height:"50px"});
				// display notification box stating that this station point does not have a viewshed
				$('#StationPointNotificationBox').css({left:"35%",right:"35%"});
			},
			deactivateStationPoint29Events : function() {
				// hide notification box
				$('#StationPointNotificationBox').css({left:"-99999px",right:"auto"});
			},
			activateStationPoint30Events : function() {
				// position station point mode info box in map frame
				$('#StationPointMode_InfoBox').css({left:"auto",right:"10px"});
				// display photo associated with station point
				$('#StationPointMode_InfoBoxImage').attr("src","images/StationPointPhotos/30-Station-Point-Photo.jpg");
				$('#StationPointMode_InfoBoxImage').css({width:"auto",height:"100%",float:"right"});
				// display station point label
				$('#StationPointMode_StationPointLabel').html("<span class='StationPointMode_StationPointLabelTitle'>Station Point 30</span> <br> Across to Roaring Springs, from Kaibab Trail");
				$('#StationPointMode_StationPointLabel').css({float: "right", height:"50px"});
			},
			deactivateStationPoint30Events : function() {
				$('#Viewshed30PNG').css({display:"none"});
			},
			activateStationPoint31Events : function() {
				$('#StationPoint31RolloverIcon').css({display:"block"});
				// position station point mode info box in map frame
				$('#StationPointMode_InfoBox').css({left:"auto",right:"60px"});
				// display photo associated with station point
				$('#StationPointMode_InfoBoxImage').attr("src","images/StationPointPhotos/31-Station-Point-Photo.jpg");
				$('#StationPointMode_InfoBoxImage').css({width:"100%",height:"auto",float:"right"});
				// display station point label
				$('#StationPointMode_StationPointLabel').html("<span class='StationPointMode_StationPointLabelTitle'>Station Point 31</span> <br> On the Kaibab Trail Above Roaring Springs");
				$('#StationPointMode_StationPointLabel').css({float: "right", height:"50px"});
				// display notification box stating that this station point does not have a viewshed
				$('#StationPointNotificationBox').css({left:"35%",right:"35%"});
			},
			deactivateStationPoint31Events : function() {
				// hide notification box
				$('#StationPointNotificationBox').css({left:"-99999px",right:"auto"});
			},
			activateStationPoint32Events : function() {
				// position station point mode info box in map frame
				$('#StationPointMode_InfoBox').css({left:"auto",right:"60px"});
				// display photo associated with station point
				$('#StationPointMode_InfoBoxImage').attr("src","images/StationPointPhotos/32-Station-Point-Photo.jpg");
				$('#StationPointMode_InfoBoxImage').css({width:"100%",height:"auto",float:"right"});
				// display station point label
				$('#StationPointMode_StationPointLabel').html("<span class='StationPointMode_StationPointLabelTitle'>Station Point 32</span> <br> Up Grand Canyon, from Bright Angel Point");
				$('#StationPointMode_StationPointLabel').css({float: "right", height:"50px"});
			},
			deactivateStationPoint32Events : function() {
				$('#Viewshed32PNG').css({display:"none"});
			},
			activateStationPoint33Events : function() {
				// position station point mode info box in map frame
				$('#StationPointMode_InfoBox').css({left:"auto",right:"60px"});
				// display photo associated with station point
				$('#StationPointMode_InfoBoxImage').attr("src","images/StationPointPhotos/33-Station-Point-Photo.jpg");
				$('#StationPointMode_InfoBoxImage').css({width:"100%",height:"auto",float:"right"});
				// display station point label
				$('#StationPointMode_StationPointLabel').html("<span class='StationPointMode_StationPointLabelTitle'>Station Point 33</span> <br> Across Oza Butte to South Rim");
				$('#StationPointMode_StationPointLabel').css({float: "right", height:"50px"});
			},
			deactivateStationPoint33Events : function() {
				$('#Viewshed33PNG').css({display:"none"});
			},
			activateStationPoint34Events : function() {
				$('#StationPoint34RolloverIcon').css({display:"block"});
				// position station point mode info box in map frame
				$('#StationPointMode_InfoBox').css({left:"auto",right:"60px"});
				// display photo associated with station point
				$('#StationPointMode_InfoBoxImage').attr("src","images/StationPointPhotos/34-Station-Point-Photo.jpg");
				$('#StationPointMode_InfoBoxImage').css({width:"100%",height:"auto",float:"right"});
				// display station point label
				$('#StationPointMode_StationPointLabel').html("<span class='StationPointMode_StationPointLabelTitle'>Station Point 34</span> <br> A Grove of Pines in the Kaibab Forest");
				$('#StationPointMode_StationPointLabel').css({float: "right", height:"50px"});
				// display notification box stating that this station point does not have a viewshed
				$('#StationPointNotificationBox').css({left:"35%",right:"35%"});
			},
			deactivateStationPoint34Events : function() {
				// hide notification box
				$('#StationPointNotificationBox').css({left:"-99999px",right:"auto"});
			},
			activateStationPoint35Events : function() {
				// position station point mode info box in map frame
				$('#StationPointMode_InfoBox').css({left:"auto",right:"60px"});
				// display photo associated with station point
				$('#StationPointMode_InfoBoxImage').attr("src","images/StationPointPhotos/35-Station-Point-Photo.jpg");
				$('#StationPointMode_InfoBoxImage').css({width:"100%",height:"auto",float:"right"});
				// display station point label
				$('#StationPointMode_StationPointLabel').html("<span class='StationPointMode_StationPointLabelTitle'>Station Point 35</span> <br> Across Canyon to Havasupai Point, <br> from Pt. Sublime");
				$('#StationPointMode_StationPointLabel').css({float: "right", height:"65px"});
			},
			deactivateStationPoint35Events : function() {
				$('#Viewshed35PNG').css({display:"none"});
			},
			activateStationPoint37Events : function() {
				// position station point mode info box in map frame
				$('#StationPointMode_InfoBox').css({left:"auto",right:"60px"});
				// display photo associated with station point
				$('#StationPointMode_InfoBoxImage').attr("src","images/StationPointPhotos/37-Station-Point-Photo.jpg");
				$('#StationPointMode_InfoBoxImage').css({width:"100%",height:"auto",float:"right"});
				// display station point label
				$('#StationPointMode_StationPointLabel').html("<span class='StationPointMode_StationPointLabelTitle'>Station Point 37</span> <br> Up Canyon to Shiva Temple, <br> from Pt. Sublime");
				$('#StationPointMode_StationPointLabel').css({float: "right", height:"65px"});
			},
			deactivateStationPoint37Events : function() {
				$('#Viewshed37PNG').css({display:"none"});
			},
			activateStationPoint38Events : function() {
				// position station point mode info box in map frame
				$('#StationPointMode_InfoBox').css({left:"auto",right:"60px"});
				// display photo associated with station point
				$('#StationPointMode_InfoBoxImage').attr("src","images/StationPointPhotos/38-Station-Point-Photo.jpg");
				$('#StationPointMode_InfoBoxImage').css({width:"100%",height:"auto",float:"right"});
				// display station point label
				$('#StationPointMode_StationPointLabel').html("<span class='StationPointMode_StationPointLabelTitle'>Station Point 38</span> <br> Down Canyon to Shiva Temple, <br> from Cape Royal");
				$('#StationPointMode_StationPointLabel').css({float: "right", height:"65px"});
			},
			deactivateStationPoint38Events : function() {
				$('#Viewshed38PNG').css({display:"none"});
			},
			activateStationPoint39Events : function() {
				// position station point mode info box in map frame
				$('#StationPointMode_InfoBox').css({left:"auto",right:"60px"});
				// display photo associated with station point
				$('#StationPointMode_InfoBoxImage').attr("src","images/StationPointPhotos/39-Station-Point-Photo.jpg");
				$('#StationPointMode_InfoBoxImage').css({width:"100%",height:"auto",float:"right"});
				// display station point label
				$('#StationPointMode_StationPointLabel').html("<span class='StationPointMode_StationPointLabelTitle'>Station Point 39</span> <br> Angel's Window, on Cape Royal");
				$('#StationPointMode_StationPointLabel').css({float: "right", height:"50px"});
			},
			deactivateStationPoint39Events : function() {
				$('#Viewshed39PNG').css({display:"none"});
			},
			activateStationPoint40Events : function() {
				// position station point mode info box in map frame
				$('#StationPointMode_InfoBox').css({left:"10px",right:"auto"});
				// display photo associated with station point
				$('#StationPointMode_InfoBoxImage').attr("src","images/StationPointPhotos/40-Station-Point-Photo.jpg");
				$('#StationPointMode_InfoBoxImage').css({width:"100%",height:"auto",float:"left"});
				// display station point label
				$('#StationPointMode_StationPointLabel').html("<span class='StationPointMode_StationPointLabelTitle'>Station Point 40</span> <br> Across Marble Gorge to Painted Desert, <br> at Pt. Imperial");
				$('#StationPointMode_StationPointLabel').css({float: "left", height:"65px"});
			},
			deactivateStationPoint40Events : function() {
				$('#Viewshed40PNG').css({display:"none"});
			},
			activateStationPoint41Events : function() {
				// position station point mode info box in map frame
				$('#StationPointMode_InfoBox').css({left:"10px",right:"auto"});
				// display photo associated with station point
				$('#StationPointMode_InfoBoxImage').attr("src","images/StationPointPhotos/41-Station-Point-Photo.jpg");
				$('#StationPointMode_InfoBoxImage').css({width:"100%",height:"auto",float:"left"});
				// display station point label
				$('#StationPointMode_StationPointLabel').html("<span class='StationPointMode_StationPointLabelTitle'>Station Point 41</span> <br> Toward Little Colorado River, <br> from Pt. Imperial");
				$('#StationPointMode_StationPointLabel').css({float: "left", height:"65px"});
			},
			deactivateStationPoint41Events : function() {
				$('#Viewshed41PNG').css({display:"none"});
			},
			activateStationPoint42Events : function() {
				// position station point mode info box in map frame
				$('#StationPointMode_InfoBox').css({left:"auto",left:"10px"});
				// display photo associated with station point
				$('#StationPointMode_InfoBoxImage').attr("src","images/StationPointPhotos/42-Station-Point-Photo.jpg");
				$('#StationPointMode_InfoBoxImage').css({width:"100%",height:"auto",float:"left"});
				// display station point label
				$('#StationPointMode_StationPointLabel').html("<span class='StationPointMode_StationPointLabelTitle'>Station Point 42</span> <br> A Storm in the Grand Canyon");
				$('#StationPointMode_StationPointLabel').css({float: "left", height:"50px"});
			},
			deactivateStationPoint42Events : function() {
				$('#Viewshed42PNG').css({display:"none"});
			},
			activateStationPoint43Events : function() {
				// position station point mode info box in map frame
				$('#StationPointMode_InfoBox').css({left:"auto",left:"10px"});
				// display photo associated with station point
				$('#StationPointMode_InfoBoxImage').attr("src","images/StationPointPhotos/43-Station-Point-Photo.jpg");
				$('#StationPointMode_InfoBoxImage').css({width:"100%",height:"auto",float:"left"});
				// display station point label
				$('#StationPointMode_StationPointLabel').html("<span class='StationPointMode_StationPointLabelTitle'>Station Point 43</span> <br> After the Storm");
				$('#StationPointMode_StationPointLabel').css({float: "left", height:"50px"});
			},
			deactivateStationPoint43Events : function() {
				$('#Viewshed43PNG').css({display:"none"});
			}
		};

		/*
		 * Function: displayStationPointPopup
		 * --------------
		 * Displays popup when user clicks on station point
		 */
		function displayStationPointPopup(station_point_name) {
			if(is_explore_by_station_point_mode_active) {
				$("#StationPointMode_InfoBox").css({left:"auto",right:"-999999px"});
				$("#StationPointMode_InfoBoxImage").attr("src","");
				$("#StationPointMode_InfoBoxImage").css({border:"0px"});
				$("#StationPointNotificationBox").css({left:"-99999px",right:"auto"});
				displayCorrespondingStationPointPopup(station_point_name);
				$("#StationPointPopupDiv").css({display:"block",zIndex:4000});
				$("#StationPointPopupLink").attr("target","_blank");
			}
		}

		function displayCorrespondingStationPointPopup(station_point_name) {
			var current_station_point_number = station_point_name.substring("StationPoint".length).toString();
			$("#Viewshed"+current_station_point_number+"PNG").css({display: "none"});
			$("#StationPointPopup").attr("src","images/StationPointPhotos/"+current_station_point_number+"-Station-Point-Photo.jpg");
			
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
		/*
		 * Function: getStationPointPopupOffset
		 * --------------
		 * 
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

		function hideStationPointPopup(event) {
			var clicked_object = document.elementFromPoint(event.clientX,event.clientY);
			if(clicked_object.id != "StationPointPopup") {
				$('#StationPointPopupDiv').css({display:"none",zIndex:-1});
			}
		}

		function setExploreByStationPointModeStatus(status) {
			is_explore_by_station_point_mode_active = status;
		}

		function getExploreByStationPointModeStatus() {
			return is_explore_by_station_point_mode_active;
		}

		function displayHint() {
			$("#station_point_mode_button_hint_container").css({left:"10%",right:"auto"});
			$("#Mode_Button_One_Hover").css({display: "block"});
		}

		function hideHint() {
			$("#station_point_mode_button_hint_container").css({left:"-99999px",right:"auto"});
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

		/*
		 * Function: activateMode
		 * --------------
		 * Called when user clicks on the location mode button.
		 */
		function activateMode()
		{
			// only activate location mode if it is not already active
			if(!is_explore_by_location_mode_active) {
				is_explore_by_location_mode_active = true;
				ExploreByStationPointMode.setExploreByStationPointModeStatus(false);
				setAllStationPointIconsOpacity(0.6);
				
				setContentDimensions();
				$('#Mode_Button_All_On').css({display: "block"});
				$('#Mode_Button_One_On').css({display: "none"});
				//place StationPointSVGLayer at a lower layer so that the viewshed layers
				//can be accessed from the top
				$('#StationPointSVGLayer').css({zIndex:400});
				
				$('#StationPointMode_InfoBox').css({left:"auto",right:"-99999px",zIndex:-1});
				$('#LocationMode_InfoBox').css({left:"auto",right:"60px",zIndex:1000});
			}
		}

		/*
		 * Function: checkLocationModeMouseoverEvents
		 * --------------
		 * 
		 */
		function checkLocationModeMouseoverEvents()
		{
			// create array to store active station points
			var active_station_points_arr = [];

			active_station_points_arr = findActiveStationPoints(active_station_points_arr);
			displayActiveStationPointsNames(active_station_points_arr);

			var StationPointIcons = document.getElementsByClassName('StationPointIcon');
			if(active_station_points_arr.length > 0) {
				for(var i = 0; i < StationPointIcons.length; i++) {
					StationPointIcons[i].style.display = "none";
				}
				for(var i = 0; i <= active_station_points_arr.length; i++) {
					$('#StationPoint'+active_station_points_arr[i]+'Icon').css({display:"block"});
				}
			} else {
				for(var i = 0; i < StationPointIcons.length; i++) {
					$('#'+StationPointIcons[i].id).css({display:"block"});
				}
			}
			// reset z-index values for all viewsheds
			setViewshedDivZIndexValues();
		}
		/*
		 * Function: findActiveStationPoints
		 * --------------
		 * 
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
			var viewshed_div_names = ['Viewshed2Div','Viewshed3Div','Viewshed4Div','Viewshed5Div','Viewshed6Div','Viewshed7Div','Viewshed8Div','Viewshed9Div','Viewshed10Div','Viewshed11Div','Viewshed12Div','Viewshed13Div','Viewshed17Div','Viewshed18Div','Viewshed19Div','Viewshed20Div','Viewshed21Div','Viewshed22Div','Viewshed23Div','Viewshed24Div','Viewshed26Div','Viewshed28Div','Viewshed30Div','Viewshed32Div','Viewshed33Div','Viewshed35Div','Viewshed37Div','Viewshed38Div','Viewshed39Div','Viewshed40Div','Viewshed41Div','Viewshed42Div','Viewshed43Div'];

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
		/*
		 * Function: displayActiveStationPointsNames
		 * --------------
		 * 
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
		/*
		 * Function: setViewshedDivZIndexValues
		 * --------------
		 * This function resets z-index values for all viewshed divs to defaults.
		 */
		function setViewshedDivZIndexValues() {
			var temp_ind = [];
			for(var i = 500; i > 466; i--) temp_ind.push(i);

			var ViewshedDivs = document.getElementsByClassName('ViewshedDivs');
			for(var i = 0; i < ViewshedDivs.length; i++) {
				$('#'+ViewshedDivs[i].id).css({zIndex:temp_ind[i]});
			}
		}

		/*
		 * Function: displayLocationModePopup
		 * --------------
		 * Function displays popup when user clicks on viewshed and when location_mode is active.
		 */
		function displayLocationModePopup() {
			/* If location mode is active, engage location functionality! */
			if(!ExploreByStationPointMode.getExploreByStationPointModeStatus() && !popup_fade_out_in_progress) {
				
				/* Array to store which station points the location the user clicked on is visible */
				var stationpoints_visible = [];

				stationpoints_visible = findActiveStationPoints(stationpoints_visible);
				
				/* If the user has clicked on a location with a viewshed */
				if(stationpoints_visible.length > 0) {
					/* If a popup already exists, remove the popup to allow the creation of a new one */
					if($("#popup_div").length > 0)
						$('#popup_div').remove();
					
					/* Create new popup div */
					var popup_div = document.createElement('div');
					popup_div.id = "popup_div";
					popup_div.className = 'zoomable_element'; //to identify as a popup element and as a zoomable element
					popup_div.style.cssText = 'left:20%; right:20%; bottom:40px; position:absolute; border-radius: 25px; z-index: 600; background-color: rgba(256,256,256,0.75); text-align: center; color: black;';

					/* Create exit button for popup div */
					var exit_button = document.createElement('img');
					exit_button.src = "./images/Popup-Window-Exit-Button.png";
					exit_button.id = "exit_button";
					exit_button.className = 'zoomable_element';
					exit_button.style.cssText = 'position:absolute; top:15px; right:15px; width: 25px; height: 25px; border-radius:5px; background-color: rgba(150,150,150,0.8); cursor: pointer';
					popup_div.appendChild(exit_button);
			
					/* Add intro text to popup div */
					addIntroTextToLocationModePopup(popup_div,stationpoints_visible);
					
					/* Add links to popup div */
					addLinksToLocationModePopup(popup_div,stationpoints_visible);

					/* Use different heights for popup divs depending on how many links
					will be displayed (stationpoints_visible.length == # of links) */
					switch(stationpoints_visible.length) {
						case 1:
							popup_div.style.height = '90px'; break;
						case 2:
							popup_div.style.height = '107px'; break;
						case 3:
							popup_div.style.height = '124px'; break;
						case 4:
							popup_div.style.height = '141px'; break;
						case 5:
							popup_div.style.height = '158px'; break;
						case 6:
							popup_div.style.height = '175px'; break;
						case 7:
							popup_div.style.height = '192px'; break;
						case 8:
							popup_div.style.height = '209px'; break;
						default:
							popup_div.style.height = '209px'; break;
					}
						
					$("#panzoom_parent").append(popup_div);
					
					// Destroy popup when user clicks on it
					$('#exit_button').click(function() {
						destroyLocationModePopup();
					});

				}
			}
		}

		/*
		 * Function: addLinksToLocationModePopup
		 * --------------
		 * 
		 */
		function addLinksToLocationModePopup(popup_div,stationpoints_visible) {
			var stationpoint_link1, stationpoint_link2, stationpoint_link3, stationpoint_link4, stationpoint_link5, stationpoint_link6, stationpoint_link7, stationpoint_link8;
			var stationpoint_links = [stationpoint_link1, stationpoint_link2, stationpoint_link3, stationpoint_link4, stationpoint_link5, stationpoint_link6, stationpoint_link7, stationpoint_link8];
			for(var i = 0; i < stationpoints_visible.length; i++) {
				stationpoint_links[i] = document.createElement('a');
				stationpoint_links[i].className = 'zoomable_element'; //to identify as a popup element
				stationpoint_links[i].style.fontSize = "12px";
				stationpoint_links[i].target = '_blank'; // make link open up in new tab
				stationpoint_links[i].href = getLocationModePopupLink(stationpoints_visible[i]);
				stationpoint_links[i].appendChild(document.createTextNode('Go to Station Point ' + stationpoints_visible[i] + ' Photo Module.'));
				stationpoint_links[i].appendChild(document.createElement('br'));
				popup_div.appendChild(stationpoint_links[i]);
			}
		}
		/*
		 * Function: getLocationModePopupLink
		 * --------------
		 * 
		 */
		function getLocationModePopupLink(stationpoint_index) {
			switch(parseInt(stationpoint_index)) {
				case 2:
					return 'http://enchantingthedesert.com/2-on-grand-view-point/'; break;
				case 3:
					return 'http://enchantingthedesert.com/3-angels-gate-wotans-throne-and-vishnu-temple/'; break;
				case 4:
					return 'http://enchantingthedesert.com/4-up-granite-gorge/'; break;
				case 5:
					return 'http://enchantingthedesert.com/5-down-granite-gorge-from-grand-view-trail/'; break;	
				case 6:
					return 'http://enchantingthedesert.com/6-up-grand-canyon-from-moran-point/'; break;
				case 7:
					return 'http://enchantingthedesert.com/7-up-grand-canyon-from-zuni-point/'; break;
				case 8:
					return 'http://enchantingthedesert.com/8-up-to-marble-gorge-and-painted-desert-from-lipan-point/'; break;	
				case 9:
					return 'http://enchantingthedesert.com/9-up-to-marble-gorge-and-painted-desert-from-desert-view/'; break;	
				case 10:
					return 'http://enchantingthedesert.com/10-down-grand-canyon-from-zuni-point/'; break;
				case 11:
					return 'http://enchantingthedesert.com/11-across-grand-canyon-near-el-tovar/'; break;	
				case 12:
					return 'http://enchantingthedesert.com/12-descending-the-zigzags-bright-angel-trail/'; break;
				case 13:
					return 'http://enchantingthedesert.com/13-colorado-river-and-zoroaster-temple-foot-of-bright-angel-trail/'; break;
				case 14:
					return 'http://enchantingthedesert.com/14-hopi-indian-buffalo-dance-at-el-tovar/'; break;
				case 15:
					return 'http://enchantingthedesert.com/15-hopi-indian-eagle-dance-at-el-tovar/'; break;
				case 16:
					return 'http://enchantingthedesert.com/16-hopi-indian-war-dance-at-el-tovar/'; break;
				case 17:
					return 'http://enchantingthedesert.com/17-down-grand-canyon-from-hopi-point/'; break;
				case 18:
					return 'http://enchantingthedesert.com/18-eastern-outlook-from-havasupai-point/'; break;
				case 19:
					return 'http://enchantingthedesert.com/19-across-grand-scenic-divide-from-havasupai-point/'; break;
				case 20:
					return 'http://enchantingthedesert.com/20-havasupai-point-from-grand-scenic-divide/'; break;
				case 21:
					return 'http://enchantingthedesert.com/21-north-wall-of-canyon-from-grand-scenic-divide/'; break;
				case 22:
					return 'http://enchantingthedesert.com/22-up-grand-canyon-from-grand-scenic-divide/'; break;
				case 23:
					return 'http://enchantingthedesert.com/23-birds-eye-view-of-grand-canyon-from-an-airplane/'; break;
				case 24:
					return 'http://enchantingthedesert.com/24-bright-angel-canyon-from-yavapai-point/'; break;
				case 25:
					return 'http://enchantingthedesert.com/25-starting-down-the-kaibab-trail-from-yaki-point/'; break;
				case 26:
					return 'http://enchantingthedesert.com/26-the-kaibab-suspension-bridge/'; break;
				case 27:
					return 'http://enchantingthedesert.com/27-tunnel-approach-to-bridge/'; break;
				case 28:
					return 'http://enchantingthedesert.com/28-a-trail-party-crossing-bridge/'; break;
				case 29:
					return 'http://enchantingthedesert.com/29-ribbon-falls-bright-angel-canyon/'; break;
				case 30:
					return 'http://enchantingthedesert.com/30-across-to-roaring-springs-from-kaibab-trail/'; break;
				case 31:
					return 'http://enchantingthedesert.com/31-on-the-kaibab-trail-above-roaring-springs/'; break;
				case 32:
					return 'http://enchantingthedesert.com/32-up-grand-canyon-from-bright-angel-point-2/'; break;
				case 33:
					return 'http://enchantingthedesert.com/33-across-oza-butte-to-south-rim/'; break;
				case 34:
					return 'http://enchantingthedesert.com/34-a-grove-of-pines-in-the-kaibab-forest/'; break;
				case 35:
					return 'http://enchantingthedesert.com/35-across-canyon-to-havasupai-point-from-pt-sublime/'; break;
				case 37:
					return 'http://enchantingthedesert.com/37-up-canyon-to-shiva-temple-from-pt-sublime/'; break;
				case 38:
					return 'http://enchantingthedesert.com/38-down-canyon-to-shiva-temple-from-cape-royal/'; break;
				case 39:
					return 'http://enchantingthedesert.com/39-angels-window-on-cape-royal/'; break;
				case 40:
					return 'http://enchantingthedesert.com/40-across-marble-gorge-to-painted-desert-at-pt-imperial/'; break;
				case 41:
					return 'http://enchantingthedesert.com/41-toward-little-colorado-river-from-point-imperial/'; break;
				case 42:
					return 'http://enchantingthedesert.com/42-a-storm-in-the-grand-canyon/'; break;
				case 43:
					return 'http://enchantingthedesert.com/43-after-the-storm/'; break;		
				default:
					return 'http://enchantingthedesert.com/2-on-grand-view-point/'; break;
			}
		}
		/*
		 * Function: addIntroTextToLocationModePopup
		 * --------------
		 * 
		 */
		function addIntroTextToLocationModePopup(popup_div,stationpoints_visible) {
			/* Variable to store the sentence in the popup that describes which station points
			the user-clicked location are visible from */
			var intro = document.createElement('p'), intro_text = '';
			intro.className = 'zoomable_element'; //to identify as a popup element
			/* Add the names of the station points to intro_text of the station points
			the user-clicked location are visible from */
			if(stationpoints_visible.length != 0) { //if user has clicked on a viewshed
				if(stationpoints_visible.length == 1) {
					/* If there is only one station point to be included in the sentence */
					intro_text += 'The location you clicked is visible from station point ' + stationpoints_visible[0];
				} else {
					/* If there is more than one station point to be included in the sentence */
					intro_text = 'The location you clicked is visible from station points ';
					for(var i = 0; i < stationpoints_visible.length; i++) {
						if(i == stationpoints_visible.length - 1) {
							/* If this is the last station point to be added to the sentence */
							intro_text += ' and ' + stationpoints_visible[i];
						} else {
							if(stationpoints_visible.length == 2 && i == 0) {
								/* If there is only two station points, don't add the comma before
								the 'and' word */
								intro_text += stationpoints_visible[i];
							} else {
								intro_text += stationpoints_visible[i] + ', ';
							}
						}
					}
				}
				intro_text += '.';
				intro_text = document.createTextNode(intro_text);
				intro.appendChild(intro_text);
				intro.style.cssText = 'font-size:15px; font-weight:400; margin-top:12px; margin-bottom:12px; text-align:center;';
				popup_div.appendChild(intro);
			}
		}
		/*
		 * Function: destroyLocationModePopup
		 * --------------
		 * Function destroys active popup with id 'popup_div' by first executing a fadeout,
		 * then removing the popup_div element
		 */
		function destroyLocationModePopup() {
			$('#popup_div').fadeOut(500);
			popup_fade_out_in_progress = true;
			setTimeout(function(){
				$('#popup_div').remove();
				popup_fade_out_in_progress = false;
			},500);
		}

		function setExploreByLocationModeStatus(status) {
			is_explore_by_location_mode_active = status;
		}

		function getExploreByLocationModeStatus() {
			return is_explore_by_location_mode_active;
		}

		function displayHint() {
			$("#location_mode_button_hint_container").css({left:"10%",right:"auto"});
			$("#Mode_Button_All_Hover").css({display: "block"});
		}

		function hideHint() {
			$("#location_mode_button_hint_container").css({left:"-99999px",right:"auto"});
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

		/*
		 * Function: triggerLandmarksToggleEvent
		 * --------------
		 * This function is called when the user clicks on the 'checkbox' for 'Landmarks'.
		 * As this 'checkbox' is not actually a checkbox object, the internals of determining
		 * what events to trigger following the clicking of the 'checkbox' is determined in this
		 * function.
		 */
		function triggerLandmarksToggleEvent() {
			if(!is_landmarks_layer_displayed) {
				activateLandmarksToggle();
			} else {
				deactivateLandmarksToggle();
			}
		}
		/*
		 * Function: activateLandmarksToggle
		 * --------------
		 * This function displays the landmarks and sets the corresponding global variable 
		 * (is_landmarks_layer_displayed) to reflect that its status is "active".
		 */
		function activateLandmarksToggle() {
			is_landmarks_layer_displayed = true;
			$("#landmarks_checkbox_unchecked").css({opacity:0});
			displayLandmarksLayer();
			setAllStationPointIconsOpacity(0.2);
		}
		/*
		 * Function: deactivateLandmarksToggle
		 * --------------
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
		function displayLandmarksLayer() {
			$('#LandmarksLayer').css({left:"0px", right:"auto"});
		}
		function hideLandmarksLayer() {
			$('#LandmarksLayer').css({left:"-99999px", right:"auto"});
		}
		function displayHint() {
			$("#landmarks_toggle_checkbox_hint_container").css({left:"10%",right:"auto"});
			if(!is_landmarks_layer_displayed) {
				$("#landmarks_checkbox_unchecked").css({opacity:0.6});
			}
		}
		function hideHint() {
			$("#landmarks_toggle_checkbox_hint_container").css({left:"-99999px",right:"auto"});
			if(!is_landmarks_layer_displayed) {
				$("#landmarks_checkbox_unchecked").css({opacity:1});
			}
		}
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

		/*
		 * Function: triggerViewshedAnglesToggleEvent
		 * --------------
		 * This function is called when the user clicks on the 'checkbox' for 'View Angles'.
		 * As this 'checkbox' is not actually a checkbox object, the internals of determining
		 * what events to trigger following the clicking of the 'checkbox' is determined in this
		 * function.
		 */
		function triggerViewshedAnglesToggleEvent() {
			if(!is_viewshed_angles_layer_displayed) {
				activateViewshedAnglesToggle();
			} else {
				deactivateViewshedAnglesToggle();
			}
		}
		/*
		 * Function: activateViewshedAnglesToggle
		 * --------------
		 * This function displays the view angles and sets the corresponding global variable 
		 * (is_viewshed_angles_layer_displayed) to reflect that its status is 'active'.
		 */
		function activateViewshedAnglesToggle() {
			is_viewshed_angles_layer_displayed = true;
			displayViewshedAnglesLayer();
			document.getElementById('viewshedangles_checkbox_unchecked').style.opacity = 0;
		}
		/*
		 * Function: deactivateViewshedAnglesToggle
		 * --------------
		 * This function hides the view angles and sets the corresponding global variable 
		 * (is_viewshed_angles_layer_displayed) to reflect that its status is 'inactive'.
		 */
		function deactivateViewshedAnglesToggle() {
			is_viewshed_angles_layer_displayed = false;
			hideViewshedAnglesLayer();
			document.getElementById('viewshedangles_checkbox_unchecked').style.opacity = 1;
		}
		function displayViewshedAnglesLayer() {
			$('#ViewshedAnglesLayer').css({left: "0px", right: "auto"});
		}
		function hideViewshedAnglesLayer() {
			$('#ViewshedAnglesLayer').css({left: "-99999px", right: "auto"});
		}
		function displayHint() {
			$("#viewshedangles_toggle_checkbox_hint_container").css({left:"10%",right:"auto"});
			if(!is_viewshed_angles_layer_displayed) {
				$("#viewshedangles_checkbox_unchecked").css({opacity: 0.6});
			}
		}
		function hideHint() {
			$("#viewshedangles_toggle_checkbox_hint_container").css({left:"-99999px",right:"auto"});
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


	function displayLoadingScreen() {
		$("#loading_screen").css({display:"block"});
	}

	function hideLoadingScreen() {
		$("#loading_screen").css({display:"none"});
	}

	/*
	 * Function: setLoadingScreenDimensions
	 * --------------
	 * 
	 */
	function setLoadingScreenDimensions() {
	 	var div_dimensions = getWindowAdjustedDivDimensions(),
	 		div_width = div_dimensions[0],
			div_height = div_dimensions[1];

		$('#loading_screen').height(div_height);
		$('#loading_screen').width(div_width);

		var offset_to_center_loading_screen_vertically = ($(window).height() - div_height) / 2;
		$('#loading_screen').css({top: offset_to_center_loading_screen_vertically, bottom: "auto"});
	 }

	/*
	 * Function: setContentDimensions
	 * --------------
	 * This function resizes a selection of html objects to fit to the size of the browser
	 * window.
	 */
	function setContentDimensions() {
		var div_dimensions = getWindowAdjustedDivDimensions(),
			div_width = div_dimensions[0],
			div_height = div_dimensions[1];

		
		// set new dimensions of divs
		$('#loading_screen').height(div_height);
		$('#loading_screen').width(div_width);
		$('#map_content_wrapper').height(div_height);
		$('#map_content_wrapper').width(div_width);
		$('#focal').height(div_height);
		$('#focal').width(div_width);
		$('#container').height(div_height);
		$('#container').width(div_width);
		$('#panzoom_parent').height(div_height);
		$('#panzoom_parent').width(div_width);
		$('#panzoom').height(div_height);
		$('#panzoom').width(div_width);
		$('#StationPointIconsSVGLayer').height(div_height);
		$('#StationPointIconsSVGLayer').width(div_width);
		$('#StationPointSVGLayerName').height(div_height);
		$('#StationPointSVGLayerName').width(div_width);
		$('#StationPointPopupDiv').height(div_height);
		$('#StationPointPopupDiv').width(div_width);

		var ViewshedSVGs = document.getElementsByClassName('ViewshedSVG'); // get all viewshed SVGs
		for(var i = 0; i < ViewshedSVGs.length; i++) {
			ViewshedSVGs[i].style.width = div_width+'px';
			ViewshedSVGs[i].style.height = div_height+'px';
		}

		var ViewshedPNGs = document.getElementsByClassName('ViewshedPNG'); // get all viewshed PNGs
		for(var i = 0; i < ViewshedPNGs.length; i++) {
			ViewshedPNGs[i].style.width = div_width+'px';
			ViewshedPNGs[i].style.height = div_height+'px';
		}

		var offset_to_center_map_viewport_vertically = ($(window).height() - div_height) / 2;
		$('#loading_screen').css({top: offset_to_center_map_viewport_vertically, bottom: "auto"});
		$('#map_content_wrapper').css({top: offset_to_center_map_viewport_vertically, bottom: "auto"});
	}

	/*
	 * Function: getWindowAdjustedDivDimensions
	 * --------------
	 * 
	 */
	 function getWindowAdjustedDivDimensions() {
	 	var height = $(window).height(),
			width = $(window).width(),
			div_height,
			div_width;

		if(height < 765) {
			height = 765;
		}
		if(width < 1000) {
			width = 1000;
		}
		
		/* Calculates new dimensions of divs to fit window size while maintaining aspect ratio
		 * aspect ratio is determined by original basemap image size
		 */
		if(width/height > MAP_WIDTH/MAP_HEIGHT) {
			div_height = height;
			div_width = div_height*MAP_WIDTH/MAP_HEIGHT;
		} else {
			div_width = width;
			div_height = div_width*MAP_HEIGHT/MAP_WIDTH;
		}

		return [div_width,div_height];
	 }

	/*
	 * Function: setAllStationPointIconsOpacity
	 * --------------
	 * 
	 */
	function setAllStationPointIconsOpacity(dimmed_opacity) {
		$(".StationPointIcon").css({opacity: dimmed_opacity, zIndex: "3"});
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