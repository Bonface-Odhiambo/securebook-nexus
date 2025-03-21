
#!/bin/bash

# Start Spring Boot backend
echo "Starting Spring Boot backend..."
cd server
./mvnw spring-boot:run &
BACKEND_PID=$!
cd ..

# Start React frontend
echo "Starting React frontend..."
npm run dev &
FRONTEND_PID=$!

# Handle shutdown
function cleanup {
  echo "Shutting down services..."
  kill $BACKEND_PID
  kill $FRONTEND_PID
  exit 0
}

trap cleanup SIGINT SIGTERM

echo "Biblios is running!"
echo "Backend: http://localhost:8080/api"
echo "Frontend: http://localhost:5173"
echo "Press Ctrl+C to stop all services"

# Wait for processes
wait $BACKEND_PID $FRONTEND_PID
