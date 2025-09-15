import google.generativeai as genai
import random

genai.configure(api_key="AIzaSyCJUooAU4azz400_vuENt2QpRJAynCfFFc")

def generate_phrase(mood: str, history=set()):
    base_prompts = {
        "hesitant": [
            "Give a short motivational quote about beginnings and courage in love. Max 15 words.",
            "Create an uplifting proverb-like line about starting despite hesitation. Max 15 words."
        ],
        "confident": [
            "Give a bold, empowering romantic quote about confidence in love. Max 15 words.",
            "Write a striking one-liner about how confidence attracts connection. Max 15 words."
        ],
        "interested": [
            "Give a romantic quote about curiosity and excitement in love. Max 15 words.",
            "Write a short poetic line about interest sparking connection. Max 15 words."
        ],
        "neutral": [
            "Give a gentle friendly quote about connection growing slowly. Max 15 words.",
            "Write a light romantic proverb about small talks leading to bonds. Max 15 words."
        ]
    }

    # Pick a random variation of the prompt
    prompt = random.choice(base_prompts[mood])
    prompt += " Do NOT use I, me, my, you, your, let's."

    model = genai.GenerativeModel("gemini-1.5-flash")
    response = model.generate_content(
        prompt,
        generation_config={
            "temperature": 0.9,   # higher = more variety
            "top_p": 0.9,
            "top_k": 40
        }
    )

    text = response.text.strip()

    # Ensure uniqueness
    if text in history:
        return generate_phrase(mood, history)
    history.add(text)
    return text

# 🔥 Example test run
for _ in range(10):
    print("hesitant →", generate_phrase("hesitant"))
