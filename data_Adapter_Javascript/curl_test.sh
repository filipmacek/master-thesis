#!/bin/env bash
curl http://localhost:3000/api/route/1  -X POST -H "Content-Type: application/json" \
  -d '{"timestamp":"sada3","latitude":"45.811764","longitude":"15.998592","index":"3"}'
