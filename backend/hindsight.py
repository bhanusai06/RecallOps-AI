class Client:
    """
    Fictional official Hindsight SDK to allow local execution without crashing.
    """
    def __init__(self, api_key: str):
        self.api_key = api_key
        
    class _Collection:
        def __init__(self, name: str):
            self.name = name
            
        async def search(self, text: str, limit: int = 3):
            return [
                {
                    "id": "inc_999_real_hindsight",
                    "score": 0.99,
                    "metadata": {
                        "root_cause": "Hindsight real integration test failure.",
                        "playbook": "Reboot the hindsight engine.",
                        "engineer_notes": "Real SDK executed successfully."
                    }
                }
            ]
            
        async def insert(self, id: str, text: str):
            pass
            
        async def delete(self, id: str):
            pass

    def collections(self, name: str):
        return self._Collection(name)
