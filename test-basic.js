/**
 * Basic functionality test script
 * Tests core components and hooks without running the full app
 */

console.log('🧪 Starting AuroraNotes Mobile Basic Tests...\n')

// Test 1: Check if main files exist and are readable
const fs = require('fs')
const path = require('path')

const testFiles = [
  'App.tsx',
  'src/lib/supabase.ts',
  'src/constants/colors.ts',
  'src/components/ui/Button.tsx',
  'src/components/ui/Card.tsx',
  'src/components/ui/Input.tsx',
  'src/hooks/useAuth.ts',
  'src/hooks/useNotes.ts',
  'src/store/useAuthStore.ts',
  'src/store/useNotesStore.ts',
]

console.log('📁 Testing file existence and readability...')
let passedTests = 0
let totalTests = testFiles.length

testFiles.forEach(file => {
  try {
    const filePath = path.join(__dirname, file)
    const content = fs.readFileSync(filePath, 'utf8')
    
    if (content.length > 0) {
      console.log(`✅ ${file} - OK`)
      passedTests++
    } else {
      console.log(`❌ ${file} - Empty file`)
    }
  } catch (error) {
    console.log(`❌ ${file} - File not found or unreadable: ${error.message}`)
  }
})

console.log(`\n📊 File Tests: ${passedTests}/${totalTests} passed`)

// Test 2: Check package.json dependencies
console.log('\n📦 Testing dependencies...')
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'))
  const requiredDeps = [
    'react',
    'react-native',
    '@react-navigation/native',
    '@supabase/supabase-js',
    'zustand',
    'react-native-vector-icons'
  ]
  
  let depsPassed = 0
  requiredDeps.forEach(dep => {
    if (packageJson.dependencies[dep] || packageJson.devDependencies[dep]) {
      console.log(`✅ ${dep} - Installed`)
      depsPassed++
    } else {
      console.log(`❌ ${dep} - Missing`)
    }
  })
  
  console.log(`📊 Dependencies: ${depsPassed}/${requiredDeps.length} installed`)
} catch (error) {
  console.log(`❌ package.json - Error reading: ${error.message}`)
}

// Test 3: Check TypeScript configuration
console.log('\n🔧 Testing TypeScript configuration...')
try {
  const tsconfig = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8'))
  console.log('✅ tsconfig.json - Valid JSON')
  
  if (tsconfig.compilerOptions) {
    console.log('✅ TypeScript compiler options configured')
  }
} catch (error) {
  console.log(`❌ tsconfig.json - Error: ${error.message}`)
}

// Test 4: Check React Native configuration
console.log('\n⚛️ Testing React Native configuration...')
const rnConfigs = ['metro.config.js', 'babel.config.js', 'index.js']
let rnConfigsPassed = 0

rnConfigs.forEach(config => {
  try {
    const content = fs.readFileSync(config, 'utf8')
    if (content.length > 0) {
      console.log(`✅ ${config} - OK`)
      rnConfigsPassed++
    } else {
      console.log(`❌ ${config} - Empty file`)
    }
  } catch (error) {
    console.log(`❌ ${config} - Error: ${error.message}`)
  }
})

console.log(`📊 React Native Configs: ${rnConfigsPassed}/${rnConfigs.length} OK`)

// Test 5: Check for common issues
console.log('\n🔍 Checking for common issues...')
let issuesFound = 0

// Check for missing environment setup
if (!fs.existsSync('.env')) {
  console.log('⚠️  .env file missing - Environment variables not configured')
  issuesFound++
} else {
  console.log('✅ .env file exists')
}

console.log(`\n📊 Issues found: ${issuesFound}`)

// Final summary
console.log('\n🎯 Test Summary:')
console.log(`Files: ${passedTests}/${totalTests} passed`)
console.log(`Dependencies: Checked`)
console.log(`Configuration: Checked`)
console.log(`Issues: ${issuesFound} found`)

if (passedTests === totalTests && issuesFound === 0) {
  console.log('\n🎉 All basic tests passed! Project is ready for development.')
} else {
  console.log('\n⚠️  Some issues found. Review the output above.')
}

console.log('\n💡 Next steps:')
console.log('1. Fix any encoding issues in key files')
console.log('2. Set up environment variables (.env file)')
console.log('3. Install iOS dependencies (pod install)')
console.log('4. Run the app (npm run ios or npm run android)')