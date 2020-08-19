#!/bin/env bash
curl http://localhost/api/route/4  -X POST -H "Content-Type: application/json" \
  -d '{"timestamp":"08:29:51 19-08-2020","latitude":"45.811494","longitude":"15.998820","index":"3"}'
