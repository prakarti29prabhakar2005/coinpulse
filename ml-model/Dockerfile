FROM python:3.10-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Create necessary directories and set permissions for Hugging Face Spaces
# Hugging Face runs containers as user 1000
RUN mkdir -p /app/artifacts /app/cache && \
    chmod -R 777 /app/artifacts /app/cache

# Copy application code
COPY . .

# Expose port required by Hugging Face Spaces
EXPOSE 7860

# Run Uvicorn
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "7860"]
