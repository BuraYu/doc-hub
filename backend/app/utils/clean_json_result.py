import json

def parse_json_response(text: str) -> dict:
    cleaned = text.strip().strip("```")
    if cleaned.startswith("json"):
        cleaned = cleaned[4:].strip()
    try:
        return json.loads(cleaned)
    except json.JSONDecodeError as e:
        print(f"Response was not valid JSON: {text}")
        return {}