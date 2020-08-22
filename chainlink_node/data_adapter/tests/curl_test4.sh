#!/bin/env bash
curl http://localhost/api/route/4  -X POST -H "Content-Type: application/json" \
  -d '{"timestamp":"08:30:30 19-08-2020","latitude":"45.811189","longitude":"15.997602","index":"4"}'
