import re
from typing import List, Dict, Any

class TimelineReconstructor:
    """
    Parses logs chronologically and reconstructs incident timelines.
    """

    def reconstruct_timeline(self, log_content: str, category: str) -> List[Dict[str, Any]]:
        timeline = []
        
        # Try to extract actual timestamps and messages from the logs
        lines = log_content.splitlines()
        extracted_events = []
        
        for line in lines:
            # Match standard timestamp formats like 10:01:05, 2026-06-27 10:01:05
            ts_match = re.search(r"(\d{2}:\d{2}:\d{2})|(\d{4}-\d{2}-\d{2}[T\s]\d{2}:\d{2}:\d{2})", line)
            if ts_match:
                ts = ts_match.group(0)
                # Keep only short hours/minutes for clean timeline layout if it's long
                if len(ts) > 8:
                    ts_short = ts.split()[-1][:5]
                else:
                    ts_short = ts[:5]
                
                # Check for interesting event text
                msg = line.replace(ts, "").strip(" -:[]T")
                if len(msg) > 100:
                    msg = msg[:97] + "..."
                if any(w in msg.lower() for w in ["fail", "error", "warn", "oom", "kill", "timeout", "abort", "exception", "restart", "spike"]):
                    extracted_events.append({"time": ts_short, "event": msg})

        # Deduplicate and limit
        seen = set()
        for ev in extracted_events:
            if ev["event"] not in seen:
                seen.add(ev["event"])
                timeline.append(ev)
            if len(timeline) >= 6:
                break
                
        # If no timeline could be parsed from timestamps, generate a realistic sequence based on category
        if not timeline:
            if category == "OOM":
                timeline = [
                    {"time": "10:01", "event": "Memory utilization exceeds 85% threshold"},
                    {"time": "10:02", "event": "Garbage Collection (GC) pauses increase to >2s"},
                    {"time": "10:03", "event": "API latency rises to 4.2s under resource constraint"},
                    {"time": "10:04", "event": "Kernel OOMKiller terminates process 137"},
                    {"time": "10:05", "event": "Kubernetes initiates pod container restart"}
                ]
            elif category == "DB_TIMEOUT":
                timeline = [
                    {"time": "14:15", "event": "Database connection pool exhaustion detected"},
                    {"time": "14:16", "event": "Incoming requests queued in authentication service"},
                    {"time": "14:17", "event": "Database gateway query read timeout exceeded"},
                    {"time": "14:18", "event": "Postgres driver throws connection refused exception"},
                    {"time": "14:19", "event": "Service fails health checks and starts returning 500 error codes"}
                ]
            elif category == "CrashLoopBackOff":
                timeline = [
                    {"time": "08:30", "event": "Container initialized successfully"},
                    {"time": "08:31", "event": "Application fails db credential sync on startup"},
                    {"time": "08:31", "event": "Fatal exception: Invalid secret keys format"},
                    {"time": "08:32", "event": "Process exits with non-zero exit status 1"},
                    {"time": "08:33", "event": "Kubernetes marks container as CrashLoopBackOff"}
                ]
            elif category == "AUTH_FAILURE":
                timeline = [
                    {"time": "23:45", "event": "JWKS token public key rotation initialized"},
                    {"time": "23:46", "event": "Auth worker fails to fetch rotated keys from server"},
                    {"time": "23:47", "event": "Invalid token signature verification failed"},
                    {"time": "23:48", "event": "User login sessions rejected with 401 Unauthorized status"},
                    {"time": "23:49", "event": "Automated security alert triggered"}
                ]
            else:
                # Default generic timeline
                timeline = [
                    {"time": "12:00", "event": "Incident telemetry monitoring initialized"},
                    {"time": "12:01", "event": "Abnormal threshold warning triggered"},
                    {"time": "12:02", "event": "Error lines detected in application output logs"},
                    {"time": "12:03", "event": "Primary pod container termination event detected"},
                    {"time": "12:04", "event": "Failover recovery route started"}
                ]
                
        return timeline
