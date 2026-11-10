# India Lab Reference Ranges

**52 common lab tests with India-specific reference intervals — and per-lab overrides for the tests where Indian labs genuinely disagree.**

This is the part of [Metangy](https://medi-ai-zrn6.onrender.com/) that a general AI cannot replicate: knowing that the *same* result is flagged differently depending on which lab ran the assay.

## The problem this solves

Indian diagnostic chains run different assay platforms, calibrated against different reference standards:

| Lab | Platform | TSH range (mIU/L) |
|---|---|---|
| Thyrocare | Roche Cobas | **0.27 – 4.2** |
| Dr Lal PathLabs | Beckman Coulter Access | **0.4 – 4.5** |
| SRL Diagnostics | Siemens ADVIA Centaur | **0.55 – 4.78** |
| Metropolis | Abbott Architect | **0.35 – 4.94** |

A TSH of **4.4** is *high* at Thyrocare and *normal* at Metropolis. Same blood, same patient, two different answers — and a general-purpose model will confidently give one of them without knowing which lab you used.

## Files

| File | What it is |
|---|---|
| `india_lab_ranges.json` | 52 tests with ranges, units, aliases, sex-specific cut-offs and lab overrides |
| `india_lab_ranges.csv` | The same data, flat, for spreadsheets |
| `interpret.js` | Reference implementation: label + value + sex + lab → low / normal / high |

## Usage

```js
const { interpret } = require('./interpret.js');

interpret('TSH - ULTRASENSITIVE', 4.4, { lab: 'Thyrocare' });
// { status: 'high',   low: 0.27, high: 4.2, source: 'lab', lab: 'thyrocare' }

interpret('TSH - ULTRASENSITIVE', 4.4, { lab: 'Metropolis' });
// { status: 'normal', low: 0.35, high: 4.94, source: 'lab', lab: 'metropolis' }

interpret('FREE T4', 0.78);
// { status: 'low', low: 0.8, high: 1.8, source: 'typical' }
```

`findTest()` matches the label as it appears on a report — `"TSH - ULTRASENSITIVE"`, `"Hb"`, `"S. Creatinine"` — using the aliases in the data.

## Two things to know before you rely on it

**The report always wins.** Every result carries `source: 'typical' | 'lab'`. If you don't know which lab produced the number, you are using a typical range, and the interval printed on the patient's own report is more correct than anything here.

**Units are not normalised.** Platelets are stored per microlitre (`150000–410000`), but Indian reports usually print lakh/µL (`1.5–4.1`). Convert before you compare, or you will get nonsense. This is the most common bug in report parsers.

## Coverage

CBC · diabetes · thyroid · lipids · liver · kidney · vitamins and iron · inflammation — 52 rows, adult ranges, with male/female cut-offs where they differ.

## What this is not

- Not a diagnosis. A value outside a range is a prompt to look, not an answer.
- Not lab-complete. Ranges for four chains are sourced; the rest are typical Indian values and are marked `confidence: "typical"`.
- Not a substitute for the interval on the report.

## Licence

CC-BY-4.0.
