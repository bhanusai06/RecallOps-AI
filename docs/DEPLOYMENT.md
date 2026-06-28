# Deployment Guide

RecallOps AI is container-ready and can be deployed to any Docker-compatible hosting environment.

## 1. Environment Variables

Before deploying, ensure the following environment variables are securely injected into both your Backend and Frontend environments (e.g., via AWS Secrets Manager, GitHub Secrets, or Vercel Environment Variables).

### Backend Requirements
| Variable | Description |
| :--- | :--- |
| `APP_ENV` | Must be set to `production` in live environments. |
| `HINDSIGHT_API_KEY` | Your active API key for the Hindsight memory vector engine. |
| `CASCADEFLOW_API_KEY` | Your active API key for the cascadeflow runtime. |
| `OPENROUTER_API_KEY` | Optional: OpenRouter key if bypassing cascadeflow native models. |

### Frontend Requirements
| Variable | Description |
| :--- | :--- |
| `NEXT_PUBLIC_API_URL` | The public URL of your deployed FastAPI backend (e.g., `https://api.recallops.com/api/v1`). |

---

## 2. Docker Deployment (Recommended)

The easiest way to deploy RecallOps AI to a single VM (like an AWS EC2 instance or DigitalOcean Droplet) is via Docker Compose.

**Important Production Changes:**
Before running in production, modify your `Dockerfile`s to remove development flags.
* **Backend:** Change `CMD` to `CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]` (remove `--reload`). For heavy production loads, consider using Gunicorn.
* **Frontend:** Change `CMD` to `RUN npm run build` followed by `CMD ["npm", "start"]`.

**Run the deployment:**
```bash
docker-compose up --build -d
```
*Note: Ensure you have stripped the unused `postgres` service from `docker-compose.yml` if you are relying purely on Hindsight.*

---

## 3. Cloud Provider Deployment

### Frontend (Vercel)
The Next.js 14 frontend is optimized for deployment on Vercel.
1. Connect your GitHub repository to Vercel.
2. Select the `frontend` root directory.
3. Vercel will automatically detect Next.js and apply the correct build commands (`npm run build`).
4. Add your Environment Variables.
5. Deploy.

### Backend (AWS ECS, Render, or Railway)
The FastAPI backend is stateless (state is managed by Hindsight).
1. Build the Docker image from `backend/Dockerfile`.
2. Deploy the container to a managed service like AWS ECS (Fargate) or Render.
3. Expose port `8000`.
4. Ensure your hosting provider allows outbound traffic to the `hindsight` and `cascadeflow` API endpoints.

## 4. Production Configuration

* **CORS:** Ensure that the `allow_origins` array in `backend/app/middleware/cors.py` is updated from `["*"]` to exactly match your frontend production domain (e.g., `["https://app.recallops.com"]`).
* **Scale:** Hindsight and Cascadeflow handle the heavy lifting. The FastAPI backend can be horizontally scaled infinitely as long as you put it behind a standard load balancer.
