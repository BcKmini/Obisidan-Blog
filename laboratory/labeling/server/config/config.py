from fastapi import FastAPI

app = FastAPI()

swagger_ui_parameters = {
    "deepLinking": True,
    "displayRequestDuration": True,
    "docExpansion": "none",
    "operationsSorter": "method",
    "filter": True,
    "tagsSorter": "alpha",
    "syntaxHighlight.theme": "tomorrow-night",
    "persistAuthorization": True,
}
