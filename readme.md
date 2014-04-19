GOOGLE GEOCHART VISUALIZATION API VIEWER
========================================

A weekend hack towards some erstwhile goal, of creating bare-bones interface for showing data from in-domain JSP on the Google GeoChart Visualization API with intelligent pagination/history and drill-down into land mass.

Overview
---------
* Getting the trends data from the server at <APP-URL>/data/getTrends.jsp?q=code
* code is:
 * * - world
 * ddd – 3 digit continent/subcontinent-code as given on [Google GeoChart](https://developers.google.com/chart/interactive/docs/gallery/geochart)
 * ww – 2 character ISO3166 Country code, as supported
 * ww – 2 character ISO3166-2 State code – for not only US, but for the all countries. If the data is given, it can be shown over all countries.
* Drill down of the current area viewed, presented as “World -> Sub Continent -> Continent -> Country -> State” for all countries.
* Functionality for going “UP” or “BACK” and also “FWD” in the areas viewed till now.
 * UP – Shows the data for the enclosing area. Disabled when there is no higher enclosing area, i.e. until it pans out till the “World”.
 * BACK – Shows the previous area viewed. Disabled when there are no previous views.
 * FWD – Shows the next area viewed. Disabled when there is no next item, i.e. the recent most view is shown.
* Map areas are clickable, and clicking on any area makes a request to the server with that area’s supported ISO3166 code. This makes navigation easy.

Plain old JavaScript (not even jQuery B|), CSS, HTML only. Just get it and run it.
