import json
import openai
from decouple import config

# modules
from src.logger import logger

openai.api_key = config("OPENAI_API_KEY")

PROMPT_TEMPLATE = """
How are you doing?
{query}
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

    query = body.get("query")

    # ----- QUERY GPT SECTION -----
    prompt = PROMPT_TEMPLATE.format(query=query)
    try:
        completion = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.5,
            presence_penalty=0.1,
            frequency_penalty=0.1,
        )
        completion_content = completion.choices[0].message.get("content")
        logger.info(f"GPT 3.5-Turbo Reply: {completion_content}")

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
