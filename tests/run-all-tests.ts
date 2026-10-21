import { runMatchingEngineTests } from './matching-engine.test';
import { runPrivacyAndSecurityTests } from './privacy-security.test';

async function main() {
  console.log('====================================================');
  console.log('   TWIN: PHASE 2 TEST SUITE EXECUTION');
  console.log('====================================================');

  const matchingResults = runMatchingEngineTests();
  const privacyResults = await runPrivacyAndSecurityTests();

  const totalPassed = matchingResults.passed + privacyResults.passed;
  const totalFailed = matchingResults.failed + privacyResults.failed;
  const allErrors = [...matchingResults.errors, ...privacyResults.errors];

  console.log('\n====================================================');
  console.log(`TEST SUMMARY: ${totalPassed} PASSED, ${totalFailed} FAILED`);
  console.log('====================================================\n');

  if (totalFailed > 0) {
    console.error('Failed test names:');
    allErrors.forEach((e) => console.error(` - ${e}`));
    process.exit(1);
  } else {
    console.log('All automated tests passed successfully! ✨');
    process.exit(0);
  }
}

main().catch((err) => {
  console.error('Test runner fatal error:', err);
  process.exit(1);
});
