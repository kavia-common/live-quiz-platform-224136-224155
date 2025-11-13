#!/bin/bash
cd /home/kavia/workspace/code-generation/live-quiz-platform-224136-224155/quiz_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

