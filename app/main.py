
from contextlib import asynccontextmanager
from pathlib import Path

import joblib
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers.prediction import router as prediction_router


MODEL_PATH = Path(__file__).resolve().parent.parent / "models" / "mlp_mnist.joblib"


@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.model = joblib.load(MODEL_PATH)
    yield
    app.state.model = None


app = FastAPI(
    title="Classificador de Dígitos MNIST",
    description="API para classificação de dígitos manuscritos usando MLP.",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5500",
        "http://localhost:5500",
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(prediction_router)

