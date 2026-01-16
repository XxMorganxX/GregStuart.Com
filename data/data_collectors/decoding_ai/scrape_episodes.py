#!/usr/bin/env python3
"""
Script to scrape the three most recent episodes from Decoding AI for Marketing podcast.
Extracts: episode image, title, and guest name.
Uses the Simplecast RSS feed for reliable data.

Output:
- Images saved to: public/assets/podcast2/
- JSON saved to: data/podcast2.json
"""

import requests
import xml.etree.ElementTree as ET
import json
import re
import os
from urllib.parse import urlparse
from pathlib import Path


# Get project root (3 levels up from this script)
SCRIPT_DIR = Path(__file__).parent
PROJECT_ROOT = SCRIPT_DIR.parent.parent.parent

# Output directories
IMAGES_DIR = PROJECT_ROOT / "public" / "assets" / "podcast2"
JSON_OUTPUT = PROJECT_ROOT / "data" / "podcast2.json"

# Also keep a local copy for reference
LOCAL_IMAGES_DIR = SCRIPT_DIR / "images"

# RSS feed URL for Decoding AI for Marketing
RSS_FEED_URL = "https://feeds.simplecast.com/Rz_NWJDG"

# Define namespaces used in the RSS feed
NAMESPACES = {
    'itunes': 'http://www.itunes.com/dtds/podcast-1.0.dtd',
    'media': 'http://search.yahoo.com/mrss/',
    'content': 'http://purl.org/rss/1.0/modules/content/'
}


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
        
        # Handle URLs with query parameters
        if '?' in url_ext:
            url_ext = url_ext.split('?')[0]
        
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
        return f"/assets/podcast2/{safe_filename}{ext}"
        
    except Exception as e:
        print(f"  Failed to download image: {e}")
        return None


def fetch_rss_feed(url=RSS_FEED_URL):
    """
    Fetches the RSS feed from the given URL.
    
    Returns:
        str: The RSS feed XML content
    """
    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
    }
    
    try:
        response = requests.get(url, headers=headers, timeout=15)
        response.raise_for_status()
        return response.content
    except requests.RequestException as e:
        print(f"Error fetching RSS feed: {e}")
        return None


def extract_guest_name(author_string, title):
    """
    Extracts the guest name from the author string.
    The author string typically contains: "Guest Name, Rex Briggs, Greg Stuart"
    
    Args:
        author_string: The itunes:author value
        title: The episode title (for fallback extraction)
        
    Returns:
        str: The guest name
    """
    if not author_string:
        return None
    
    # The hosts are Greg Stuart and Rex Briggs - remove them to get the guest
    hosts = ['Greg Stuart', 'Rex Briggs']
    
    # Split by comma and filter out hosts
    names = [name.strip() for name in author_string.split(',')]
    guests = [name for name in names if name not in hosts]
    
    if guests:
        return guests[0]  # Return the first guest (usually there's only one)
    
    return None


def scrape_recent_episodes(num_episodes=3):
    """
    Scrapes the most recent episodes from the RSS feed.
    
    Args:
        num_episodes: Number of episodes to retrieve (default 3)
        
    Returns:
        list: A list of dictionaries containing episode info
    """
    xml_content = fetch_rss_feed()
    
    if not xml_content:
        return []
    
    try:
        root = ET.fromstring(xml_content)
    except ET.ParseError as e:
        print(f"Error parsing RSS feed: {e}")
        return []
    
    episodes = []
    channel = root.find('channel')
    
    if channel is None:
        print("No channel found in RSS feed")
        return []
    
    # Find all items (episodes)
    items = channel.findall('item')
    
    for item in items[:num_episodes]:
        episode_data = {}
        
        # Get title
        title_elem = item.find('title')
        episode_data['title'] = title_elem.text if title_elem is not None else None
        
        # Get iTunes title (often cleaner)
        itunes_title = item.find('itunes:title', NAMESPACES)
        if itunes_title is not None and itunes_title.text:
            episode_data['title'] = itunes_title.text
        
        # Get author/guest
        author_elem = item.find('itunes:author', NAMESPACES)
        author_string = author_elem.text if author_elem is not None else None
        episode_data['guest'] = extract_guest_name(author_string, episode_data.get('title', ''))
        
        # Get image
        itunes_image = item.find('itunes:image', NAMESPACES)
        if itunes_image is not None:
            episode_data['image_url'] = itunes_image.get('href')
        else:
            # Try media:thumbnail
            media_thumb = item.find('media:thumbnail', NAMESPACES)
            if media_thumb is not None:
                episode_data['image_url'] = media_thumb.get('url')
            else:
                episode_data['image_url'] = None
        
        # Get description
        itunes_summary = item.find('itunes:summary', NAMESPACES)
        if itunes_summary is not None and itunes_summary.text:
            episode_data['description'] = itunes_summary.text
        else:
            desc_elem = item.find('description')
            if desc_elem is not None and desc_elem.text:
                # Remove HTML tags from description
                episode_data['description'] = re.sub(r'<[^>]+>', '', desc_elem.text)
            else:
                episode_data['description'] = None
        
        # Get episode link
        link_elem = item.find('link')
        episode_data['link'] = link_elem.text if link_elem is not None else None
        
        # Get publication date
        pub_date = item.find('pubDate')
        episode_data['pub_date'] = pub_date.text if pub_date is not None else None
        
        # Get episode number
        episode_num = item.find('itunes:episode', NAMESPACES)
        episode_data['episode_number'] = int(episode_num.text) if episode_num is not None else None
        
        # Get duration
        duration = item.find('itunes:duration', NAMESPACES)
        episode_data['duration'] = duration.text if duration is not None else None
        
        episodes.append(episode_data)
    
    return episodes


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
        ep_num = ep.get('episode_number', i)
        filename = f"episode_{ep_num}_{guest_name}" if guest_name else f"episode_{ep_num}"
        
        # Download image and get web path
        local_image_path = download_image(ep.get('image_url'), filename)
        
        formatted.append({
            "id": f"podcast2-{ep_num:03d}",
            "title": ep.get('title', f'Episode {ep_num}'),
            "image": local_image_path or "/assets/podcast2/placeholder.png",
            "link": "",  # Internal link (not used for external podcasts)
            "externalLink": ep.get('link', ''),
            "active": True
        })
    
    return formatted


def main():
    print("=" * 60)
    print("Decoding AI for Marketing - Recent Episodes Scraper")
    print("=" * 60)
    print(f"Project root: {PROJECT_ROOT}")
    print(f"Images output: {IMAGES_DIR}")
    print(f"JSON output: {JSON_OUTPUT}")
    print("=" * 60)
    
    episodes = scrape_recent_episodes(num_episodes=3)
    
    if not episodes:
        print("\nNo episodes found. The RSS feed may be unavailable.")
        print("Please check the feed manually at:", RSS_FEED_URL)
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
