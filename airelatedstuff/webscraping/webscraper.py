import json
import requests
from bs4 import BeautifulSoup

# Step 1: Load the JSON file containing law data
with open('KANOON.json', 'r', encoding='utf-8-sig') as f:
    law_data = json.load(f)

results = []

# Step 2: Loop through each entry in the JSON and scrape content
for entry in law_data:
    url = entry['link']
    print(f"Scraping: {url}")
    try:
        response = requests.get(url, timeout=10)
        soup = BeautifulSoup(response.text, 'html.parser')

        # Step 3: Extract the law text
        law_section = soup.find('section', class_='akn-section')
        if law_section:
            law_text = law_section.get_text(separator=' ', strip=True)
        else:
            law_text = "Law text not found"

        # Step 4: Save data
        results.append({
            "title": entry["title"],
            "summary": entry["summary"],
            "link": entry["link"],
            "law_text": law_text
        })

    except Exception as e:
        print(f"Failed to fetch {url}: {e}")
        results.append({
            "title": entry["title"],
            "summary": entry["summary"],
            "link": entry["link"],
            "law_text": f"Error: {str(e)}"
        })

# Step 5: Save the results to output.json
with open('output.json', 'w', encoding='utf-8') as f:
    json.dump(results, f, indent=2, ensure_ascii=False)

print("✅ Scraping completed. Data saved to output.json")
