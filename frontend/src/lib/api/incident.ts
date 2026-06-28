import axios from "axios";
import { AnalyzeRequest, AnalyzeResponse } from "@/types/api";

const API_BASE = "http://localhost:8000/api/v1";

export const analyzeIncidentLog = async (payload: AnalyzeRequest): Promise<AnalyzeResponse> => {
  // Add a slight artificial delay for the UI to showcase the pipeline steps nicely
  const start = Date.now();
  const response = await axios.post<AnalyzeResponse>(`${API_BASE}/incidents/analyze`, payload);
  const elapsed = Date.now() - start;
  
  // Ensure the UI takes at least 2.5s total to show off the animations if the mock backend is too fast
  if (elapsed < 2500) {
    await new Promise((resolve) => setTimeout(resolve, 2500 - elapsed));
  }
  
  return response.data;
};
