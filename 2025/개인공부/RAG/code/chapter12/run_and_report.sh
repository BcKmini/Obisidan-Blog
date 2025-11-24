#!/bin/bash

# Set the base directory and export it
export BASE_DIR="."

export TASK_CONTENT="カレーライスの作り方"

# Create a timestamp for this run
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# Create a directory for logs under tmp
TMP_DIR="tmp"
LOGS_DIR="${TMP_DIR}/execution_logs_${TIMESTAMP}"
mkdir -p "$LOGS_DIR"

# Function to run a single main.py file
run_main() {
    module_name=$1
    log_file="$LOGS_DIR/${module_name//\//_}_output.log"
    error_log="$LOGS_DIR/${module_name//\//_}_error.log"
    execute_module="$module_name.main"

    echo "Running $execute_module"
    start_time=$(date +%s)
    if ! poetry run python -m "$execute_module" --task "$TASK_CONTENT" > "$log_file" 2>"$error_log"; then
        end_time=$(date +%s)
        duration=$((end_time - start_time))
        echo "Error in $execute_module (Duration: ${duration}s)" >> "$LOGS_DIR/error_summary.txt"
        echo "See $error_log for details" >> "$LOGS_DIR/error_summary.txt"
        echo "-----------------------------------------" >> "$LOGS_DIR/error_summary.txt"
        return 1
    else
        end_time=$(date +%s)
        duration=$((end_time - start_time))
        echo "Success: $execute_module (Duration: ${duration}s)" >> "$LOGS_DIR/success_summary.txt"
        [ -s "$error_log" ] || rm "$error_log"  # Remove error log if it's empty
        return 0
    fi
}

export -f run_main
export LOGS_DIR

# Find all directories containing main.py
DIRS=$(find "$BASE_DIR" -type f -name "main.py" -exec dirname {} \; | sort -u)

# Convert directories to module names
MODULES=$(echo "$DIRS" | sed "s|$BASE_DIR/||g" | tr '/' '.')

# Run all main.py files in parallel
echo "$MODULES" | parallel --jobs 0 --line-buffer run_main

# Generate final report
{
    echo "Execution Report (${TIMESTAMP})"
    echo "==============================="
    echo
    echo "Successful Executions:"
    echo "----------------------"
    if [ -f "$LOGS_DIR/success_summary.txt" ]; then
        cat "$LOGS_DIR/success_summary.txt"
    else
        echo "No successful executions"
    fi
    echo
    echo "Failed Executions:"
    echo "------------------"
    if [ -f "$LOGS_DIR/error_summary.txt" ]; then
        cat "$LOGS_DIR/error_summary.txt"
    else
        echo "No failed executions"
    fi
} > "$LOGS_DIR/final_report.txt"

echo "All main.py files have been executed. Check $LOGS_DIR for logs and reports."
echo "Final report is available at $LOGS_DIR/final_report.txt"