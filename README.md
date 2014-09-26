Grand Canyon Interactive Map
============================

> This web-based, interactive map of the Grand Canyon was developed as part of a parent project in a digital humanities lab at Stanford University. It serves as a portal for the reader to explore a slideshow of 41 landscape photographs of the Grand Canyon taken by Henry Peabody (a prominent commercial photographer during his time) circa 1905, and seamlessly links with essays written for the parent project to allow the reader to spatially orient themselves in the Grand Canyon as they peruse through the photographs and the essays. The interactive map features two exploration modes: station point mode and location mode. Descriptions of the functionality of each mode are provided below. 

>More information about the parent project may be found at [http://web.stanford.edu/group/spatialhistory/cgi-bin/site/project.php?id=1061](http://web.stanford.edu/group/spatialhistory/cgi-bin/site/project.php?id=1061).

## Terminology

To go further into the details of the interactive map, some definition of terminology is required.

__Station Point__: The location believed to be where Peabody took a respective photo; depicted as a numbered, red-colored circle on the map.
__Viewshed__: Areas of the map visible from a photo (station point); depicted as red shaded areas on the map.

## Interactive Modes

### Station Point Mode

In this mode, the user explores each of the photographs individually. When the cursor is hovered over a station point, the corresponding viewshed lights up to display the areas of the map that can be seen in the photograph associated with the station point and the corresponding photo and its title is displayed. Clicking on the station point will bring up a larger version of the photo, and clicking on the photo will link the user to the corresponding photo module hosted on the parent project's website.

>To find these station points' locations on the map, the team I worked with utilized sophisticated software to match the geographical characteristics found in the photograph with existing geographical data of the Grand Canyon; the placement of viewsheds on the map was also done in a similar fashion.

Note: not all station points have corresponding viewsheds.

### Location Mode

In this mode, when the user moves the cursor around the map, if the location (in the Grand Canyon) that the cursor is pointing to can be seen from one of the 41 photographs taken by Peabody, the corresponding station point and viewshed will light up. If the location can be seen from more than one photograph, all the relevant station points and viewsheds will light up. Clicking on any location that can be seen from at least one photograph will bring up a popup that displays links to modules of the relevant photos hosted on the parent project's website.

>To find all the photographs in which a particular location on the map can be seen, the viewsheds (originally in PNG format) were converted to SVGs and placed at the top of the CSS stack when location mode is activated. This allowed for the detection of the presence of any viewshed at the location of the cursor; however, if one viewshed overlaps another at the location of the cursor, the straightforward approach of checking for a viewshed at the location of the cursor (i.e. using _elementFromPoint_) will ignore the viewshed beneath. To correct for this behavior, each viewshed's SVG is placed at a different z-index layer, and at each cursor location, a function is executed to shuffle through all 34 z-index layers to determine which viewsheds are present at the cursor's location. (A viewshed consists of multiple red shaded areas on the map, corresponding to the areas of the map that can be seen from the photo associated with the viewshed; a viewshed is present at the cursor's position if the cursor's location is within one of these red shaded areas.)

>The strategy of shuffling through all of the viewsheds' SVGs at different z-index layers is indeed not very scalable. It is definitely not advisable to stick with this approach if there are 1000 viewsheds to shuffle through every time a _mousemove_ event is triggered. However, as the parent project will only be concerned with 34 viewsheds even as it continues to evolve, this implementation is viable and works well in practice. Alternatively, one could think of pre-processing a separate SVG layer that is divided up into SVG paths where each path corresponds to a combination of viewsheds present at that location. However, due to constraints in time and personnel, this alternate approach was not feasible.