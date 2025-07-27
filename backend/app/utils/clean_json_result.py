import json


def clean_json_result(result: str) -> dict:
    """
    Cleans a JSON-like string by removing backticks and markers,
    then parses it into a Python dictionary.
    """
    try:
        cleaned_result = result.strip("```json\n").strip("```\n")
        return json.loads(cleaned_result)
    except json.JSONDecodeError as e:
        raise ValueError(f"Failed to decode JSON: {str(e)}")
