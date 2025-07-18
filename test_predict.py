from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_predict_endpoint():
    csv_content = (
        "producto,fecha,cantidad\n"
        "Harina,11/05/2025,100\n"
        "Harina,12/05/2025,120\n"
        "Harina,13/05/2025,115\n"
        "Azúcar,11/05/2025,80\n"
        "Azúcar,12/05/2025,85\n"
        "Azúcar,13/05/2025,87\n"
    )

    with open("sample_test.csv", "w", encoding="utf-8") as f:
        f.write(csv_content)

    with open("sample_test.csv", "rb") as f:
        response = client.post("/api/v1/predict", files={"file": f})

    # Limpieza del archivo de prueba
    import os
    os.remove("sample_test.csv")

    # Verificación del resultado
    assert response.status_code == 200
    data = response.json()
    assert "prediccion_diaria" in data
    assert "resumen_semanal" in data
    assert "Harina" in data["prediccion_diaria"]
