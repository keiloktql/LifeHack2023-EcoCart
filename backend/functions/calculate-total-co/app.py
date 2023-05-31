'''lambda function to calculate the total carbon footprint of a list of products'''
# packages
import json
import re
import numpy as np
import openai
from decouple import config

# modules
from src.logger import logger

openai.api_key = config("OPENAI_API_KEY")

PROMPT_TEMPLATE = """
Provide the total estimated carbon footprint of the given products:
{product_titles}
No matter what, you must give a rough estimate of the value of CO2 produced, infer from product titles and product type e.g. phones and electronics.

Reply in the following template:
Carbon Footprint: XXX kg CO2
"""

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

    product_titles = body.get("product_titles") # list
    assert isinstance(product_titles, list), "product_titles must be a list"
    assert len(product_titles) > 0, "product_titles must not be empty"

    # ----- QUERY GPT SECTION -----
    prompt = PROMPT_TEMPLATE.format(product_titles=product_titles)
    try:
        completion = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.2,
            presence_penalty=0.1,
            frequency_penalty=0.1,
        )
        completion_content = completion.choices[0].message.get("content")
        logger.info(f"GPT 3.5-Turbo Reply:\n{completion_content}")

        # ----- POST-PROCESSING SECTION -----
        # Search for the first match of the regex
        match = re.search(
            r"(\d{1,3}) kg CO2", completion_content
        )
        if match:
            co2_footprint = int(match.group(1))
            logger.info(f"CO2 Footprint: {co2_footprint}")
        else:
            co2_footprint = round(sum(list(map(lambda x: np.random.normal(50, 10), product_titles))), 0)
            logger.error("CO2 Footprint not found")

        # Response
        response = {
            "statusCode": 200,
            "headers": {
                'Access-Control-Allow-Headers': 'Content-Type',
                "Content-Type": "application/json"
            },
            "body": json.dumps(
                {
                    "completion_content": completion_content,
                    "co2_footprint": co2_footprint,
                }
            )
        }
        return response
    except Exception as exc:
        logger.error(f"Grading Error: {exc}")
        raise
