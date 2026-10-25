import numpy as np


def predict_digit(model, pixels: list[float]) -> dict:
    entrada = np.array(pixels, dtype=np.float64).reshape(1, 784)

    prediction = int(model.predict(entrada)[0])
    probabilities = model.predict_proba(entrada)[0].tolist()

    print("Prediction:", prediction)
    print("Probabilities:", probabilities)
    print("Sum:", sum(probabilities))

    return {
        "prediction": prediction,
        "probabilities": probabilities,
    }
