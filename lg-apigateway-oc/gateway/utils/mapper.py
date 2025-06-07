import json
import re

def contentMapper(data):
    """
    Maps the data to a success response format.
    
    Args:
        data (bytes): The data to be mapped.
    
    Returns:
        dict: A dictionary containing the status and data.
    """
    if isinstance(data, bytes):
        data = data.decode('utf-8')                              # Decode bytes to string
    if isinstance(data, str):
        data = json.loads(data)                                  # Parse JSON string to dict
    data = convertToSnakeCase(data)                              # Convert keys to snake_case
    print(f"ContentMapper: {data}")                              # Debug print statement
    return data

def convertToSnakeCase(data):
    """
    Recursively converts all dictionary keys from camelCase or PascalCase to snake_case.

    Args:
        data (dict | list): The dictionary or list to convert.

    Returns:
        dict | list: A new structure with all keys in snake_case.
    """
    if isinstance(data, dict):
        new_dict = {}
        for key, value in data.items():
            # Convert camelCase or PascalCase to snake_case
            new_key = re.sub(r'(?<!^)(?=[A-Z])', '_', key).lower()
            new_dict[new_key] = convertToSnakeCase(value)
        return new_dict
    elif isinstance(data, list):
        return [convertToSnakeCase(item) for item in data]
    else:
        return data