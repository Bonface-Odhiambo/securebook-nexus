
#!/bin/bash

# Terminal colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting Biblios Application...${NC}"

# Check if we need to run the backend
if [ "$1" == "frontend-only" ]; then
  echo -e "${BLUE}Starting frontend only...${NC}"
  npm run dev
else
  # Start the frontend and backend concurrently
  echo -e "${BLUE}Starting both frontend and backend...${NC}"
  
  # Check if Maven is installed
  if ! command -v mvn &> /dev/null; then
    echo -e "${RED}Maven is not installed. Please install Maven to run the backend.${NC}"
    exit 1
  fi
  
  # Start the backend in the background
  echo -e "${GREEN}Starting Spring Boot backend...${NC}"
  cd server && mvn spring-boot:run &
  BACKEND_PID=$!
  
  # Wait a moment for the backend to start
  sleep 5
  
  # Start the frontend
  echo -e "${GREEN}Starting React frontend...${NC}"
  cd .. && npm run dev &
  FRONTEND_PID=$!
  
  # Handle Ctrl+C to kill both processes
  trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT
  
  # Wait for both processes to finish
  wait $BACKEND_PID $FRONTEND_PID
fi

echo -e "${GREEN}Biblios application stopped.${NC}"
