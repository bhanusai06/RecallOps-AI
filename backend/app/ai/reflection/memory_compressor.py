import re
from app.ai.reflection.reflection_models import MemoryDocument

class MemoryCompressor:
    """
    Compresses raw memory documents by stripping PII and noisy instance variables.
    """
    def compress(self, doc: MemoryDocument) -> MemoryDocument:
        # 1. Remove UUIDs from problem and playbook
        uuid_pattern = r'[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}'
        doc.problem = re.sub(uuid_pattern, '<UUID>', doc.problem)
        doc.playbook = re.sub(uuid_pattern, '<UUID>', doc.playbook)

        # 2. Remove specific IP addresses
        ip_pattern = r'\b(?:\d{1,3}\.){3}\d{1,3}\b'
        doc.problem = re.sub(ip_pattern, '<IP>', doc.problem)
        
        # 3. Deduplicate keywords
        doc.keywords = list(set(k.lower() for k in doc.keywords))

        # 4. Filter empty symptoms
        doc.observed_symptoms = [s for s in doc.observed_symptoms if s.strip()]

        return doc
