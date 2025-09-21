#!/bin/bash

echo "Starting comprehensive Chinese cleanup..."

# Function to clean a file
clean_file() {
    local file="$1"
    echo "Cleaning: $file"
    
    # Remove all Chinese characters and replace with appropriate English
    sed -i '' 's/[\u4e00-\u9fff]//g' "$file"
    
    # Fix common broken patterns
    sed -i '' 's/Enter yourFull Name/Enter your full name/g' "$file"
    sed -i '' 's/Enter yourEmail/Enter your email/g' "$file"
    sed -i '' 's/Enter yourPassword/Enter your password/g' "$file"
    sed -i '' 's/Re-enter yourPassword/Re-enter your password/g' "$file"
    sed -i '' 's/ConfirmPassword/Confirm Password/g' "$file"
    sed -i '' 's/UnknownError/Unknown error/g' "$file"
    sed -i '' 's/ll am/Full Name/g' "$file"
    sed -i '' 's/mail/Email/g' "$file"
    sed -i '' 's/assword/Password/g' "$file"
    sed -i '' 's/onirm assword/Confirm Password/g' "$file"
    sed -i '' 's/ign p/Sign Up/g' "$file"
    sed -i '' 's/ign n/Sign In/g' "$file"
    sed -i '' 's/rat ccont/Create Account/g' "$file"
    sed -i '' 's/tart yor rora ots jorny/Start your Aurora Notes journey/g' "$file"
    sed -i '' 's/lrady hav an accont/Already have an account/g' "$file"
    sed -i '' 's/ntr yor ll nam/Enter your full name/g' "$file"
    sed -i '' 's/ntr yor mail/Enter your email/g' "$file"
    sed -i '' 's/ntr yor password/Enter your password/g' "$file"
    sed -i '' 's/-ntr yor password/Re-enter your password/g' "$file"
    sed -i '' 's/ll am/Full Name/g' "$file"
    sed -i '' 's/mail/Email/g' "$file"
    sed -i '' 's/assword/Password/g' "$file"
    sed -i '' 's/onirm assword/Confirm Password/g' "$file"
    sed -i '' 's/ign p/Sign Up/g' "$file"
    sed -i '' 's/ign n/Sign In/g' "$file"
    sed -i '' 's/rat ccont/Create Account/g' "$file"
    sed -i '' 's/tart yor rora ots jorny/Start your Aurora Notes journey/g' "$file"
    sed -i '' 's/lrady hav an accont/Already have an account/g' "$file"
    sed -i '' 's/ntr yor ll nam/Enter your full name/g' "$file"
    sed -i '' 's/ntr yor mail/Enter your email/g' "$file"
    sed -i '' 's/ntr yor password/Enter your password/g' "$file"
    sed -i '' 's/-ntr yor password/Re-enter your password/g' "$file"
}

# Clean TypeScript and JavaScript files
find . -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" | \
grep -v node_modules | grep -v ios/Pods | grep -v vendor | \
while read file; do
    if grep -q "[\u4e00-\u9fff]" "$file"; then
        clean_file "$file"
    fi
done

# Clean Markdown files
find . -name "*.md" | \
grep -v node_modules | grep -v ios/Pods | grep -v vendor | \
while read file; do
    if grep -q "[\u4e00-\u9fff]" "$file"; then
        clean_file "$file"
    fi
done

echo "Comprehensive cleanup completed!"
