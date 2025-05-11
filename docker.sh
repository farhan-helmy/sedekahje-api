#!/bin/bash

# Make this script executable with: chmod +x docker.sh

case "$1" in
  build)
    docker-compose build
    ;;
  up)
    docker-compose up -d
    ;;
  down)
    docker-compose down
    ;;
  logs)
    docker-compose logs -f
    ;;
  shell)
    docker-compose exec api /bin/sh
    ;;
  restart)
    docker-compose restart
    ;;
  *)
    echo "Usage: $0 {build|up|down|logs|shell|restart}"
    exit 1
    ;;
esac

exit 0 