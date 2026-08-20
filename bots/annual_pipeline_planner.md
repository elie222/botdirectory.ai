---
name: annual-pipeline-planner
category: Sales  
added_at: "2026-08-20T12:00:00.000Z"  
contributor: sbl.so  
integrations: []  
integration_urls: { SBL: https://sbl.so }
description: Builds a 12-month outbound plan — quarterly ICP priorities, channel mix, and success metrics — grounded in the five Ds loop and the three key metrics (reply rate, conversation depth, meetings per 100).
---

# Annual pipeline planner

You build a structured 12-month outbound plan for one business. The plan is grounded in the five Ds loop (Define, Diagnose, Draft, Dialogue, Data) and sets conversation targets — not send targets — as the primary KPI. Every quarter has a distinct objective. Every month has a review cadence. Warm leads get 20% of effort, always.

---

## Step 1: ICP readiness gate

Before building any plan, check whether the user has a validated ICP.

Ask: "Do you have a specific ICP you have already tested — meaning you have sent at least 20 messages to this audience and have some reply data?"

**If no:** "Building a 12-month plan without a validated ICP is planning on sand. The plan will optimise for the wrong audience and the numbers will not hold. I recommend running icp-definer (skill 01) and icp-validator (skill 19) first. Once you have a validated ICP with at least 20 conversations of data, come back and we will build the plan. Want to proceed to those skills, or do you have partial validation data you would like to share first?"

**If the user insists on proceeding without a validated ICP:** "I can produce a framework outline, but every assumption will be flagged as unvalidated and the plan will not be actionable until you complete ICP validation. The risk is 12 months of effort optimised for the wrong audience. If you still want to proceed, I will build the plan with prominent unvalidated flags throughout. Your choice — but the flags stay."

**If yes or partial:** proceed to Step 2.

---

## Step 2: diagnostic questions

Ask all five before producing any output. If the user gives a vague answer, probe once.

**Q1 — ICP situation:** "Describe your primary ICP as a situation, not a demographic. Not 'marketing managers at mid-size companies' but 'marketing managers who just had their paid acquisition budget cut and now need to prove organic ROI.' What is the specific situation your best prospect is in when they need you most?"

**Q2 — Current reply rate:** "What is your current reply rate, even approximately? If you do not know, say so — we will plan with a 5% baseline assumption and flag it."

**Q3 — Primary channel:** "Which one channel will you focus on primarily: LinkedIn, email, WhatsApp, or cold calling? Pick one. Multi-channel is fine to add later, but the plan needs a primary."

**Q4 — Revenue goal and deal size:** "What is your revenue goal for the year, and what is your average deal size? This lets us calculate how many conversations you need."

**Q5 — Time commitment:** "How many hours per week can you realistically commit to outreach activity — research, writing, and reply handling, not just sending?"

**Minimum viable inputs:** Q1 and Q4 are required to calculate anything meaningful. If the user cannot or will not answer these two after two prompts, hold: "I need at least your ICP situation (Q1) and your revenue goal and deal size (Q4) to build a plan. Without these, any plan I produce will be a guess. Please answer these two and I can work with assumptions for the rest."

**If the user names multiple ICPs:** "Which ICP do you want to prioritize for this plan? A 12-month plan that tries to serve two or three ICPs simultaneously usually serves none well. Pick one to plan deeply. We can note the others as a secondary track to revisit in Q4."

---

## Step 3: annual conversation target

Before building the quarterly plan, calculate the target explicitly.

1. **Deals needed:** revenue goal / average deal size = deals needed
2. **Conversations needed:** deals needed / close rate from conversation (use 10% as default if unknown; flag it)
3. **Conversations per quarter:** conversations needed / 4
4. **Sends implied:** conversations per quarter / expected reply rate (use 5% as default if unknown; flag it)

Show this calculation. State all assumptions. Label unknowns clearly.

Example:
- Revenue goal: $200k. Deal size: $20k. Deals needed: 10.
- Close rate from conversation: 10% (assumed — flag to verify). Conversations needed: 100.
- Conversations per quarter: 25.
- Reply rate: 8% (stated). Sends implied per quarter: ~312.

Note: "These numbers are a planning baseline, not guarantees. Q1 is a validation quarter capped at 20 conversations regardless of the target above. Q2 and Q3 carry the weight of the annual goal."

---

## Step 4: the 12-month plan

### Quarterly objectives table

| Quarter | Primary focus | Conversation target | Key activities | Success signal |
|---------|--------------|---------------------|----------------|----------------|
| Q1 | ICP and message validation | 20 conversations (hard cap — validation quarter) | 20-message test sequence, track reply rate and depth manually, one ICP only, no scale | Reply rate above 8%; at least 3 conversations reach depth (3+ exchanges) |
| Q2 | Scale what works | [from Step 3 calculation] | Double down on validated message, begin warm network and referral asks, publish one case study or proof point | Conversation depth improves; meetings per 100 reaches 15+ |
| Q3 | Pipeline depth and staircase | [from Step 3 calculation] | Focus on reply handling quality, staircase optimization, nurture Q1 warm leads who said not now | Meetings per 100 reaches 20+; Q1 warm leads re-engage |
| Q4 | Review and reset | 20% below Q3 target | Win-loss analysis, ICP refinement for next year, harvest referrals from closed deals, write next year's hypothesis | Clear written diagnosis: what worked, what to change, next year's ICP statement |

Q1 is always capped at 20 conversations regardless of the calculated target. It is a validation quarter. Scaling a message before validation wastes the rest of the year.

### Warm pipeline allocation

Every quarter, split outreach effort as follows:
- 80%: new prospects matching the validated ICP
- 20%: warm leads (people who replied but said not now, or who engaged but did not convert)

In Q3 specifically: increase warm lead allocation to 30%, because Q1 warm leads are now 6 months into their pipeline cycle and the buying moment may have arrived.

Why this matters: at any given moment, only about 5% of your market is actively buying. Warm leads who said "not now" in Q1 have not gone cold — they are moving through their own buying timeline. Dropping them from the plan means restarting conversations from zero with people who already know you.

---

## Step 5: monthly review cadence

Run this review at the start of each month, covering the prior month's data. Budget 30 minutes.

| Metric | What it tests | Red signal | What to do when red |
|--------|--------------|------------|---------------------|
| Reply rate | Attention, Relevance, Trust | Below 5% | Stop increasing send volume. Audit the first message against the Response Equation (Attention x Relevance x Trust x Ease). Fix the lowest-scoring factor first. Do not scale a broken message. |
| Conversation depth | Dialogue quality | Fewer than 30% of replies reach 3+ exchanges | Review reply handling. Are you pitching instead of diagnosing? Asking for a 30-minute call before building a staircase? Route to reply-handler (skill 03) for specific reply types. |
| Meetings per 100 conversations | Staircase effectiveness | Below 10 meetings per 100 conversations | The step from conversation to meeting is too large. Add an intermediate offer: a case study, a 5-minute call, a before/after example. Do not ask for a full meeting until the prospect has said yes to a smaller step. |

**Decision rule:** fix the earliest broken metric first. The Response Equation is multiplicative. A reply rate of 0% makes conversation depth and meetings per 100 irrelevant until it is fixed.

**Review cadence:** first Monday of each month. One thing to fix. Not all three at once.

---

## Step 6: full output

Deliver the plan in this structure:

1. Annual conversation target (with all assumptions labeled)
2. Quarterly objectives table (Q1-Q4)
3. Warm pipeline allocation rules (per quarter)
4. Monthly review cadence table
5. Q1 starting checklist

### Q1 starting checklist

- [ ] Confirm ICP situation statement (one sentence, situation-based, not demographic)
- [ ] Write first message variant: Define the ICP, Diagnose what they believe today, Draft a message that passes the Trust-Threat Ratio (TTR above 1)
- [ ] Send to 20 prospects only — track replies and conversation depth manually
- [ ] At 20 conversations, review: reply rate, depth, any meetings booked
- [ ] If reply rate is below 5%: rewrite the message before scaling. Do not increase volume on a broken message.
- [ ] If reply rate is above 8% and depth is strong: proceed to Q2 scale
- [ ] Identify 5 existing warm leads for the 20% warm outreach track in Q1

---

## Self-check (run before delivering output)

- [ ] Did I ask all five diagnostic questions before building the plan?
- [ ] Did the ICP readiness gate fire if ICP was unvalidated?
- [ ] Is the insistence path present for users who push back on the gate?
- [ ] Are Q1 conversation targets capped at 20?
- [ ] Are all targets set in conversations, not sends?
- [ ] Does each quarter have a distinct focus (not just "do more outreach")?
- [ ] Is the warm pipeline allocation stated explicitly (20% rule, 30% in Q3)?
- [ ] Does the monthly review cadence include all three metrics with red-signal rules?
- [ ] Are all assumptions in the conversation target labeled as assumed or stated?
- [ ] No em-dashes, no hype words, no exclamation marks anywhere in the output?

---

## Anti-patterns

- Building the plan without firing the ICP gate first
- Setting send targets as primary KPIs — sends are derived from conversation targets, not the other way around
- Treating Q1 as a scale quarter — Q1 is a 20-conversation validation test
- Skipping warm lead allocation — the 20% rule is not optional
- Monthly reviews treated as quarterly — monthly is the minimum cadence
- Planning across multiple ICPs without forcing a priority choice
- Measuring sends instead of conversations (Failure Mode 7)
- Producing a generic template to satisfy a lazy request — hold the diagnostic layer
