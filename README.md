# Classificador de Dígitos MNIST — API

Link do video: A ser adicionado.

## Objetivo

Este projeto evolui o classificador de dígitos manuscritos desenvolvido com o conjunto de dados MNIST, disponibilizando o modelo treinado por meio de uma API REST.

A API recebe um vetor de pixels normalizados, realiza a classificação utilizando um modelo de Machine Learning baseado em MLP (*Multi-Layer Perceptron*) e retorna o dígito previsto e as probabilidades estimadas para cada classe.

## Tecnologias utilizadas

- **Python 3.10.7** — linguagem de programação.
- **FastAPI 0.159.1** — desenvolvimento da API REST.
- **Uvicorn 0.54.0** — servidor ASGI para execução da aplicação.
- **Scikit-learn 1.7.2** — implementação e utilização do modelo MLP.
- **Joblib 1.6.0** — carregamento do modelo treinado.
- **NumPy 2.2.6** — manipulação dos dados numéricos.
- **Pydantic 2.14.1** — validação dos dados de entrada e saída.
- **Matplotlib 3.10.9** — visualização de dados e resultados.
- **Pillow 12.3.0** — manipulação de imagens.
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

## AVALIAÇÃO DO MODELO

Neste momento o classificador utiliza uma rede neural MLP (Multilayer Perceptron), treinada para reconhecer dígitos manuscritos do conjunto de dados MNIST.

# RESULTADOS NO CONJUNTO DE TESTE

Acurácia: 97,9571%
F1-score macro: 97,9394%
Tempo de predição: 0,04 segundos
Total de amostras avaliadas: 14.000

DESEMPENHO POR DÍGITO

Dígito 0: Precisão 98,07%, Recall 99,35%, F1-score 98,71%.
Dígito 1: Precisão 98,55%, Recall 99,17%, F1-score 98,86%.
Dígito 2: Precisão 98,41%, Recall 97,35%, F1-score 97,88%.
Dígito 3: Precisão 97,97%, Recall 97,90%, F1-score 97,93%.
Dígito 4: Precisão 98,15%, Recall 96,92%, F1-score 97,53%.
Dígito 5: Precisão 97,69%, Recall 97,07%, F1-score 97,38%.
Dígito 6: Precisão 98,41%, Recall 98,84%, F1-score 98,62%.
Dígito 7: Precisão 97,48%, Recall 98,22%, F1-score 97,85%.
Dígito 8: Precisão 98,22%, Recall 97,14%, F1-score 97,68%.
Dígito 9: Precisão 96,58%, Recall 97,34%, F1-score 96,96%.

O modelo alcançou acurácia de 97,9571% no conjunto de teste, demonstrando alto desempenho na classificação de dígitos manuscritos. O F1-score macro de 97,9394% indica desempenho consistente entre as dez classes. O dígito 1 apresentou o maior F1-score, de 98,86%, enquanto o dígito 9 apresentou o menor, de 96,96%.

Esses resultados fundamentam a utilização do modelo como componente de predição da API.

## Execução da API

### Windows — usando `iniciar.bat` (recomendado)

O projeto inclui o arquivo `iniciar.bat` na raiz para facilitar a inicialização da API pelo Windows. 

1. Abra o terminal na raiz do projeto.
2. Se ainda não existir, crie o ambiente virtual:

   ```powershell
   python -m venv .venv
   ```

3. Instale as dependências:

   ```powershell
   .\.venv\Scripts\python.exe -m pip install -r requirements.txt
   ```

4. Execute `iniciar.bat` com dois cliques no Explorador de Arquivos ou pelo terminal:

   ```powershell
   .\iniciar.bat
   ```

O script ativa o ambiente virtual .venv e inicia a API com o Uvicorn, usando recarga automática durante o desenvolvimento. Se o ambiente virtual não existir, o script informa que ele precisa ser criado. Em seguida, inicia um servidor HTTP na porta 5500 para disponibilizar a interface web e abre o front-end no navegador.

### Execução manual

Como alternativa, ative o ambiente virtual e execute o Uvicorn diretamente:

```powershell
.\.venv\Scripts\Activate.ps1
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

{
  "status": "ok",
  "model_loaded": true
}

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
