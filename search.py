import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from gensim.models import Word2Vec
import gensim.downloader as api

# Load a pre-trained Word2Vec model
word2vec_model = api.load("word2vec-google-news-300")

# Example training data
training_data = [
   "This is the first document.",
   "This document is the second document.",
   "And this is the third one.",
   "Is this the first document?"
]

embeddings = []
for doc in training_data:
   doc_words = doc.split()
   embeddings.append(np.mean([word2vec_model[word] for word in doc_words if word in word2vec_model], axis=0))


def vector_search(query, n=1):
    query_words = query.split()
    query_embedding = np.mean([word2vec_model[word] for word in query_words if word in word2vec_model], axis=0)

    similarities = cosine_similarity([query_embedding], embeddings)[0]

    sorted_indices = np.argsort(similarities)[::-1]
    return [(training_data[idx], similarities[idx]) for idx in sorted_indices[:n]]

# Search with queries
query = "And this is the third"
search_results = vector_search(query, n=3)

for result, similarity in search_results:
    print(f"Document: {result}\nSimilarity: {similarity:.4f}\n")