#!/usr/bin/env python3
"""
Script to scrape the three most recent episodes from Building Better CMOs website.
Extracts: episode image, title, and guest name.
Uses Selenium for JavaScript-rendered content.

Output:
- Images saved to: public/assets/podcast1/
- JSON saved to: data/podcast1.json
"""

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import requests
import json
import time
import re
import os
from urllib.parse import urlparse
from pathlib import Path


# Get project root (3 levels up from this script)
SCRIPT_DIR = Path(__file__).parent
PROJECT_ROOT = SCRIPT_DIR.parent.parent.parent

# Output directories
IMAGES_DIR = PROJECT_ROOT / "public" / "assets" / "podcast1"
JSON_OUTPUT = PROJECT_ROOT / "data" / "podcast1.json"

# Also keep a local copy for reference
LOCAL_IMAGES_DIR = SCRIPT_DIR / "images"


def setup_driver():
    """Set up Chrome driver in headless mode."""
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--window-size=1920,1080")
    chrome_options.add_argument("user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
    
    driver = webdriver.Chrome(options=chrome_options)
    return driver


def download_image(image_url, filename):
    """
    Downloads an image from a URL and saves it to both local and public directories.
    
    Args:
        image_url: URL of the image to download
        filename: Local filename to save the image as
        
    Returns:
        str: Web-accessible path to the image (for JSON output)
    """
    if not image_url:
        return None
    
    # Create directories if they don't exist
    os.makedirs(IMAGES_DIR, exist_ok=True)
    os.makedirs(LOCAL_IMAGES_DIR, exist_ok=True)
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
    }
    
    try:
        response = requests.get(image_url, headers=headers, timeout=15, stream=True)
        response.raise_for_status()
        
        # Determine file extension from URL or content-type
        parsed_url = urlparse(image_url)
        url_ext = os.path.splitext(parsed_url.path)[1].lower()
        
        if url_ext in ['.jpg', '.jpeg', '.png', '.gif', '.webp']:
            ext = url_ext
        else:
            content_type = response.headers.get('content-type', '')
            if 'jpeg' in content_type or 'jpg' in content_type:
                ext = '.jpg'
            elif 'png' in content_type:
                ext = '.png'
            elif 'gif' in content_type:
                ext = '.gif'
            elif 'webp' in content_type:
                ext = '.webp'
            else:
                ext = '.jpg'  # Default to jpg
        
        # Clean filename and add extension
        safe_filename = re.sub(r'[^\w\-]', '_', filename)
        
        # Save to public assets folder
        public_filepath = IMAGES_DIR / f"{safe_filename}{ext}"
        # Save to local folder for reference
        local_filepath = LOCAL_IMAGES_DIR / f"{safe_filename}{ext}"
        
        # Read content once
        content = response.content
        
        with open(public_filepath, 'wb') as f:
            f.write(content)
        
        with open(local_filepath, 'wb') as f:
            f.write(content)
        
        print(f"  Downloaded: {public_filepath}")
        
        # Return web-accessible path
        return f"/assets/podcast1/{safe_filename}{ext}"
        
    except Exception as e:
        print(f"  Failed to download image: {e}")
        return None


def scrape_recent_episodes(url="https://bettercmos.com/"):
    """
    Scrapes the three most recent episodes from the Building Better CMOs homepage.
    
    Returns:
        list: A list of dictionaries containing episode info (image_url, title, guest)
    """
    driver = setup_driver()
    episodes = []
    
    try:
        print(f"Loading {url}...")
        driver.get(url)
        
        # Wait for the feed to load
        wait = WebDriverWait(driver, 15)
        
        # Wait for feed posts to appear
        try:
            wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, ".js-feed-post")))
        except:
            time.sleep(5)
        
        # Scroll to trigger lazy loading of images
        driver.execute_script("window.scrollTo(0, 600);")
        time.sleep(2)
        
        # Find all episode posts
        posts = driver.find_elements(By.CSS_SELECTOR, ".js-feed-post")
        print(f"Found {len(posts)} posts")
        
        # Extract info from each post (limit to 3)
        for i, post in enumerate(posts[:3]):
            episode_data = {}
            
            # Get image - try multiple attributes for lazy-loaded images
            try:
                img = post.find_element(By.CSS_SELECTOR, "img, .t-bgimg, [style*='background-image']")
                # Try different image source attributes
                image_url = (
                    img.get_attribute('src') or 
                    img.get_attribute('data-original') or
                    img.get_attribute('data-lazy-src') or
                    img.get_attribute('data-src')
                )
                
                # Check for background-image style
                if not image_url:
                    style = img.get_attribute('style') or ''
                    bg_match = re.search(r'background-image:\s*url\(["\']?([^"\')\s]+)["\']?\)', style)
                    if bg_match:
                        image_url = bg_match.group(1)
                
                # Also check parent div for background image
                if not image_url:
                    parent = post.find_element(By.CSS_SELECTOR, ".t-feed__post-imgwrapper, .t-bgimg")
                    style = parent.get_attribute('style') or ''
                    data_original = parent.get_attribute('data-original') or ''
                    if data_original:
                        image_url = data_original
                    elif 'background-image' in style:
                        bg_match = re.search(r'url\(["\']?([^"\')\s]+)["\']?\)', style)
                        if bg_match:
                            image_url = bg_match.group(1)
                
                episode_data['image_url'] = image_url
            except Exception as e:
                episode_data['image_url'] = None
            
            # Get title
            try:
                title_elem = post.find_element(By.CSS_SELECTOR, ".t-feed__post-title, h3, h4, a")
                episode_data['title'] = title_elem.text.strip()
            except:
                episode_data['title'] = None
            
            # Get description
            try:
                desc_elem = post.find_element(By.CSS_SELECTOR, ".t-feed__post-descr, p")
                episode_data['description'] = desc_elem.text.strip()
            except:
                episode_data['description'] = None
            
            # Extract guest name from title
            # Format: "Title with Guest Name" or "Title, with Company's Guest Name"
            guest = extract_guest_name(episode_data.get('title', ''))
            episode_data['guest'] = guest
            
            # Get link to episode
            try:
                link = post.find_element(By.TAG_NAME, "a")
                episode_data['link'] = link.get_attribute('href')
            except:
                episode_data['link'] = None
            
            if episode_data.get('title') or episode_data.get('image_url'):
                episodes.append(episode_data)
        
    except Exception as e:
        print(f"Error during scraping: {e}")
        import traceback
        traceback.print_exc()
    
    finally:
        driver.quit()
    
    return episodes


def extract_guest_name(title):
    """
    Extracts guest name from podcast title.
    
    Common formats from Building Better CMOs:
    - "Title with Company's Guest Name"
    - "Title, with Guest Name of Company"  
    - "Title with Guest Name"
    """
    if not title:
        return None
    
    # Pattern: "... with [Company's] Guest Name"
    # Look for "with" followed by the guest name (often at the end)
    patterns = [
        # "with Starbucks' Tressie Lieberman" -> "Tressie Lieberman"
        r"with\s+(?:\w+(?:'s)?\s+)?([A-Z][a-z]+\s+[A-Z][a-z]+)(?:\s+of\s+|\s*$)",
        # "with Natasha Madan of Intuit" -> "Natasha Madan"
        r"with\s+([A-Z][a-z]+\s+[A-Z][a-z]+)(?:\s+of\s+|,|\s*$)",
        # "with Wayfair CMO Paul Toms" -> "Paul Toms"
        r"with\s+(?:\w+\s+)?(?:CMO|CEO|VP|SVP|EVP)?\s*([A-Z][a-z]+\s+[A-Z][a-z]+)(?:\s*$|,)",
        # General: "with FirstName LastName" at the end
        r"with\s+(?:[\w']+\s+)*?([A-Z][a-z]+\s+[A-Z][a-z]+)\s*$",
    ]
    
    for pattern in patterns:
        match = re.search(pattern, title)
        if match:
            return match.group(1).strip()
    
    # Fallback: Find name after "with" - look for 2 capitalized words
    with_match = re.search(r'with\s+(.+)$', title, re.IGNORECASE)
    if with_match:
        after_with = with_match.group(1)
        # Extract last two capitalized words (likely the name)
        words = after_with.split()
        name_words = []
        for word in reversed(words):
            clean_word = word.strip("'s,")
            if clean_word and clean_word[0].isupper():
                name_words.insert(0, clean_word)
                if len(name_words) == 2:
                    break
            elif name_words:  # Stop if we hit a non-capitalized word after finding some
                break
        if len(name_words) >= 2:
            return ' '.join(name_words)
    
    return None


def format_for_billboard(episodes):
    """
    Formats scraped episodes into the Billboard component JSON format.
    
    Args:
        episodes: List of scraped episode data
        
    Returns:
        list: Formatted data for Billboard component
    """
    formatted = []
    
    for i, ep in enumerate(episodes, 1):
        guest_name = ep.get('guest', f'episode_{i}')
        filename = f"episode_{i}_{guest_name}" if guest_name else f"episode_{i}"
        
        # Download image and get web path
        local_image_path = download_image(ep.get('image_url'), filename)
        
        formatted.append({
            "id": f"podcast1-{i:03d}",
            "title": ep.get('title', f'Episode {i}'),
            "image": local_image_path or "/assets/podcast1/placeholder.png",
            "link": "",  # Internal link (not used for external podcasts)
            "externalLink": ep.get('link', ''),
            "active": True
        })
    
    return formatted


def main():
    print("=" * 60)
    print("Building Better CMOs - Recent Episodes Scraper")
    print("=" * 60)
    print(f"Project root: {PROJECT_ROOT}")
    print(f"Images output: {IMAGES_DIR}")
    print(f"JSON output: {JSON_OUTPUT}")
    print("=" * 60)
    
    episodes = scrape_recent_episodes()
    
    if not episodes:
        print("\nNo episodes found. The website structure may have changed.")
        print("Please check the website manually at https://bettercmos.com/")
        return
    
    print(f"\n{'=' * 60}")
    print(f"Found {len(episodes)} recent episode(s):")
    print("=" * 60)
    
    # Format and download images
    print("\nProcessing episodes and downloading images...")
    formatted_episodes = format_for_billboard(episodes)
    
    print(f"\n{'=' * 60}")
    print("Episode Details:")
    print("=" * 60)
    
    for i, ep in enumerate(formatted_episodes, 1):
        print(f"\nEpisode {i}:")
        print(f"  ID: {ep['id']}")
        print(f"  Title: {ep['title']}")
        print(f"  Image: {ep['image']}")
        print(f"  External Link: {ep['externalLink']}")
        print(f"  Active: {ep['active']}")
    
    # Save to main data folder
    os.makedirs(JSON_OUTPUT.parent, exist_ok=True)
    with open(JSON_OUTPUT, 'w') as f:
        json.dump(formatted_episodes, f, indent=2)
    print(f"\nData saved to {JSON_OUTPUT}")
    
    # Also save local copy for reference
    local_output = SCRIPT_DIR / "recent_episodes.json"
    with open(local_output, 'w') as f:
        json.dump(formatted_episodes, f, indent=2)
    print(f"Local copy saved to {local_output}")


if __name__ == "__main__":
    main()
