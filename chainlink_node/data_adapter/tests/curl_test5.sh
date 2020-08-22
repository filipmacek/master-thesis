#!/bin/env bash
curl http://localhost/api/route/4  -X POST -H "Content-Type: application/json" \
  -d '{"timestamp":"08:30:50 19-08-2020","latitude":"45.811764","longitude":"15.997252","index":"5"}'
