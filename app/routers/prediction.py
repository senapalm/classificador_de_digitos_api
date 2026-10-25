from fastapi import APIRouter, HTTPException, Request

from app.schemas.prediction import PredictionRequest, PredictionResponse
from app.services.prediction_service import predict_digit


router = APIRouter()


@router.get("/health")
def health_check():
    return {"status": "ok"}


@router.post("/predict", response_model=PredictionResponse)
def predict(request: Request, data: PredictionRequest):
    try:
        return predict_digit(request.app.state.model, data.pixels)
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail="Erro interno ao realizar a previsão.",
        ) from exc