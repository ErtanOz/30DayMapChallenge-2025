



[out:json][timeout:60];

// 1. Bounding box for Köln (approx)
{{geocodeArea:Köln}}->.searchArea;

// 2. Select all playground features in this area
(
  node["leisure"="playground"](area.searchArea);
  way["leisure"="playground"](area.searchArea);
  relation["leisure"="playground"](area.searchArea);
);

// 3. Return result as GeoJSON-ready data
out body;
>;
out skel qt;


#Wikidata Script: 

SELECT ?monument ?monumentLabel ?location ?locationLabel ?image ?coord WHERE {
  
  # All monuments in Cologne
  ?monument wdt:P31/wdt:P279* wd:Q4989906.   # instance of / subclass of "monument"
  ?monument wdt:P131 wd:Q365.                # located in Cologne
  
  OPTIONAL { ?monument wdt:P625 ?coord. }    # coordinates
  OPTIONAL { ?monument wdt:P18  ?image. }    # image
  OPTIONAL { ?monument wdt:P276 ?location. } # location object
  
  SERVICE wikibase:label { bd:serviceParam wikibase:language "de,en". }
}
ORDER BY ?monumentLabel
