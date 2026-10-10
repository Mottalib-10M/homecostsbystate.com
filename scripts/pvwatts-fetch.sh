#!/bin/bash
cd "$(dirname "$0")/../.cache-raw/pvwatts" && cp -n ../../research/solar/cities.tsv . 2>/dev/null; true
while IFS=$'\t' read st city lat lon; do
  [ -s "$st.json" ] && grep -q ac_annual "$st.json" && continue
  for try in 1 2 3; do
    curl -s --max-time 60 "https://developer.nlr.gov/api/pvwatts/v8.json?api_key=DEMO_KEY&lat=$lat&lon=$lon&system_capacity=1&azimuth=180&tilt=20&array_type=1&module_type=0&losses=14" -o "$st.json"
    if grep -q ac_annual "$st.json"; then echo "$st ok $(date +%H:%M)"; break; fi
    echo "$st retry $try $(head -c 200 $st.json)"; sleep 400
  done
  sleep 365
done < cities.tsv
echo DONE
