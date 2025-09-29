#!/usr/bin/env node

/**
 * Test Runner for AuroraNotes Mobile
 * Runs different types of tests with proper configuration
 */

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

console.log('🧪 AuroraNotes Mobile Test Runner')
console.log('================================\n')

// Test configuration
const testConfigs = {
  unit: {
    pattern: '__tests__/**/*.test.{ts,tsx}',
    description: 'Unit Tests',
    command: 'jest --testPathPattern="__tests__/(components|hooks|utils)"'
  },
  integration: {
    pattern: '__tests__/integration/**/*.test.{ts,tsx}',
    description: 'Integration Tests', 
    command: 'jest --testPathPattern="__tests__/integration"'
  },
  e2e: {
    pattern: '__tests__/e2e/**/*.test.{ts,tsx}',
    description: 'End-to-End Tests',
    command: 'jest --testPathPattern="__tests__/e2e"'
  },
  all: {
    pattern: '__tests__/**/*.test.{ts,tsx}',
    description: 'All Tests',
    command: 'jest'
  }
}

// Function to run tests
function runTests(testType) {
  const config = testConfigs[testType]
  
  if (!config) {
    console.error(`❌ Unknown test type: ${testType}`)
    console.log('Available types: unit, integration, e2e, all')
    process.exit(1)
  }

  console.log(`🚀 Running ${config.description}...`)
  console.log(`Pattern: ${config.pattern}`)
  console.log('')

  try {
    execSync(config.command, { 
      stdio: 'inherit',
      cwd: process.cwd()
    })
    console.log(`✅ ${config.description} completed successfully!`)
  } catch (error) {
    console.error(`❌ ${config.description} failed!`)
    process.exit(1)
  }
}

// Function to check test coverage
function runCoverage() {
  console.log('📊 Running test coverage...')
  console.log('')
  
  try {
    execSync('jest --coverage', { 
      stdio: 'inherit',
      cwd: process.cwd()
    })
    console.log('✅ Coverage report generated!')
  } catch (error) {
    console.error('❌ Coverage test failed!')
    process.exit(1)
  }
}

// Function to run linting
function runLint() {
  console.log('🔍 Running ESLint...')
  console.log('')
  
  try {
    execSync('npm run lint', { 
      stdio: 'inherit',
      cwd: process.cwd()
    })
    console.log('✅ Linting passed!')
  } catch (error) {
    console.error('❌ Linting failed!')
    process.exit(1)
  }
}

// Function to run type checking
function runTypeCheck() {
  console.log('🔧 Running TypeScript type check...')
  console.log('')
  
  try {
    execSync('npx tsc --noEmit', { 
      stdio: 'inherit',
      cwd: process.cwd()
    })
    console.log('✅ Type checking passed!')
  } catch (error) {
    console.error('❌ Type checking failed!')
    process.exit(1)
  }
}

// Main execution
const args = process.argv.slice(2)
const command = args[0] || 'all'

switch (command) {
  case 'unit':
  case 'integration': 
  case 'e2e':
  case 'all':
    runTests(command)
    break
    
  case 'coverage':
    runCoverage()
    break
    
  case 'lint':
    runLint()
    break
    
  case 'typecheck':
    runTypeCheck()
    break
    
  case 'full':
    console.log('🔄 Running full test suite...')
    console.log('')
    runLint()
    runTypeCheck()
    runTests('all')
    runCoverage()
    break
    
  default:
    console.log('📖 Usage: node test-runner.js [command]')
    console.log('')
    console.log('Commands:')
    console.log('  unit        - Run unit tests only')
    console.log('  integration - Run integration tests only')
    console.log('  e2e         - Run end-to-end tests only')
    console.log('  all         - Run all tests (default)')
    console.log('  coverage    - Run tests with coverage report')
    console.log('  lint        - Run ESLint')
    console.log('  typecheck   - Run TypeScript type checking')
    console.log('  full        - Run lint + typecheck + tests + coverage')
    console.log('')
    console.log('Examples:')
    console.log('  node test-runner.js unit')
    console.log('  node test-runner.js full')
    break
}
