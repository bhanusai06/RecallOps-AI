from typing import Optional

class ChangeDetector:
    """
    Detects deployments, configuration changes, version updates, or infrastructure modifications.
    """

    def detect_changes(self, service: str, category: str) -> str:
        # Standard simulated changes based on services/categories to feel realistic
        if service == "payment-service" or "payment" in service.lower():
            return "Deployment v2.4.1 (updated checkout payment gateway integrations) happened 7 minutes before the incident."
        elif service == "auth-worker" or "auth" in service.lower():
            return "OAuth JWKS token rotation secrets were updated in ConfigMap 12 minutes before the incident."
        elif service == "checkout-ui" or "checkout" in service.lower():
            return "Vite web client compiled files were deployed to Vercel CDN 15 minutes before the incident."
        elif category == "DB_TIMEOUT":
            return "Database connection pool scale-down policy was applied via AWS AutoScaling 4 minutes before the incident."
        elif category == "OOM":
            return "JVM maximum heap size memory limits were reduced from 1024Mi to 512Mi in Helm values 10 minutes before the incident."
        
        return "No recent system deployment or configuration changes detected in the 30-minute window prior to the incident."
