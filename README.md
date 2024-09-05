# Used-Car-Analysis-and-Research

## How to Use

Locally:

```
pip install -r requirements.txt
python -m uvicorn main:app --reload
```
With Docker:
```
docker-compose up --build
```

Alternately:
```
docker build -t car-research .
docker run -p 8000:8000 car-research
```
Then go to http://localhost:8000 

## Push to Docker Hub:

```
docker login
docker tag car-research kristada673/used-car-analysis-and-research:latest
docker push kristada673/used-car-analysis-and-research:latest
```

To use it:

```
docker pull kristada673/used-car-analysis-and-research:latest
docker run -p 8000:8000 kristada673/used-car-analysis-and-research:latest
```

## Web UI

<img width="1147" alt="Screenshot 2024-09-05 at 11 00 22 AM" src="https://github.com/user-attachments/assets/73897f67-a731-432a-a497-e2ea5cd3cdd6">

...

...

...

<img width="1058" alt="Screenshot 2024-09-05 at 11 03 15 AM" src="https://github.com/user-attachments/assets/1cddf81e-8212-4747-9c21-4e4854de37c1">
