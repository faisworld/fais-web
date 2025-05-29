#!/bin/bash

# This script sets up a cron job to automatically generate blog articles
# It should be run with administrator privileges

# Get the absolute path to the project directory
PROJECT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )/.."
cd "$PROJECT_DIR"

# Check if node is installed
if ! command -v node &> /dev/null; then
  echo "Node.js is not installed. Please install Node.js and try again."
  exit 1
fi

# Check if the required script exists
if [ ! -f "$PROJECT_DIR/scripts/automated-article-generation.mjs" ]; then
  echo "The automated article generation script does not exist at $PROJECT_DIR/scripts/automated-article-generation.mjs"
  exit 1
fi

# Create log directory if it doesn't exist
mkdir -p "$PROJECT_DIR/logs"

# Create or update the cron job
# Run every day at 2:00 AM
CRON_JOB="0 2 * * * cd $PROJECT_DIR && /usr/bin/node scripts/automated-article-generation.mjs >> logs/article-generation.log 2>&1"

# Check if the cron job already exists
EXISTING_CRON=$(crontab -l 2>/dev/null | grep -F "automated-article-generation.mjs")

if [ -z "$EXISTING_CRON" ]; then
  # Add the new cron job
  (crontab -l 2>/dev/null; echo "$CRON_JOB") | crontab -
  echo "Cron job added successfully. Articles will be generated daily at 2:00 AM."
else
  echo "A cron job for article generation already exists. No changes were made."
fi

# Display helpful information
echo ""
echo "=== Article Generation System Setup ==="
echo ""
echo "The article generation system will create new blog posts automatically."
echo ""
echo "To manually run the article generation:"
echo "  cd $PROJECT_DIR && node scripts/automated-article-generation.mjs"
echo ""
echo "To view logs:"
echo "  cat $PROJECT_DIR/logs/article-generation.log"
echo ""
echo "To disable the automatic generation:"
echo "  crontab -e # Then remove the line with automated-article-generation.mjs"
echo ""
