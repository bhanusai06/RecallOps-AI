# RecallOps AI Live Demo Guide

This document is designed for the presenter. It provides a tight script to successfully demonstrate the power of RecallOps AI to hackathon judges or stakeholders within an incredibly short timeframe.

## The Two-Minute Live Demo Script

*Ensure the Next.js frontend is running. Navigate to the main dashboard.*

**[0:00 - 0:15] The Hook**
"Every year, engineers waste thousands of hours diagnosing the exact same production incidents they solved three months ago. Welcome to RecallOps AI. We eliminate operational amnesia by giving your infrastructure a perfect, continuously evolving memory."

**[0:15 - 0:45] Incident 1: The Cold Start**
*(Click the **Incident 1 (New Issue)** button)*
"Let's simulate a brand new database crash. Watch the pipeline. The system searches our Hindsight Vector Memory but finds nothing. Because it's a new, complex issue, our cascadeflow runtime intelligently routes this to a premium, expensive LLM (GPT-4-turbo) for deep reasoning. 
The AI figures out the root cause, but more importantly, our **Reflection Engine** grades this solution and permanently saves it into our memory bank as a playbook."

**[0:45 - 1:15] Incident 2: The Adaptation**
*(Click the **Incident 2 (Similar Issue)** button)*
"A week later, a similar crash occurs during a database migration. This time, Hindsight finds a 94% match! Because confidence is high, cascadeflow routes the request to a much cheaper, faster model (Gemini-Flash) just to adapt the old playbook to the new context. 
Look at the analytics: we just saved 90% on our API cost, resolution was 3x faster, and our memory quality evolved."

**[1:15 - 1:45] Incident 3: The Cache Hit**
*(Click the **Incident 3 (Identical Issue)** button)*
"Now, the same crash happens again. Hindsight finds a 99% match. cascadeflow realizes this is a known issue and **bypasses the LLM entirely**. Resolution latency drops to 48 milliseconds. Cost drops to zero. The memory is proven flawless."

**[1:45 - 2:00] The Close**
"RecallOps AI remembers the past, optimizes your API budget dynamically, and ensures your team never solves the same problem twice. Thank you."

---

## Five-Minute Technical Walkthrough

If judges ask for a deep dive, guide them through these specific code files:

1. **`backend/app/ai/orchestrator/incident_orchestrator.py`**
   * Show them how the pipeline is orchestrated. Emphasize how `cascade_agent.execute()` dynamically chooses models, rather than hardcoding OpenAI calls.
2. **`backend/app/ai/memory/hindsight_memory_service.py`**
   * Explain how Hindsight acts as the operational memory, specifically retrieving structured incident context rather than raw text.
3. **`backend/app/ai/reflection/reflection_service.py`**
   * This is the "secret sauce". Walk through the heuristics (Specificity, Confidence) that calculate `memory_quality`. Explain how versioning prevents duplicate entries.
4. **`frontend/src/components/dashboard/pipeline-timeline.tsx`**
   * Explain how the frontend reacts to pipeline timings to build trust with the end-user by showing exactly what the AI is thinking.

---

## Frequently Asked Judge Questions

**Q: "Why didn't you just use standard RAG with Pinecone or Weaviate?"**
**A:** "Standard RAG is great for static documentation, but terrible for operational telemetry. We used Hindsight because it's tuned for the specific noise and formatting of incident logs. Furthermore, standard RAG doesn't 'evolve'. Our Reflection Engine grades and versions playbooks before saving them, meaning the memory gets smarter over time."

**Q: "How does the dynamic routing work?"**
**A:** "We integrated the cascadeflow SDK. Instead of hardcoding an API call, we pass it an array of models (e.g., Premium vs Cheap) and set a budget. Based on the confidence score returned by our Hindsight memory search, cascadeflow intelligently selects the cheapest model capable of handling the incident's complexity."

**Q: "What happens if the LLM hallucinates a bad playbook?"**
**A:** "That's exactly why we built the Reflection Engine. Before saving to memory, the system grades the playbook on specificity and safety heuristics. If the AI outputs a vague or low-confidence answer, it receives a low memory quality score and won't be heavily weighted during the next incident."

**Q: "Is this secure? Are you sending customer PII to OpenAI?"**
**A:** "For the scope of this hackathon, we are sending logs directly. In our production roadmap, the Log Parser includes a local, regex-based PII scrubber that sanitizes IP addresses, emails, and secrets before the payload ever leaves the VPC."
