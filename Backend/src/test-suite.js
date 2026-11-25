const http = require('http');
const app = require('./app');

async function runTests() {
  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(5097, '127.0.0.1', resolve));
  const baseUrl = 'http://127.0.0.1:5097/api';

  console.log('====================================================');
  console.log('🧪 B.H.U.M.I. COMPREHENSIVE AUTH & SECURITY TEST SUITE');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`✅ [PASS] ${message}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${message}`);
      failed++;
    }
  }

  try {
    // 1. Health check
    const healthRes = await fetch(`${baseUrl}/health`);
    const healthData = await healthRes.json();
    assert(healthRes.status === 200 && healthData.status === 'ok', 'Server health check operational');

    // 2. Reject weak password on registration
    const weakRegRes = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Weak User',
        email: 'weak@example.com',
        phone: '9876543210',
        password: 'weak',
      }),
    });
    assert(weakRegRes.status === 400, 'Registration rejects weak passwords (<8 chars, missing requirements)');

    // 3. Reject invalid phone
    const phoneRegRes = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Bad Phone User',
        email: 'badphone@example.com',
        phone: '12345',
        password: 'ValidPassword123!',
      }),
    });
    assert(phoneRegRes.status === 400, 'Registration rejects invalid phone numbers');

    // 4. Valid Registration
    const validEmail = `citizen.${Date.now()}@example.com`;
    const regRes = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Aarav Sharma',
        email: validEmail,
        phone: '9876543210',
        password: 'StrongAuthPassword123!',
      }),
    });
    const regData = await regRes.json();
    assert(regRes.status === 201 && regData.accessToken, 'Valid registration succeeds with JWT access token');

    // 5. Duplicate Email Rejection
    const dupRes = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Duplicate Aarav',
        email: validEmail,
        phone: '9876543210',
        password: 'StrongAuthPassword123!',
      }),
    });
    assert(dupRes.status === 409, 'Registration rejects duplicate email addresses');

    // 6. Login with Wrong Password
    const wrongLoginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: validEmail,
        password: 'WrongPassword999!',
      }),
    });
    assert(wrongLoginRes.status === 401, 'Login rejects incorrect password with 401 Unauthorized');

    // 7. Login with Correct Password
    const loginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: validEmail,
        password: 'StrongAuthPassword123!',
      }),
    });
    const loginData = await loginRes.json();
    assert(loginRes.status === 200 && loginData.accessToken, 'Login succeeds and returns user + JWT');
    const citizenToken = loginData.accessToken;
    const citizenRefresh = loginData.refreshToken;

    // 8. Call /auth/me with valid Bearer Token
    const meRes = await fetch(`${baseUrl}/auth/me`, {
      headers: { Authorization: `Bearer ${citizenToken}` },
    });
    const meData = await meRes.json();
    assert(meRes.status === 200 && meData.user.email === validEmail, '/auth/me verifies valid JWT token signature');

    // 9. Call /auth/me with NO Token (Must fail)
    const noTokenRes = await fetch(`${baseUrl}/auth/me`);
    assert(noTokenRes.status === 401, '/auth/me strictly blocks unauthenticated requests');

    // 10. Call /auth/me with Fake Tampered Token (Must fail - no bypass!)
    const fakeTokenRes = await fetch(`${baseUrl}/auth/me`, {
      headers: { Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.fake.payload' },
    });
    assert(fakeTokenRes.status === 401, 'Fake/tampered JWT tokens cannot bypass authentication');

    // 11. Role Enforcement (Citizen blocked from Registrar endpoint)
    const roleBlockRes = await fetch(`${baseUrl}/authority/protected-test`, {
      headers: { Authorization: `Bearer ${citizenToken}` },
    });
    assert(roleBlockRes.status === 403, 'Role enforcement: Citizen cannot access Registrar protected route');

    // 12. Test Registrar login and access
    const regLoginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'ramesh.sharma@example.com',
        password: 'Demo1234!',
      }),
    });
    const regLoginData = await regLoginRes.json();
    assert(regLoginRes.status === 200, 'Registrar pre-configured demo account verifies real bcrypt password');

    const registrarAccessRes = await fetch(`${baseUrl}/authority/protected-test`, {
      headers: { Authorization: `Bearer ${regLoginData.accessToken}` },
    });
    assert(registrarAccessRes.status === 200, 'Registrar role successfully accesses Registrar protected route');

    // 13. Token Rotation via /auth/refresh
    const refreshRes = await fetch(`${baseUrl}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: citizenRefresh }),
    });
    const refreshData = await refreshRes.json();
    assert(refreshRes.status === 200 && refreshData.accessToken && refreshData.refreshToken, 'Token rotation issues fresh access + refresh tokens');

    // 14. Replay of Old Revoked Refresh Token (Must fail - token reuse detection!)
    const replayRes = await fetch(`${baseUrl}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: citizenRefresh }),
    });
    assert(replayRes.status === 403, 'Token reuse protection blocks replay of revoked refresh token');

    // 15. Forgot Password Request
    let resetToken = null;
    const origLog = console.log;
    console.log = (...args) => {
      origLog(...args);
      const str = args.join(' ');
      if (str.includes('token=')) {
        const match = str.match(/token=([a-f0-9]+)/);
        if (match) resetToken = match[1];
      }
    };

    const forgotRes = await fetch(`${baseUrl}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: validEmail }),
    });
    console.log = origLog;
    assert(forgotRes.status === 200 && resetToken, 'Forgot password dispatches single-use cryptographic reset token');

    // 16. Reset Password with Token
    const resetRes = await fetch(`${baseUrl}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: resetToken,
        email: validEmail,
        password: 'NewStrongPassword456!',
      }),
    });
    assert(resetRes.status === 200, 'Reset password updates credentials securely');

    // 17. Verify old password fails
    const oldPassRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: validEmail,
        password: 'StrongAuthPassword123!',
      }),
    });
    assert(oldPassRes.status === 401, 'Old password fails after reset');

    // 18. Verify new password succeeds
    const newPassRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: validEmail,
        password: 'NewStrongPassword456!',
      }),
    });
    assert(newPassRes.status === 200, 'New password successfully authenticates user');

    // 19. Single-Use Token Protection (Reset token cannot be used again)
    const reuseResetRes = await fetch(`${baseUrl}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: resetToken,
        email: validEmail,
        password: 'AnotherPassword789!',
      }),
    });
    assert(reuseResetRes.status === 400, 'Password reset token cannot be reused');

    // 20. Logout
    const logoutRes = await fetch(`${baseUrl}/auth/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: refreshData.refreshToken }),
    });
    assert(logoutRes.status === 200, 'Logout successfully revokes server session');

    console.log('\n====================================================');
    console.log(`🎉 TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
    console.log('====================================================\n');
  } catch (err) {
    console.error('Test execution error:', err);
    failed++;
  } finally {
    server.close();
    process.exit(failed > 0 ? 1 : 0);
  }
}

runTests();
