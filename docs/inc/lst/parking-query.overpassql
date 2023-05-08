[out:json][timeout:25];
{{geocodeArea:Moscow}}->.searchArea;
(
    node["amenity"="bicycle_parking"](area.searchArea);
    way["amenity"="bicycle_parking"](area.searchArea);
    relation["amenity"="bicycle_parking"](area.searchArea);
);
out body;
>;
out skel qt;