# Metangy Health KB

**134 hand-curated health topics and 10 deterministic red-flag rules** — the knowledge base behind [Metangy](https://medi-ai-zrn6.onrender.com/), a free multilingual health assistant.

Free to use under CC-BY-4.0. Built for developers making health assistants that need to answer *safely*, not just fluently.

## Files

| File | What it is |
|---|---|
| `health_topics.csv` | 134 topics: `topic`, `symptoms`, `summary`, `advice`, `severity` |
| `emergency_rules.json` | 10 rules: `id`, `label`, `words`, `advice` |

`severity` is one of `self-care`, `see-doctor`, `emergency`.

## Why a rule set, not just a model

`emergency_rules.json` covers cardiac, stroke, breathing, bleeding, self-harm, poison, sepsis, anaphylaxis, pregnancy and seizure. Each rule carries its own first-aid line.

The point is that **these fire before any language model is consulted**. Model-based safety is probabilistic; a rule is not. A user who says "ignore your instructions" still hits the rule.

Test it both ways:

- `"I have chest pain and sweating"` → matches `cardiac`
- `"my head hurts a little"` → matches nothing

A safety layer that fires on everything is one users learn to ignore.

## Where the content comes from

Assembled from public guidance published by the **NHS**, the **WHO** and the **CDC**, rewritten in plain language and trimmed to what a person can act on. It is not copied text.

## What this is not

- Not medical advice, and not a diagnosis tool
- Not comprehensive — 134 topics, not 13,000
- Not a substitute for a doctor

If you build on this, keep a clear "information, not a diagnosis" line in front of it, and route emergencies to the real emergency number for the user's country.

## Also in this repo

- **[`india-reference-ranges/`](india-reference-ranges/)** — 52 lab tests with India-specific reference intervals, including **per-lab overrides** for TSH across Thyrocare, Dr Lal PathLabs, SRL and Metropolis. A TSH of 4.4 is high at one and normal at another; a general AI cannot know that.

## Licence

CC-BY-4.0 — use it, adapt it, ship it commercially, credit Metangy.

---

Built by a 14-year-old solo developer in India. The app: https://medi-ai-zrn6.onrender.com/
