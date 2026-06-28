from typing import List

class PreventiveAI:
    """
    Generates preventive recommendations based on incident signatures and categories.
    """

    def generate_recommendations(self, category: str, service: str) -> List[str]:
        recommendations = []

        if category == "OOM":
            recommendations = [
                "Configure Horizontal Pod Autoscaler (HPA) to scale dynamically on CPU/Memory thresholds above 80%.",
                "Increase container memory request limit to 1Gi in Helm templates to allow room for GC overhead.",
                "Adjust JVM max heap size (-Xmx) to occupy 75% of container memory limits to prevent native memory exhaustion.",
                "Implement memory alert notifications triggering when utilization exceeds 90% for 3 consecutive minutes."
            ]
        elif category == "DB_TIMEOUT":
            recommendations = [
                "Increase database connection pool size limits in payment-service configuration (e.g. max_connections=50).",
                "Implement a circuit breaker pattern (e.g. Resilience4j) to fail fast when database queries begin timing out.",
                "Optimize queries by adding indexes to highly queried columns in transactions and sessions database tables.",
                "Establish read replicas to offload read-heavy dashboard and history queries from the primary master database instance."
            ]
        elif category == "CrashLoopBackOff":
            recommendations = [
                "Add Kubernetes liveness and readiness probe delay periods to prevent premature container restarts during credential sync.",
                "Implement a configuration validation check in bootstrap script before launching the main application process.",
                "Enable AWS Vault or HashiCorp Vault secrets synchronizer to ensure credentials are fully hydrated prior to pod scheduling."
            ]
        elif category == "AUTH_FAILURE":
            recommendations = [
                "Implement JWT verification caching locally in auth service memory to prevent token verification network overhead.",
                "Add fallback local JWKS token decryption certificate mechanism if the network public key URL becomes unreachable.",
                "Set up automated monitoring checks verifying the validity of OAuth public certificates every 12 hours."
            ]
        else:
            recommendations = [
                "Configure prometheus alert manager alerts to notify the on-call engineer when error logs increase by 10% in 1 minute.",
                "Integrate canary deployment configurations to route only 10% of traffic to new service images initially.",
                "Run automated end-to-end integration tests on staging environment before promoting code images to production."
            ]

        return recommendations
