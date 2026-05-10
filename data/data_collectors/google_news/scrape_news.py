#!/usr/bin/env python3
"""
Script to scrape Google News articles about "greg stuart mma".
Uses the GNews library for proper article URL resolution and thumbnails.

Output:
- JSON saved to: data/news.json
"""

import requests
import json
import re
import os
import xml.etree.ElementTree as ET
from datetime import datetime
from urllib.parse import quote_plus
from pathlib import Path

# Try to import gnews library
try:
    from gnews import GNews
    HAS_GNEWS = True
except ImportError:
    HAS_GNEWS = False
    print("Warning: gnews library not installed. Run: pip install gnews")


# Get project root (3 levels up from this script)
SCRIPT_DIR = Path(__file__).parent
PROJECT_ROOT = SCRIPT_DIR.parent.parent.parent

# Output directories
IMAGES_DIR = PROJECT_ROOT / "public" / "assets" / "news"
JSON_OUTPUT = PROJECT_ROOT / "data" / "news.json"

# Search query
SEARCH_QUERY = "greg stuart mma"

# Google News RSS feed URL template (for fallback)
RSS_FEED_URL = f"https://news.google.com/rss/search?q={quote_plus(SEARCH_QUERY)}&hl=en-US&gl=US&ceid=US:en"

# Define namespaces used in the RSS feed
NAMESPACES = {
    'media': 'http://search.yahoo.com/mrss/'
}


def fetch_rss_feed(url=RSS_FEED_URL):
    """
    Fetches the RSS feed from the given URL.
    
    Returns:
        bytes: The RSS feed XML content
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


def decode_google_news_url(google_url):
    """
    Decodes a Google News article URL to get the actual article URL.
    Google News URLs contain base64-encoded article information.
    
    Args:
        google_url: The Google News URL
        
    Returns:
        str: The decoded article URL or None if decoding fails
    """
    import base64
    
    try:
        # Extract the article ID from the URL
        # Format: https://news.google.com/rss/articles/CBMi...?oc=5
        if '/articles/' not in google_url:
            return None
            
        article_id = google_url.split('/articles/')[1].split('?')[0]
        
        # The article ID is base64 encoded, but with URL-safe characters
        # Add padding if needed
        padding = 4 - (len(article_id) % 4)
        if padding != 4:
            article_id += '=' * padding
        
        # Decode base64
        try:
            decoded = base64.urlsafe_b64decode(article_id)
            # The decoded data contains the URL, usually after some binary prefix
            # Look for http:// or https:// in the decoded bytes
            decoded_str = decoded.decode('utf-8', errors='ignore')
            
            # Find URLs in the decoded string
            url_match = re.search(r'https?://[^\s<>"\']+', decoded_str)
            if url_match:
                return url_match.group(0)
        except:
            pass
            
    except Exception as e:
        print(f"    Error decoding Google News URL: {e}")
    
        return None


def resolve_google_news_url(google_url):
    """
    Attempts to resolve a Google News redirect URL to the actual article URL.
    Tries multiple methods: decoding, then HTTP redirect following.
    
    Args:
        google_url: The Google News redirect URL
        
    Returns:
        str: The resolved URL or the original URL if resolution fails
    """
    # Method 1: Try to decode the Google News URL
    decoded_url = decode_google_news_url(google_url)
    if decoded_url and decoded_url != google_url:
        return decoded_url
    
    # Method 2: Try to follow HTTP redirects
    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
    
    try:
        # Use GET instead of HEAD for better redirect handling
        response = requests.get(google_url, headers=headers, timeout=15, allow_redirects=True)
        if response.url and response.url != google_url and 'news.google.com' not in response.url:
            return response.url
    except:
        pass
    
    return google_url


def parse_pub_date(pub_date_str):
    """
    Parses the publication date string into a more readable format.
    
    Args:
        pub_date_str: RSS pubDate string (e.g., "Tue, 21 Oct 2025 07:00:00 GMT")
        
    Returns:
        str: Formatted date string
    """
    if not pub_date_str:
        return None
    
    try:
        # Parse the RSS date format
        dt = datetime.strptime(pub_date_str, "%a, %d %b %Y %H:%M:%S %Z")
        return dt.strftime("%Y-%m-%d")
    except:
        return pub_date_str


def download_image(url, filename):
    """
    Downloads an image from a URL and saves it locally.
    
    Args:
        url: The image URL
        filename: The local filename to save to
        
    Returns:
        bool: True if successful, False otherwise
    """
    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
    }
    
    try:
        response = requests.get(url, headers=headers, timeout=15, stream=True)
        response.raise_for_status()
        
        with open(filename, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        return True
    except Exception as e:
        print(f"    Error downloading image: {e}")
        return False


def extract_og_image(url):
    """
    Fetches a webpage and extracts the OpenGraph image URL.
    
    Args:
        url: The article URL
        
    Returns:
        str: The og:image URL or None if not found
    """
    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
    
    try:
        response = requests.get(url, headers=headers, timeout=15, allow_redirects=True)
        response.raise_for_status()
        
        html = response.text
        
        # Look for og:image meta tag
        # Pattern: <meta property="og:image" content="...">
        og_patterns = [
            r'<meta[^>]+property=["\']og:image["\'][^>]+content=["\']([^"\']+)["\']',
            r'<meta[^>]+content=["\']([^"\']+)["\'][^>]+property=["\']og:image["\']',
            r'<meta[^>]+name=["\']twitter:image["\'][^>]+content=["\']([^"\']+)["\']',
            r'<meta[^>]+content=["\']([^"\']+)["\'][^>]+name=["\']twitter:image["\']',
        ]
        
        for pattern in og_patterns:
            match = re.search(pattern, html, re.IGNORECASE)
            if match:
                image_url = match.group(1)
                # Skip placeholder/default images
                if 'placeholder' not in image_url.lower() and 'default' not in image_url.lower():
                    return image_url
        
        return None
    except Exception as e:
        print(f"    Error fetching article page: {e}")
        return None


def get_article_image_with_newspaper(url):
    """
    Uses newspaper3k to extract the top image from an article.
    
    Args:
        url: The article URL
        
    Returns:
        str: The top image URL or None
    """
    try:
        from newspaper import Article
        
        article = Article(url)
        article.download()
        article.parse()
        
        if article.top_image:
            return article.top_image
    except Exception as e:
        print(f"      newspaper3k error: {e}")
    
    return None


def scrape_with_gnews(query, max_articles=5):
    """
    Scrapes Google News using the GNews library.
    This properly resolves article URLs and can get thumbnail images.
    
    Args:
        query: Search query
        max_articles: Maximum number of articles
        
    Returns:
        list: List of article dictionaries with title, url, image, etc.
    """
    if not HAS_GNEWS:
        return []
    
    try:
        google_news = GNews(language='en', country='US', max_results=max_articles)
        articles = google_news.get_news(query)
        
        result = []
        for article in articles[:max_articles]:
            # GNews returns articles with these fields:
            # title, description, published date, url, publisher
            article_data = {
                'title': article.get('title', ''),
                'url': article.get('url', ''),
                'published_date': article.get('published date', ''),
                'description': article.get('description', ''),
                'publisher': article.get('publisher', {})
            }
            
            # Try to get the full article with image using newspaper3k directly
            article_url = article.get('url', '')
            if article_url:
                print(f"      Trying newspaper3k on: {article_url[:50]}...")
                top_image = get_article_image_with_newspaper(article_url)
                if top_image:
                    article_data['top_image'] = top_image
                    print(f"      Found image: {top_image[:50]}...")
                else:
                    article_data['top_image'] = None
            else:
                article_data['top_image'] = None
            
            result.append(article_data)
        
        return result
        
    except Exception as e:
        print(f"    Error using GNews: {e}")
        return []


def scrape_google_news_html(query, max_articles=5):
    """
    Scrapes Google News HTML search results to get article thumbnails.
    This extracts the actual thumbnails shown on the Google News website.
    
    Args:
        query: Search query
        max_articles: Maximum number of articles
        
    Returns:
        dict: Mapping of article titles to thumbnail URLs
    """
    from urllib.parse import quote_plus
    
    url = f"https://www.google.com/search?q={quote_plus(query)}&tbm=nws&num={max_articles}"
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
    }
    
    thumbnails = {}
    
    try:
        response = requests.get(url, headers=headers, timeout=15)
        response.raise_for_status()
        html = response.text
        
        # Google News search results include image URLs in the HTML
        # Look for image sources in the search results
        # Pattern for data-src or src attributes with image URLs
        
        # Find all image URLs that look like article thumbnails
        # Google often uses encrypted-tbn URLs for thumbnails
        img_patterns = [
            r'src="(https://encrypted-tbn[^"]+)"',
            r'data-src="(https://encrypted-tbn[^"]+)"',
            r'srcset="(https://[^"\s]+(?:jpg|jpeg|png|webp)[^"\s]*)',
        ]
        
        found_images = []
        for pattern in img_patterns:
            matches = re.findall(pattern, html)
            found_images.extend(matches)
        
        # Return unique images
        seen = set()
        unique_images = []
        for img in found_images:
            if img not in seen and 'encrypted-tbn' in img:
                seen.add(img)
                unique_images.append(img)
        
        return unique_images[:max_articles]
        
    except Exception as e:
        print(f"    Error scraping Google News HTML: {e}")
        return []


def scrape_news_articles(max_articles=5, resolve_urls=False, download_images=True):
    """
    Scrapes news articles from the Google News RSS feed.
    
    Args:
        max_articles: Maximum number of articles to retrieve (None for all)
        resolve_urls: Whether to attempt to resolve Google News redirect URLs
        download_images: Whether to download article thumbnails
        
    Returns:
        list: A list of dictionaries containing article info
    """
    xml_content = fetch_rss_feed()
    
    if not xml_content:
        return []
    
    try:
        root = ET.fromstring(xml_content)
    except ET.ParseError as e:
        print(f"Error parsing RSS feed: {e}")
        return []
    
    articles = []
    channel = root.find('channel')
    
    if channel is None:
        print("No channel found in RSS feed")
        return []
    
    # Find all items (articles)
    items = channel.findall('item')
    
    if max_articles:
        items = items[:max_articles]
    
    # Ensure images directory exists
    if download_images:
        os.makedirs(IMAGES_DIR, exist_ok=True)
        
        # Pre-fetch thumbnails from Google News HTML search results
        print("  Fetching thumbnails from Google News HTML...")
        html_thumbnails = scrape_google_news_html(SEARCH_QUERY, max_articles)
        print(f"    Found {len(html_thumbnails)} thumbnails from HTML")
    else:
        html_thumbnails = []
    
    for idx, item in enumerate(items, 1):
        article_data = {}
        
        # Get title
        title_elem = item.find('title')
        if title_elem is not None and title_elem.text:
            # Clean up title - remove source suffix if present
            title = title_elem.text
            # Title format: "Article Title - Source Name"
            if ' - ' in title:
                parts = title.rsplit(' - ', 1)
                article_data['title'] = parts[0]
            else:
                article_data['title'] = title
        else:
            article_data['title'] = None
        
        # Get link
        link_elem = item.find('link')
        google_link = link_elem.text if link_elem is not None else None
        article_data['google_news_link'] = google_link
        
        # Optionally resolve the actual article URL
        if resolve_urls and google_link:
            print(f"  Resolving URL for: {article_data['title'][:50]}...")
            article_data['article_link'] = resolve_google_news_url(google_link)
        else:
            article_data['article_link'] = google_link
        
        # Get source
        source_elem = item.find('source')
        if source_elem is not None:
            article_data['source'] = source_elem.text
            article_data['source_url'] = source_elem.get('url')
        else:
            article_data['source'] = None
            article_data['source_url'] = None
        
        # Get publication date
        pub_date = item.find('pubDate')
        article_data['pub_date_raw'] = pub_date.text if pub_date is not None else None
        article_data['pub_date'] = parse_pub_date(pub_date.text) if pub_date is not None else None
        
        # Get GUID
        guid_elem = item.find('guid')
        article_data['guid'] = guid_elem.text if guid_elem is not None else None
        
        # Get thumbnail - try multiple methods
        thumbnail_url = None
        local_image_path = None
        
        # Method 1: Use thumbnail from Google News HTML (best quality)
        if idx <= len(html_thumbnails):
            thumbnail_url = html_thumbnails[idx - 1]
            print(f"  Using HTML thumbnail for article {idx}")
        
        # Method 2: Check for media:content in RSS
        if not thumbnail_url:
            media_content = item.find('media:content', NAMESPACES)
            if media_content is not None:
                thumbnail_url = media_content.get('url')
        
        # Method 3: Check for enclosure element
        if not thumbnail_url:
            enclosure = item.find('enclosure')
            if enclosure is not None and enclosure.get('type', '').startswith('image/'):
                thumbnail_url = enclosure.get('url')
        
        # Method 4: Fetch article page and extract og:image (fallback)
        if not thumbnail_url and download_images:
            print(f"  Fetching og:image for article {idx}...")
            actual_url = resolve_google_news_url(google_link) if google_link else None
            if actual_url:
                thumbnail_url = extract_og_image(actual_url)
                if thumbnail_url:
                    print(f"    Found og:image: {thumbnail_url[:60]}...")
                else:
                    print(f"    No og:image found")
        
        article_data['thumbnail_url'] = thumbnail_url
        
        # Download the image if we found one
        if download_images and thumbnail_url:
            # Determine file extension from URL
            ext = '.jpg'
            if '.png' in thumbnail_url.lower():
                ext = '.png'
            elif '.webp' in thumbnail_url.lower():
                ext = '.webp'
            
            image_filename = f"news_article_{idx}{ext}"
            local_path = IMAGES_DIR / image_filename
            
            print(f"  Downloading thumbnail for article {idx}...")
            if download_image(thumbnail_url, local_path):
                local_image_path = f"/assets/news/{image_filename}"
                print(f"    Saved to {local_path}")
            else:
                print(f"    Failed to download thumbnail")
        
        article_data['local_image'] = local_image_path
        articles.append(article_data)
    
    return articles


def format_for_billboard(articles):
    """
    Formats scraped articles into the Billboard component JSON format.
    
    Args:
        articles: List of scraped article data
        
    Returns:
        list: Formatted data for Billboard component
    """
    formatted = []
    
    for i, article in enumerate(articles, 1):
        # Use downloaded local image if available, otherwise use placeholder
        image_path = article.get('local_image')
        if not image_path:
            image_path = "/assets/news/news-placeholder.png"
        
        formatted.append({
            "id": f"news-{i:03d}",
            "title": article.get('title', f'News Article {i}'),
            "image": image_path,
            "link": "",  # Internal link
            "externalLink": article.get('google_news_link', ''),
            "active": True
        })
    
    return formatted


def main():
    print("=" * 70)
    print(f"Google News Scraper - '{SEARCH_QUERY}'")
    print("=" * 70)
    print(f"Project root: {PROJECT_ROOT}")
    print(f"JSON output: {JSON_OUTPUT}")
    print(f"Images dir: {IMAGES_DIR}")
    print(f"GNews library available: {HAS_GNEWS}")
    print("=" * 70)
    
    # Create images directory
    os.makedirs(IMAGES_DIR, exist_ok=True)
    
    # Try GNews first (better image support)
    if HAS_GNEWS:
        print(f"\nFetching articles using GNews library...")
        print(f"Search query: {SEARCH_QUERY}")
        
        gnews_articles = scrape_with_gnews(SEARCH_QUERY, max_articles=5)
        
        if gnews_articles:
            print(f"Found {len(gnews_articles)} articles via GNews")
            
            formatted_articles = []
            for i, article in enumerate(gnews_articles, 1):
                print(f"\n{i}. {article.get('title', 'N/A')[:60]}...")
                
                # Get image URL
                image_url = article.get('top_image')
                local_image_path = None
                
                # If no top_image, try to fetch og:image from the article URL
                if not image_url and article.get('url'):
                    print(f"   Fetching og:image from article...")
                    image_url = extract_og_image(article.get('url'))
                
                if image_url:
                    print(f"   Image: {image_url[:50]}...")
                    
                    # Download image
                    ext = '.jpg'
                    if '.png' in image_url.lower():
                        ext = '.png'
                    elif '.webp' in image_url.lower():
                        ext = '.webp'
                    
                    image_filename = f"news_article_{i}{ext}"
                    local_path = IMAGES_DIR / image_filename
                    
                    if download_image(image_url, local_path):
                        local_image_path = f"/assets/news/{image_filename}"
                        print(f"   Saved: {image_filename}")
                else:
                    print(f"   No image found")
                
                # Get publisher info
                publisher = article.get('publisher', {})
                source_name = publisher.get('title', 'Unknown') if isinstance(publisher, dict) else str(publisher)
                
                formatted_articles.append({
                    "id": f"news-{i:03d}",
                    "title": article.get('title', f'News Article {i}'),
                    "image": local_image_path or "/assets/news/news-placeholder.png",
                    "link": "",
                    "externalLink": article.get('url', ''),
                    "active": True
                })
            
            # Save formatted articles
            with open(JSON_OUTPUT, 'w') as f:
                json.dump(formatted_articles, f, indent=2)
            print(f"\n{'=' * 70}")
            print(f"Data saved to {JSON_OUTPUT}")
            
            # Save detailed data locally
            local_json = SCRIPT_DIR / "news_articles.json"
            with open(local_json, 'w') as f:
                json.dump(gnews_articles, f, indent=2, default=str)
            print(f"Detailed data saved to {local_json}")
            
            return
    
    # Fallback to RSS feed method
    print(f"\nFalling back to RSS feed method...")
    
    # Scrape articles (limit to 5 for billboard display)
    articles = scrape_news_articles(max_articles=5, resolve_urls=False, download_images=True)
    
    if not articles:
        print("\nNo articles found.")
        return
    
    print(f"\n{'=' * 70}")
    print(f"Found {len(articles)} article(s):")
    print("=" * 70)
    
    for i, article in enumerate(articles, 1):
        print(f"\n{i}. {article.get('title', 'N/A')}")
        print(f"   Source: {article.get('source', 'N/A')}")
        print(f"   Date: {article.get('pub_date', 'N/A')}")
        print(f"   Thumbnail: {article.get('thumbnail_url', 'None')[:60] + '...' if article.get('thumbnail_url') else 'None'}")
        print(f"   Local image: {article.get('local_image', 'None')}")
    
    # Format for Billboard component
    formatted_articles = format_for_billboard(articles)
    
    # Save to main data folder
    os.makedirs(JSON_OUTPUT.parent, exist_ok=True)
    os.makedirs(IMAGES_DIR, exist_ok=True)
    
    with open(JSON_OUTPUT, 'w') as f:
        json.dump(formatted_articles, f, indent=2)
    print(f"\n{'=' * 70}")
    print(f"Data saved to {JSON_OUTPUT}")
    
    # Also save detailed data locally for reference
    local_json = SCRIPT_DIR / "news_articles.json"
    with open(local_json, 'w') as f:
        json.dump(articles, f, indent=2)
    print(f"Detailed data saved to {local_json}")
    
    # Also save a summary CSV for easy viewing
    csv_file = SCRIPT_DIR / "news_articles.csv"
    with open(csv_file, 'w') as f:
        f.write("Date,Source,Title,Link\n")
        for article in articles:
            title = (article.get('title') or '').replace('"', '""')
            source = (article.get('source') or '').replace('"', '""')
            date = article.get('pub_date') or ''
            link = article.get('google_news_link') or ''
            f.write(f'"{date}","{source}","{title}","{link}"\n')
    print(f"Summary saved to {csv_file}")


if __name__ == "__main__":
    main()
