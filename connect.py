import requests

# 1️⃣ Search for a book by title
search_url = "https://openlibrary.org/search.json"
params = {"q": "The Hobbit"}  # Search query for the book title
response = requests.get(search_url, params=params)

if response.status_code == 200:
    search_results = response.json()
    print(f"Found {search_results['numFound']} results.")
    first_book = search_results['docs'][0]  # Get the first result
    print("Title:", first_book['title'])
    print("Author:", first_book.get('author_name', 'Unknown'))
    print("First Publish Year:", first_book.get('first_publish_year', 'Unknown'))
else:
    print("Failed to fetch data from Open Library.")

# 2️⃣ Get book details by OLID (Open Library ID)
olid = first_book['key'].split('/')[-1]  # Extract the OLID from the key
book_details_url = f"https://openlibrary.org/works/{olid}.json"
response = requests.get(book_details_url)

if response.status_code == 200:
    book_details = response.json()
    print("\n📚 Book Details 📚")
    print("Title:", book_details.get('title', 'Unknown'))
    print("Description:", book_details.get('description', 'No description available'))
else:
    print("Failed to fetch book details.")
    