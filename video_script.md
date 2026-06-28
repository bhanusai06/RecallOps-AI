# RecallOps AI Demo Video Script (3 Minutes)

**Presenter:** [Your Name]
**Length:** ~3 minutes
**Format:** Screen recording with voiceover

---

## 1. Quick Intro (0:00 - 0:30)

**[Screen: Show the Next.js Dashboard homepage at http://localhost:3000]**

"Hey everyone, I'm [Your Name]. Today I'm demoing RecallOps AI, an intelligent incident response assistant designed to eliminate operational amnesia in engineering teams. Rather than treating every crash as a brand new issue and wasting money on expensive model calls, RecallOps uses Hindsight to remember past resolutions and cascadeflow to optimize API routing dynamically."

---

## 2. The Problem (0:30 - 1:00)

**[Screen: Open `backend/app/ai/orchestrator/incident_orchestrator.py` in the IDE]**

"Normally, SREs solve the same connection pool or out-of-memory errors repeatedly. Traditional AI agents just send the raw log dump straight to GPT-4-turbo every single time. 

That means during a high-severity alert storm, you face 3-second latencies and massive API bills. Plus, the agent doesn't learn. Each run is completely stateless."

---

## 3. The Live Demo (1:00 - 2:30)

**[Screen: Switch back to the browser dashboard. Click the Monday: "Incident 1 (New Issue)" button]**

"Let's see it in action. Here is Day 1. A new database timeout log is uploaded. Hindsight searches the vector database and finds no match. Because memory confidence is low, cascadeflow routes the request to GPT-4-turbo. The analysis finishes, and our Reflection Engine evaluates the playbook quality and stores it in Hindsight as a memory document. This cold start cost us 4.5 cents and took 3.2 seconds."

**[Screen: Click the Tuesday: "Incident 2 (Similar Issue)" button]**

"Now, on Day 2, a similar database crash occurs during a migration. This time, Hindsight finds a 94% similarity match. Because match confidence is high, cascadeflow dynamically routes the request to Gemini-Flash to adapt the old playbook to the new migration context. Look at the metrics: latency dropped to 860ms, and we saved over 97% on API cost."

**[Screen: Click the Wednesday: "Incident 3 (Identical Issue)" button]**

"On Day 3, the exact same crash occurs. Hindsight detects a 99% match. cascadeflow realizes the memory is highly verified, bypasses LLM generation entirely, and instantly returns the playbook. Resolution latency falls to 48ms at $0.00 API cost."

---

## 4. Key Takeaway (2:30 - 3:00)

**[Screen: Show the Analytics section of the dashboard showing cost savings and quality charts]**

"The big takeaway here is that AI agents in production must have memory and runtime governance. By combining Hindsight's memory lifecycle (retain, recall, reflect) with cascadeflow's routing engine, we created a system that gets faster, smarter, and cheaper the more you use it. 

You can find the code and implementation details in our GitHub repository. Thanks for watching!"
