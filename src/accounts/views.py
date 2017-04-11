from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.authentication import BasicAuthentication
from rest_framework.authtoken.models import Token
from rest_framework.generics import GenericAPIView
from rest_framework.mixins import CreateModelMixin
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from models import User
from serializers import UserSerializer


class UserLoginView(GenericAPIView):
    serializer_class = UserSerializer
    authentication_classes = (BasicAuthentication,)
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        """User login with username and password."""
        # token = AuthToken.objects.create(request.user)
        # token = Token.objects.create(user=request.user)
        return Response({
            'user': self.get_serializer(request.user).data,
            # 'token': token
        })


