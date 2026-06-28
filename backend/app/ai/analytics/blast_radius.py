from typing import Dict, Any

class BlastRadiusMapper:
    """
    Maps affected systems and downstream/upstream dependencies as a graph.
    """

    def map_blast_radius(self, service: str, category: str) -> Dict[str, Any]:
        nodes = []
        edges = []

        # Build custom service dependency graph
        if "auth" in service.lower():
            nodes = [
                {"id": "user-login", "label": "Client Login", "status": "down"},
                {"id": "auth-worker", "label": "Auth Service (Root)", "status": "failed"},
                {"id": "payment-service", "label": "Payment Service", "status": "degraded"},
                {"id": "checkout-ui", "label": "Checkout Frontend", "status": "degraded"}
            ]
            edges = [
                {"source": "user-login", "target": "auth-worker"},
                {"source": "auth-worker", "target": "payment-service"},
                {"source": "payment-service", "target": "checkout-ui"}
            ]
        elif "payment" in service.lower() or "checkout" in service.lower():
            nodes = [
                {"id": "checkout-ui", "label": "Checkout Frontend", "status": "degraded"},
                {"id": "payment-service", "label": "Payment Service (Root)", "status": "failed"},
                {"id": "database", "label": "Postgres DB", "status": "healthy"},
                {"id": "notification-svc", "label": "Notification Svc", "status": "degraded"}
            ]
            edges = [
                {"source": "checkout-ui", "target": "payment-service"},
                {"source": "payment-service", "target": "database"},
                {"source": "payment-service", "target": "notification-svc"}
            ]
        elif "db" in service.lower() or category == "DB_TIMEOUT":
            nodes = [
                {"id": "database", "label": "Postgres Cluster (Root)", "status": "failed"},
                {"id": "auth-worker", "label": "Auth Service", "status": "degraded"},
                {"id": "payment-service", "label": "Payment Service", "status": "degraded"},
                {"id": "checkout-ui", "label": "Checkout UI", "status": "degraded"}
            ]
            edges = [
                {"source": "database", "target": "auth-worker"},
                {"source": "database", "target": "payment-service"},
                {"source": "payment-service", "target": "checkout-ui"}
            ]
        else:
            # Generic graph
            nodes = [
                {"id": service, "label": f"{service.capitalize()} (Root)", "status": "failed"},
                {"id": "gateway", "label": "API Gateway", "status": "degraded"},
                {"id": "user", "label": "Web Client", "status": "degraded"}
            ]
            edges = [
                {"source": service, "target": "gateway"},
                {"source": "gateway", "target": "user"}
            ]

        return {
            "nodes": nodes,
            "edges": edges,
            "summary": f"Incident in {service} degraded downstream systems. Downstream dependency chain: " + " -> ".join([n["label"] for n in nodes])
        }
