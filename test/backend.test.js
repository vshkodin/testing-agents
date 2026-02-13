const { describe, it } = require('node:test');
const assert = require('node:assert');
const { parseForm, validateCredentials, DUMMY_USER, DUMMY_PASS } = require('../src/lib');

describe('parseForm', () => {
  it('parses single key-value', () => {
    const out = parseForm('a=1');
    assert.strictEqual(out.a, '1');
  });

  it('parses multiple pairs', () => {
    const out = parseForm('username=dummy&password=dummy');
    assert.strictEqual(out.username, 'dummy');
    assert.strictEqual(out.password, 'dummy');
  });

  it('decodes URL-encoded values', () => {
    const out = parseForm('q=hello%20world');
    assert.strictEqual(out.q, 'hello world');
  });

  it('replaces + with space', () => {
    const out = parseForm('q=hello+world');
    assert.strictEqual(out.q, 'hello world');
  });

  it('returns empty object for empty or null body', () => {
    assert.deepStrictEqual(parseForm(''), {});
    assert.deepStrictEqual(parseForm(null), {});
  });

  it('ignores empty key', () => {
    const out = parseForm('=value&a=1');
    assert.strictEqual(out.a, '1');
    assert.strictEqual(Object.prototype.hasOwnProperty.call(out, ''), false);
  });
});

describe('validateCredentials', () => {
  it('accepts dummy/dummy', () => {
    assert.strictEqual(validateCredentials('dummy', 'dummy'), true);
  });

  it('rejects wrong password', () => {
    assert.strictEqual(validateCredentials('dummy', 'wrong'), false);
  });

  it('rejects wrong username', () => {
    assert.strictEqual(validateCredentials('admin', 'dummy'), false);
  });

  it('rejects empty', () => {
    assert.strictEqual(validateCredentials('', ''), false);
  });

  it('trims whitespace and rejects', () => {
    assert.strictEqual(validateCredentials('  dummy  ', '  dummy  '), true);
  });

  it('rejects undefined/null as empty', () => {
    assert.strictEqual(validateCredentials(undefined, DUMMY_PASS), false);
    assert.strictEqual(validateCredentials(DUMMY_USER, null), false);
  });
});
