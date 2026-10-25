from typing import Annotated

from pydantic import BaseModel, Field


Pixel = Annotated[float, Field(ge=0.0, le=1.0)]


class PredictionRequest(BaseModel):
    pixels: list[Pixel] = Field(
        ...,
        min_length=784,
        max_length=784,
        description="Vetor com exatamente 784 pixels normalizados entre 0 e 1.",
    )


class PredictionResponse(BaseModel):
    prediction: int = Field(
        ...,
        ge=0,
        le=9,
        description="Dígito previsto pelo modelo.",
    )
    probabilities: list[float] = Field(
        ...,
        min_length=10,
        max_length=10,
        description="Probabilidades dos dígitos de 0 a 9.",
    )
