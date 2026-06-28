import re
from datetime import datetime
from typing import Dict, Any

class SignatureExtractor:
    """
    Extracts structured signatures from raw incident log files.
    """

    def extract_signature(self, log_content: str, default_env: str = "production", default_service: str = "unknown") -> Dict[str, Any]:
        log_lower = log_content.lower()

        # 1. Exit code extraction
        exit_code = None
        exit_match = re.search(r"(?:exit code|exit status|status code|code)\s*[:=]?\s*(\d+)", log_lower)
        if exit_match:
            exit_code = int(exit_match.group(1))
        elif "oom-kill" in log_lower or "oomkilled" in log_lower:
            exit_code = 137

        # 2. Resource type detection
        resource_type = "service"
        if any(w in log_lower for w in ["pod", "k8s", "kubernetes", "kube"]):
            resource_type = "kubernetes_pod"
        elif any(w in log_lower for w in ["db", "database", "postgres", "mysql", "redis", "query"]):
            resource_type = "database_instance"
        elif any(w in log_lower for w in ["gateway", "ingress", "nginx", "proxy", "dns"]):
            resource_type = "network_gateway"
        elif any(w in log_lower for w in ["disk", "storage", "volume", "ebs"]):
            resource_type = "storage_volume"

        # 3. Memory limit extraction
        memory_limit = None
        mem_match = re.search(r"(\d+(?:mi|gi|mb|gb))", log_content, re.IGNORECASE)
        if mem_match:
            memory_limit = mem_match.group(1)

        # 4. Restart count extraction
        restart_count = 0
        restart_match = re.search(r"restart(?:s|\s+count)?\s*[:=]?\s*(\d+)", log_lower)
        if restart_match:
            restart_count = int(restart_match.group(1))

        # 5. Severity detection
        severity = "medium"
        if any(w in log_lower for w in ["fatal", "critical", "oom", "panic", "emergency"]):
            severity = "critical"
        elif any(w in log_lower for w in ["error", "fail", "exception", "high"]):
            severity = "high"
        elif any(w in log_lower for w in ["warn", "warning"]):
            severity = "medium"
        elif any(w in log_lower for w in ["info", "debug", "low"]):
            severity = "low"

        # 6. Affected service extraction
        affected_service = default_service
        service_match = re.search(r"(?:service|app|module)\s*[:=]?\s*([a-zA-Z0-9\-_]+)", log_content, re.IGNORECASE)
        if service_match and service_match.group(1).lower() not in ["null", "none", "unknown", "service"]:
            affected_service = service_match.group(1).lower()
        elif default_service == "unknown":
            # Guess from log context
            if "payment" in log_lower:
                affected_service = "payment-service"
            elif "auth" in log_lower:
                affected_service = "auth-worker"
            elif "checkout" in log_lower:
                affected_service = "checkout-ui"
            elif "notify" in log_lower or "notification" in log_lower:
                affected_service = "notification-svc"

        # 7. Environment
        environment = default_env
        env_match = re.search(r"(?:env|environment)\s*[:=]?\s*([a-zA-Z0-9\-_]+)", log_content, re.IGNORECASE)
        if env_match and env_match.group(1).lower() in ["production", "staging", "development", "prod", "dev"]:
            val = env_match.group(1).lower()
            environment = "production" if val in ["prod", "production"] else "development" if val in ["dev", "development"] else val

        # 8. Timestamp extraction
        timestamp = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
        ts_match = re.search(r"(\d{4}-\d{2}-\d{2}[T\s]\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})?)", log_content)
        if ts_match:
            timestamp = ts_match.group(1)

        return {
            "exit_code": exit_code,
            "resource_type": resource_type,
            "memory_limit": memory_limit,
            "restart_count": restart_count,
            "environment": environment,
            "severity": severity,
            "affected_service": affected_service,
            "timestamp": timestamp
        }
