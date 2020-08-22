#!/bin/env bash
curl http://localhost/api/route/4  -X POST -H "Content-Type: application/json" \
  -d '{"timestamp":"08:30:12 19-08-2020","latitude":"45.811711","longitude":"15.998654","index":"2"}'
