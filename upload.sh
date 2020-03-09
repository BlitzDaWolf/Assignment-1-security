#!/usr/bin/env bash
heroku container:push web --recursive
heroku container:release web --recursive