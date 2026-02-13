const DUMMY_USER = 'dummy';
const DUMMY_PASS = 'dummy';

/**
 * Parse application/x-www-form-urlencoded body into an object.
 * @param {string} body
 * @returns {Record<string, string>}
 */
function parseForm(body) {
  const out = {};
  for (const pair of (body || '').split('&')) {
    const [k, v] = pair.split('=').map((s) => decodeURIComponent((s || '').replace(/\+/g, ' ')));
    if (k) out[k] = v;
  }
  return out;
}

/**
 * Validate login credentials against the dummy user.
 * @param {string} user
 * @param {string} pass
 * @returns {boolean}
 */
function validateCredentials(user, pass) {
  const u = (user || '').trim();
  const p = (pass || '').trim();
  return u === DUMMY_USER && p === DUMMY_PASS;
}

module.exports = { parseForm, validateCredentials, DUMMY_USER, DUMMY_PASS };
