'''Lambda to generate a fun-fact related to environmental conservation,
related to the given product title'''
# packages
import json
import base64
import openai
from decouple import config
import boto3

# modules
from src.logger import logger

openai.api_key = config("OPENAI_API_KEY")

PROMPT_TEMPLATE = """
Give a fun-fact related to environmental conservation, related to the given product.
XXX refers to an estimated quantitative value.
Product title: {product_title}
Product categories: {categories}.
Rekognition Detection: {labels}
Give an answer no matter what, give a rough estimate based on the product title, product categories and Rekognition Detection.
Or else, give a random fun-fact related to environmental conservation based on the based on the product title, product categories and Rekognition Detection.
No matter what, you must give a rough estimate of the value of CO2 produced, infer from based on the product title, product categories and Rekognition Detection.

Reply in the following template:
Did you know the process of making {product_title} produces XXX of CO2 g?
That is equivalent to XXX cigarettes, XXX car miles, XXX smartphone charges!
"""

# --------------- Python AWS SDK ------------------
rekognition = boto3.client('rekognition', region_name='ap-southeast-1')

def detect_labels(b64_img: str):
    """
    rekognition detect labels function via boto3 sdk
    """
    logger.info("Running rekognition detect_labels function via boto3 sdk")
    response = rekognition.detect_labels(
        Image={
            'Bytes': base64.b64decode(b64_img)
        },
        MaxLabels=10,
        MinConfidence=90
    )
    return response

def lambda_handler(event, context):
    """
    lambda handler
    """
    logger.debug("Lambda function ARN:", context.invoked_function_arn)
    logger.debug("CloudWatch log stream name:", context.log_stream_name)
    logger.debug("CloudWatch log group name:",  context.log_group_name)
    logger.debug("Lambda Request ID:", context.aws_request_id)
    logger.debug("Lambda function memory limits in MB:", context.memory_limit_in_mb)

    logger.debug("Event: %s", event)
    body = event.get("body")

    # Convert the body to a JSON object
    if not isinstance(body, dict):
        body = json.loads(body)

    categories = body.get("categories") # list
    assert isinstance(categories, list), "categories must be a list"
    assert len(categories) > 0, "categories must not be empty"
    product_title = body.get("product_title") # string
    assert isinstance(product_title, str), "product_title must be a string"
    assert len(product_title) > 0, "product_title must not be empty"
    base64_image = body.get("base64_image") # string.
    assert isinstance(base64_image, str), "base64_image must be a string"
    assert len(base64_image) > 0, "base64_image must not be empty"

    # Categories preprocessing
    categories = ", ".join(categories)

    # ----- QUERY REKOGNITION SECTION -----
    labels = detect_labels(base64_image)
    logger.info(f"Rekognition Reply:\n{labels}")

    # ----- QUERY GPT SECTION -----
    prompt = PROMPT_TEMPLATE.format(
        categories=categories,
        product_title=product_title,
        labels=labels
    )
    try:
        completion = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.5,
            presence_penalty=0.1,
            frequency_penalty=0.1,
        )
        completion_content = completion.choices[0].message.get("content")
        logger.info(f"GPT 3.5-Turbo Reply:\n{completion_content}")

        # Response
        response = {
            "statusCode": 200,
            "headers": {
                "Content-Type": "application/json",
            },
            "body": json.dumps(
                {
                    "completion_content": completion_content,
                }
            )
        }
        return response
    except Exception as exc:
        logger.error(f"Grading Error: {exc}")
        raise
