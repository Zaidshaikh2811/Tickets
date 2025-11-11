#!/bin/sh
set -e

hostport="$1"
shift
host=$(echo "$hostport" | cut -d: -f1)
port=$(echo "$hostport" | cut -d: -f2)

echo "⏳ Waiting for Redis at $host:$port..."

until redis-cli -h "$host" -p "$port" ping | grep -q PONG; do
  echo "🚧 Redis not ready yet..."
  sleep 1
done

echo "✅ Redis is ready! Starting service..."
exec "$@"
