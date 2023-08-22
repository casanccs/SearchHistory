from rest_framework.views import APIView
from rest_framework.serializers import ModelSerializer
from rest_framework.response import Response
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import gensim.downloader as api

word2vec_model = api.load("word2vec-google-news-300")
training_data = []
# Create your views here.
class UpdateView(APIView):
    embeddings = []
    def get(self, request): 
        return Response("Get update")

    def post(self, request):
        print(request.data)
        data = request.data['items']
        query = request.data['query']
        print(query)
        training_titled_data = [entry['title'] for entry in data]

        # Example training data
        training_data = [x for x in training_titled_data if not x.startswith(('http','https'))]
        training_data = [word for word in training_data if len(word.split()) > 1]

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
        search_results = vector_search(query, n=3)

        results = []
        for result, similarity in search_results:
            string = result
            print(string)
            results.append(string)

        return Response(results)