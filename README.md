# Classificador de Dígitos MNIST — API

## Objetivo

Este projeto evolui o classificador de dígitos manuscritos desenvolvido com o conjunto de dados MNIST, disponibilizando o modelo treinado por meio de uma API REST.

A API recebe um vetor de pixels normalizados, realiza a classificação utilizando um modelo de Machine Learning baseado em MLP (*Multi-Layer Perceptron*) e retorna o dígito previsto e as probabilidades estimadas para cada classe.

## Tecnologias utilizadas

- **Python** — linguagem de programação.
- **FastAPI** — desenvolvimento da API REST.
- **Uvicorn** — servidor ASGI para execução da aplicação.
- **Scikit-learn** — implementação e utilização do modelo MLP.
- **Joblib** — carregamento do modelo treinado.
- **NumPy** — manipulação dos dados numéricos.
- **Pydantic** — validação dos dados de entrada e saída.
- **Jupyter Notebook** — desenvolvimento, treinamento e experimentação.

## Estrutura do projeto

```text
classificador_de_digitos_api/
├── app/
│   ├── routers/
│   │   └── prediction.py
│   ├── schemas/
│   │   └── prediction.py
│   ├── services/
│   │   └── prediction_service.py
│   └── main.py
├── data/
│   └── external_images/
├── models/
│   └── mlp_mnist.joblib
├── notebooks/
│   ├── 01_treinar_mlp.ipynb
│   └── 02_prever_digitos.ipynb
├── requirements.txt
└── README.md
```

## Requisitos

- Python 3.10 ou compatível com as versões das dependências.
- Git, para clonar o repositório.
- Ambiente virtual Python recomendado.

## Instalação

Clone o repositório:

```bash
git clone https://github.com/senapalm/classificador_de_digitos_api.git
cd classificador_de_digitos_api
```

Crie e ative um ambiente virtual.

**Windows — PowerShell:**

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

Instale as dependências:

```powershell
python -m pip install -r requirements.txt
```

## Execução da API

Na raiz do projeto, execute:

```powershell
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

Após iniciar o servidor, os seguintes endereços estarão disponíveis:

- **Documentação interativa:** http://127.0.0.1:8000/docs
- **Documentação alternativa:** http://127.0.0.1:8000/redoc
- **Verificação de saúde:** http://127.0.0.1:8000/health

O modelo treinado é carregado durante a inicialização da aplicação.

## Endpoints

### `GET /health`

Verifica se a API está respondendo.

Resposta esperada — HTTP 200:

```json
{
  "status": "ok"
}
```

### `POST /predict`

Realiza a classificação de um dígito manuscrito.

A requisição deve conter a propriedade `pixels`, com exatamente 784 valores numéricos entre 0 e 1, representando os pixels de uma imagem de 28 × 28.

Exemplo de estrutura da requisição:

```json
{
  "pixels": [
    0.0, 0.0, 0.0
  ]
}
```

O exemplo acima é apenas ilustrativo: para uma requisição válida, a lista deve conter os 784 valores.

Resposta esperada — estrutura:

```json
{
  "prediction": 6,
  "probabilities": [
    0.001,
    0.001,
    0.002,
    0.003,
    0.001,
    0.002,
    0.991,
    0.001,
    0.002,
    0.001
  ]
}
```

Os valores da resposta são ilustrativos. A previsão e as probabilidades reais dependem dos pixels enviados.

## Observações

- O endpoint `/predict` recebe os pixels em formato JSON, não o arquivo de imagem.
- Os pixels devem estar normalizados entre 0 e 1, utilizando a mesma convenção de preparação dos dados empregada no treinamento.
- O modelo salvo permite executar as previsões sem realizar um novo treinamento a cada inicialização.
- A documentação interativa do FastAPI permite testar os endpoints diretamente pelo navegador.

## Licença

A licença de distribuição deste projeto ainda não foi especificada.
