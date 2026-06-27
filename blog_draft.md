# Can Cheap AI Models Predict Where Expensive Ones Fail?

*A research story: what we tried, what broke, what we learned.*

---

## The Idea

Powerful AI models like Claude and GPT are expensive. Every API call costs money, and nobody knows in advance which questions they'll get wrong.

But what if you could *predict* which questions a frontier model will fail on — before you even ask it? And what if you could do that using a handful of tiny, free, open-source models you run yourself?

That's the question we set out to answer.

The intuition: when small models disagree about an answer, that disagreement might be a signal that the item is genuinely hard — hard enough that even a much more capable model might stumble. Think of it like asking five junior colleagues a question. If they all confidently give the same answer, it's probably easy. If they split 3-2, the question might be tricky even for an expert.

We wanted to know: is that signal real? And can it predict failure on closed models we can't inspect — models where we don't have access to internal states, only to inputs and outputs?

---

## Why This Matters

There's a whole class of existing methods that predict model failure by looking *inside* the model — at its hidden states and internal representations. These work really well. But they have a fatal limitation: they only work on open models where you can access the internals. For closed API models like Claude, GPT, or Gemini, you get the answer and nothing else.

Our approach works from the outside only. No internals needed. That's a real structural advantage — if the signal exists.

---

## Step 1: Build a Controlled Test

Before running any real experiments, we needed a way to verify that our pipeline could even detect a signal when one exists. So we started with **synthetic data** — fake benchmark responses where we *knew* the ground truth.

We generated responses for a fake set of panel models and a fake frontier model. Crucially, we injected a known signal: certain items were made harder for the frontier, and the panel showed more disagreement on exactly those items. Then we ran our experiment and asked: can we detect the signal we just planted?

This is called a **sanity check**, and it's the first thing any well-designed experiment needs. If your method can't detect a signal you deliberately put there, it can't detect anything in the real world either.

**Result: it worked.** We could detect the planted signal. We also confirmed that with *no* injected signal, the test correctly returned "nothing to see here." The pipeline was working correctly.

We established a **calibration floor**: in the null condition (no signal), our test produced a score around 0.012. Any real-data result would need to be well above that to be meaningful.

---

## Step 2: Run on Real Data

We chose **MMLU** as our benchmark — a 14,042-question multiple-choice test covering everything from history to medicine to computer science. Our frontier model: Claude Haiku 4.5, accessed only through the API.

Our panel: four small open-source models (SmolLM2-1.7B, Qwen2.5-0.5B, phi-1.5, gemma-2-2b) that we ran ourselves on a GPU. These models are orders of magnitude cheaper and weaker than Claude — that's the point.

We ran all four panel models on every MMLU question. Then we sent all 14,042 questions to Claude Haiku via the Batches API (at 50% discount, total cost: $2.10).

Our key signal: **minority_ratio** — for each question, what fraction of the panel voted against the majority answer? If 3 models say "A" and 1 says "B", minority_ratio is 0.25.

**First result: a mess.**

When we ran the experiment naively — with our three signals (entropy, minority_ratio, and mean_correct) all included together — we got a negative R². That means the model fit was *worse* than just predicting the average answer for every question.

**What went wrong?**

We had three signals, but they were all saying the same thing in different mathematical languages. `mean_correct` (average panel accuracy per question) was nearly identical to the IRT difficulty parameter we were controlling for. `entropy` and `minority_ratio` were both monotone functions of the same number. When you put near-identical predictors into a regression together, the math breaks down — the coefficients blow up and cancel each other out, producing nonsense.

**Ablation 1: drop the redundant signals.**

We removed `mean_correct` entirely — the code even had a comment warning us it would be collinear, which we had ignored. Then we tested `entropy` and `minority_ratio` together, and still got OLS breakdown (r ≈ 0.99 between them for binary data). So we reduced to a single signal: `minority_ratio` only. It's the most interpretable anyway — "what fraction of the panel disagreed with the majority."

---

## Step 3: The Apparent Signal — and the Trap

With one clean signal, we ran again. The result looked good: ΔR² = 0.053, p < 0.001, well above our calibration floor. The test said **PURSUE**.

We were excited. Then a colleague asked a simple question: *where did your IRT come from?*

IRT (Item Response Theory) is a method borrowed from education testing. It takes many models' responses to the same questions and estimates a per-question "difficulty" score. We were using it as our baseline — the idea being that panel disagreement adds signal *beyond* what question difficulty already explains.

But here's the trap: **both our IRT estimates and our panel signals came from the same five models.** We were asking "does minority_ratio add information beyond IRT?" and both minority_ratio and IRT were computed from the same responses. It's like asking a student to grade their own exam and then checking if their self-assessment adds information beyond their own self-assessment. Of course it does — in a circular way.

This is a subtle methodological flaw that can make a null result look positive.

**Ablation 2: use an independent IRT baseline.**

The fix was clear: IRT needs to come from a completely separate set of models — ones that are neither in our panel nor the frontier we're predicting.

We ran six larger, more diverse open models (ranging from OLMo-1B at 36% accuracy to Qwen2.5-14B at 79% accuracy) on the same MMLU questions. We fitted IRT on those. Now our difficulty baseline came from independent data.

**Result with independent IRT: ΔR² = 0.0000, p = 0.50. KILL.**

The signal was gone. Completely. The panel's minority_ratio added nothing beyond what the leaderboard IRT had already captured.

---

## Step 4: Try a Different Benchmark

Maybe MMLU was the problem. Claude Haiku gets 83% on MMLU — that means only 17% of questions are failures. Predicting rare events is inherently harder, and maybe we just needed more failures to work with.

We switched to **ARC-Challenge**, a reasoning benchmark designed to be harder for AI models.

**Claude Haiku accuracy on ARC-Challenge: 95.3%.** Only 55 failures out of 1,172 questions.

That's *worse*. Haiku is basically perfect at ARC-Challenge.

**Result: KILL.**

The R² baseline was -20.3 — wildly negative, meaning the IRT estimates weren't predicting Haiku's failures at all. The IRT was calibrated for a range of models getting 37-94% accuracy. Haiku's failures happen in a tiny extreme tail that the difficulty estimates can't see.

---

## What We Learned

**1. The shared-data trap is real and easy to miss.** Any experiment that uses the same models to build the IRT baseline and the panel signals will inflate the apparent signal. This isn't obvious in advance. We only caught it by asking where each piece of data came from.

**2. Modern frontier models are too capable for standard benchmarks.** Claude Haiku 4.5 gets 83-95% on MMLU and ARC-Challenge. You can't predict failures when there aren't enough failures to learn from. This isn't a flaw in the method — it's a floor effect in the benchmarks.

**3. Synthetic validation isn't enough.** Our synthetic test confirmed the pipeline worked. But real data has structure that synthetic data doesn't: frontier models clustered near the top of the difficulty range, signal absorption by IRT, benchmark ceiling effects. The sanity check passed; the real test failed.

---

## What Would Need to Be True

For this experiment to work, you'd need:
- A benchmark where the frontier model fails **30-50%** of items (so failures are common enough to predict)
- An IRT baseline from genuinely independent models — not the panel, not the frontier
- A panel with enough diversity that minority_ratio actually varies meaningfully

MMLU-Pro (a harder 10-choice variant of MMLU, where frontier models score ~50-60%) might hit that window. GPQA-Diamond (graduate-level science) might too, though it's gated.

We haven't run those yet. Whether the signal exists in that regime is still an open question.

---

## The Takeaway

We started with a clean idea, built a careful pipeline, and ran the experiment honestly. The signal we thought we found turned out to be an artifact of a shared data source. When we fixed that, the signal disappeared.

That's not a failure — that's how research is supposed to work.

The methodological lesson (don't estimate your baseline and your test signal from the same data) is one that applies far beyond this specific experiment. And the infrastructure we built — running a panel of small models, getting frontier correctness cheaply via the Batches API, fitting IRT from diverse model responses, running a proper permutation test — is reusable for anyone who wants to test this on harder benchmarks.

The question isn't answered. It's just more precisely framed.

---

*Code and experiment details: [github link]. Total cost to run everything: ~$12 in API calls and ~6 GPU-hours on a T4.*
