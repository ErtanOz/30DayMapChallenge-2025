


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
