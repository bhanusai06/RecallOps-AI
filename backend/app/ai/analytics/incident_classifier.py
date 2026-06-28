import re
from typing import Optional

class IncidentClassifier:
    """
    Classifies raw production logs into defined incident categories.
    """
    
    CATEGORIES = {
        "OOM": [
            r"oom-kill", r"out of memory", r"oomkilled", r"exit code 137", r"killed process \d+ \(.*\) total-vm"
        ],
        "CrashLoopBackOff": [
            r"crashloopbackoff", r"back-off restarting failed container", r"exit status [1-9]"
        ],
        "DB_TIMEOUT": [
            r"connection timeout", r"db connectionpool exhausted", r"postgresql connection refused", 
            r"database query timeout", r"could not connect to database"
        ],
        "AUTH_FAILURE": [
            r"unauthorized", r"invalid oauth token", r"jwt expired", r"access denied", 
            r"401 unauthorized", r"403 forbidden", r"authentication failed"
        ],
        "NETWORK_FAILURE": [
            r"dns resolution failed", r"connection reset by peer", r"network unreachable", 
            r"socket timeout", r"upstream connect error"
        ],
        "DISK_PRESSURE": [
            r"disk full", r"no space left on device", r"disk pressure", r"io error write failed"
        ],
        "CPU_SPIKE": [
            r"cpu throttling", r"high cpu load", r"load average above threshold"
        ],
        "LATENCY_DEGRADATION": [
            r"slow response time", r"gateway timeout", r"504 gateway timeout", 
            r"duration above threshold", r"p99 latency spike"
        ]
    }

    def classify(self, log_content: str) -> str:
        log_lower = log_content.lower()
        
        # Check matching patterns
        for category, patterns in self.CATEGORIES.items():
            for pattern in patterns:
                if re.search(pattern, log_lower):
                    return category
                    
        return "UNKNOWN"
