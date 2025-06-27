import os
import google.generativeai as genai
from typing import Optional, Dict
# check 
# Define your list of supported service keywords
SERVICE_KEYWORDS = [
    "plumber", "mechanic", "diesel_mechanic", "motorcycle_mechanic",
    "heavy_vehicle_mechanic", "transmission_specialist", "brake_and_suspension_mechanic",
    "auto_body_mechanic", "auto_electrician", "tire_and_wheel_technician",
    "fleet_mechanic", "home_salon_men", "home_salon_female", "home_appliance_worker"
]

# Configure Gemini API
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    raise ValueError("GEMINI_API_KEY is not configured. Check your .env file in the 'ai' folder.")
genai.configure(api_key=api_key)

def get_service_keyword_from_gemini(user_prompt: str, file_path: Optional[str] = None) -> Dict[str, str]:
    """
    Detect the language of the prompt, translate it if needed, and extract the most relevant service keyword.

    Args:
        user_prompt (str): The user's input.
        file_path (Optional[str]): Optional path to a file that should be included in the prompt.

    Returns:
        dict: A dictionary with the detected keyword under the key "keyword".
    """
    try:
        model = genai.GenerativeModel('gemini-1.5-flash')

        prompt = [
            (
                "You are a multilingual service-request interpreter.\n"
                "Step 1: Detect the language of the user's message. If it's not in English, translate it.\n"
                "Step 2: Based on the English request, choose the most relevant keyword from the list below.\n"
                "Only output the final keyword in lowercase. No extra text or explanation.\n\n"
                f"List: {', '.join(SERVICE_KEYWORDS)}\n"
                f"Request: \"{user_prompt}\""
            )
        ]

        if file_path:
            uploaded_file = genai.upload_file(path=file_path)
            prompt.append(uploaded_file)

        response = model.generate_content(prompt)
        raw_output = response.text.strip().lower().replace('.', '').replace('\n', '')

        # Validate or approximate match the output
        if raw_output in SERVICE_KEYWORDS:
            return {"keyword": raw_output}

        for keyword in SERVICE_KEYWORDS:
            if keyword in raw_output:
                return {"keyword": keyword}

        raise ValueError(f"Unexpected keyword returned by Gemini: '{raw_output}'")

    except Exception as e:
        print(f"[ERROR] Gemini processing failed: {e}")
        raise e
