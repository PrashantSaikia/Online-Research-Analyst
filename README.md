# Online-Research-Analyst

## How to use
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
To use it:
docker pull kristada673/used-car-analysis-and-research:latest
docker run -p 8000:8000 kristada673/used-car-analysis-and-research:latest
```

## Web UI
<img width="832" alt="Screenshot 2024-09-10 at 12 24 10 PM" src="https://github.com/user-attachments/assets/7ba09130-20ee-4fbd-aa84-f4ec6af76392">
.
.
.
<img width="831" alt="Screenshot 2024-09-10 at 12 25 13 PM" src="https://github.com/user-attachments/assets/eb3cb859-564b-407b-a12d-3366e90b699b">
