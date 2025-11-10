#!/bin/sh
set -e

hostport="$1"
shift

host=$(echo "$hostport" | cut -d: -f1)
port=$(echo "$hostport" | cut -d: -f2)

echo "⏳ Waiting for $host:$port to be ready..."

until nc -z "$host" "$port"; do
  echo "🚧 Redis not ready yet... retrying"
  sleep 1
done

echo "✅ $host:$port is up! Starting service..."
exec "$@"
