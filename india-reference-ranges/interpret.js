/* Metangy India lab reference ranges - interpreter.
   Given a test id (or the label printed on a report), a value, a sex and
   optionally the lab, work out whether the value is low, normal or high,
   and say which range was used. */

const DATA = require('./india_lab_ranges.json');

const LAB_ALIASES = {
  thyrocare: 'thyrocare', thyro: 'thyrocare',
  'dr lal': 'dr_lal', 'drlal': 'dr_lal', 'lal pathlabs': 'dr_lal', 'dr lal pathlabs': 'dr_lal',
  srl: 'srl',
  metropolis: 'metropolis',
  apollo: 'apollo', max: 'max',
};

function norm(s) {
  return String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

/* Find the test definition for a label that appears on a report. */
function findTest(label, sex) {
  const n = norm(label);
  const pool = DATA.tests.filter((t) => !t.sex || !sex || t.sex === sex);
  let best = null, bestScore = 0;
  for (const t of pool) {
    const names = [t.name, ...t.aliases].map(norm);
    for (const cand of names) {
      let score = 0;
      if (cand === n) score = 100;
      else if (n.startsWith(cand) || cand.startsWith(n)) score = 70;
      else if (n.includes(cand)) score = 50;
      if (score > bestScore) { bestScore = score; best = t; }
    }
  }
  return bestScore >= 50 ? best : null;
}

/* The range actually used: the lab's own if we have it, otherwise typical. */
function rangeFor(test, lab) {
  const key = LAB_ALIASES[norm(lab)];
  if (key && test.lab_overrides[key]) {
    return { ...test.lab_overrides[key], source: 'lab', lab: key };
  }
  return { ...test.range, source: 'typical', lab: null };
}

function interpret(label, value, opts) {
  const o = opts || {};
  const num = parseFloat(String(value).replace(/[^0-9.\-]/g, ''));
  if (!isFinite(num)) return { ok: false, reason: 'not a number' };
  const test = findTest(label, o.sex);
  if (!test) return { ok: false, reason: 'unknown test', label };
  const r = rangeFor(test, o.lab);
  let status = 'normal';
  if (num < r.low) status = 'low';
  else if (num > r.high) status = 'high';
  return {
    ok: true, id: test.id, name: test.name, panel: test.panel, unit: test.unit,
    value: num, status, low: r.low, high: r.high, source: r.source, lab: r.lab,
    note: test.note || '',
  };
}

module.exports = { interpret, findTest, rangeFor, DATA };
