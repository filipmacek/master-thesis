#!/bin/env bash
curl http://localhost/api/route/4  -X POST -H "Content-Type: application/json" \
  -d '{"timestamp":"08:29:33 19-08-2020","latitude":"45.811885","longitude":"15.998536","index":"1"}'
