from fastapi import APIRouter, HTTPException, Request

from app.schemas.prediction import PredictionRequest, PredictionResponse
from app.services.prediction_service import predict_digit


router = APIRouter()


@router.get("/health")
def health_check(request: Request):
    model_loaded = getattr(request.app.state, "model", None) is not None

    return {
        "status": "ok" if model_loaded else "error",
        "model_loaded": model_loaded
    }


@router.post("/predict", response_model=PredictionResponse)
def predict(request: Request, data: PredictionRequest):
    try:
        return predict_digit(request.app.state.model, data.pixels)
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail="Erro interno ao realizar a previsão.",
        ) from exc