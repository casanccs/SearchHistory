from rest_framework.views import APIView
from rest_framework.serializers import ModelSerializer
from rest_framework.response import Response

# Create your views here.
class UpdateView(APIView):
    
    def get(self, request): 
        return Response("Get update")

    def post(self, request):
        data = request.data
        print(data)
        return Response("Recieved data")