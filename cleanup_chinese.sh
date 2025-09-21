#!/bin/bash

# Clean up Chinese characters in all TypeScript files
echo "Cleaning up Chinese characters..."

# Function to replace Chinese text with English
replace_chinese() {
    local file="$1"
    
    # Replace common Chinese text patterns
    sed -i '' 's/错误/Error/g' "$file"
    sed -i '' 's/请填写所有字段/Please fill in all fields/g' "$file"
    sed -i '' 's/密码不匹配/Passwords do not match/g' "$file"
    sed -i '' 's/密码至少需要6个字符/Password must be at least 6 characters/g' "$file"
    sed -i '' 's/注册失败/Sign Up Failed/g' "$file"
    sed -i '' 's/未知错误/Unknown error/g' "$file"
    sed -i '' 's/注册成功/Sign Up Successful/g' "$file"
    sed -i '' 's/请检查您的邮箱以验证账户/Please check your email to verify your account/g' "$file"
    sed -i '' 's/创建账户/Create Account/g' "$file"
    sed -i '' 's/开始您的Aurora Notes之旅/Start your Aurora Notes journey/g' "$file"
    sed -i '' 's/姓名/Full Name/g' "$file"
    sed -i '' 's/输入您的姓名/Enter your full name/g' "$file"
    sed -i '' 's/邮箱/Email/g' "$file"
    sed -i '' 's/输入您的邮箱/Enter your email/g' "$file"
    sed -i '' 's/密码/Password/g' "$file"
    sed -i '' 's/输入您的密码/Enter your password/g' "$file"
    sed -i '' 's/确认密码/Confirm Password/g' "$file"
    sed -i '' 's/再次输入密码/Re-enter your password/g' "$file"
    sed -i '' 's/注册/Sign Up/g' "$file"
    sed -i '' 's/已有账户？/Already have an account?/g' "$file"
    sed -i '' 's/立即登录/Sign In/g' "$file"
    sed -i '' 's/欢迎回来/Welcome Back/g' "$file"
    sed -i '' 's/登录您的Aurora Notes账户/Sign in to your Aurora Notes account/g' "$file"
    sed -i '' 's/登录/Sign In/g' "$file"
    sed -i '' 's/还没有账户？/Don'\''t have an account?/g' "$file"
    sed -i '' 's/立即注册/Sign Up/g' "$file"
    
    # Replace comments
    sed -i '' 's/\/\/ 启用自动刷新token/\/\/ Enable automatic token refresh/g' "$file"
    sed -i '' 's/\/\/ 持久化session/\/\/ Persist session/g' "$file"
    sed -i '' 's/\/\/ 检测URL变化/\/\/ Detect URL changes/g' "$file"
    sed -i '' 's/\/\/ 这些是您的Supabase项目配置/\/\/ These are your Supabase project configurations/g' "$file"
    sed -i '' 's/\/\/ 与AuroraNotes Web项目共享同一个Supabase数据库/\/\/ Shared with AuroraNotes Web project using the same Supabase database/g' "$file"
}

# Find all TypeScript files and process them
find src -name "*.ts" -o -name "*.tsx" | while read file; do
    if grep -q "[\u4e00-\u9fff]" "$file"; then
        echo "Processing: $file"
        replace_chinese "$file"
    fi
done

echo "Chinese cleanup completed!"
