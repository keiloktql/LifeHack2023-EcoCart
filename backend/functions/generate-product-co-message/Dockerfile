# Base Image
FROM public.ecr.aws/lambda/python:3.9-x86_64

# Install dependencies
COPY requirements.txt .
RUN python3 -m pip install --no-cache-dir -r requirements.txt && \
    rm requirements.txt

# Copy application files
COPY app.py .env ./
RUN mkdir src/
COPY src/* ./src/

# Set environment variables
ENV LC_ALL C.UTF-8
ENV LANG C.UTF-8

# Set the entrypoint command
CMD ["app.lambda_handler"]