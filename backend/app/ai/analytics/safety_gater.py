from app.schemas.orchestrator import SafetyGateSchema, PreconditionSchema

class SafetyGater:
    """
    Evaluates strict deterministic rules for incident reuse safety and preconditions.
    """

    def evaluate_safety(self, current_sig: dict, memory_sig: dict) -> SafetyGateSchema:
        """
        Compare the current incident signature against a historical memory signature.
        """
        if not memory_sig:
            return SafetyGateSchema(
                environment_match=False, service_match=False, service_version_match=False,
                deployment_version_match=False, config_hash_match=False, region_match=False,
                dependency_version_match=False, blast_radius_match=False, severity_match=False,
                is_safe=False
            )

        env_match = current_sig.get("environment") == memory_sig.get("environment")
        svc_match = current_sig.get("affected_service") == memory_sig.get("affected_service")
        ver_match = current_sig.get("service_version") == memory_sig.get("service_version")
        dep_match = current_sig.get("deployment_version") == memory_sig.get("deployment_version")
        cfg_match = current_sig.get("config_hash") == memory_sig.get("config_hash")
        reg_match = current_sig.get("region") == memory_sig.get("region")
        dep_ver_match = current_sig.get("dependencies") == memory_sig.get("dependencies")
        
        # Blast radius heuristic match (if they share the same resource type or service)
        blast_match = current_sig.get("resource_type") == memory_sig.get("resource_type")
        sev_match = current_sig.get("severity") == memory_sig.get("severity")

        # All must match for true safety
        is_safe = all([
            env_match, svc_match, ver_match, dep_match, 
            cfg_match, reg_match, dep_ver_match, blast_match, sev_match
        ])

        return SafetyGateSchema(
            environment_match=env_match,
            service_match=svc_match,
            service_version_match=ver_match,
            deployment_version_match=dep_match,
            config_hash_match=cfg_match,
            region_match=reg_match,
            dependency_version_match=dep_ver_match,
            blast_radius_match=blast_match,
            severity_match=sev_match,
            is_safe=is_safe
        )

    def evaluate_preconditions(self, current_sig: dict) -> PreconditionSchema:
        """
        Mock deterministic precondition checks based on live environment signals.
        """
        # For demonstration, we assume preconditions are met unless it's a specific mock failure.
        db_healthy = True
        no_migrations = True
        no_pending_deploy = True
        cluster_healthy = True
        downstream_stable = True

        # Introduce some deterministic failure logic for testing based on severity
        if current_sig.get("severity") == "critical":
            downstream_stable = False
            
        if current_sig.get("affected_service") == "database":
            db_healthy = False
            
        is_ready = db_healthy and no_migrations and no_pending_deploy and cluster_healthy and downstream_stable
        
        return PreconditionSchema(
            db_pool_healthy=db_healthy,
            active_migrations=not no_migrations,
            pending_deployments=not no_pending_deploy,
            cluster_healthy=cluster_healthy,
            downstream_stable=downstream_stable,
            is_ready=is_ready
        )
