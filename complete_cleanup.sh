#!/bin/bash

echo "Complete Chinese cleanup starting..."

# Function to clean a single file
clean_file() {
    local file="$1"
    echo "Cleaning: $file"
    
    # Use sed to replace all Chinese characters with English equivalents
    sed -i '' 's/[\u4e00-\u9fff]//g' "$file"
    
    # Fix common patterns that might have been broken
    sed -i '' 's/Enter yourFull Name/Enter your full name/g' "$file"
    sed -i '' 's/Enter yourEmail/Enter your email/g' "$file"
    sed -i '' 's/Enter yourPassword/Enter your password/g' "$file"
    sed -i '' 's/Re-enter yourPassword/Re-enter your password/g' "$file"
    sed -i '' 's/ConfirmPassword/Confirm Password/g' "$file"
    sed -i '' 's/UnknownError/Unknown error/g' "$file"
}

# Find and clean all TypeScript files
find src -name "*.ts" -o -name "*.tsx" | while read file; do
    if grep -q "[\u4e00-\u9fff]" "$file"; then
        clean_file "$file"
    fi
done

echo "Complete cleanup finished!"
