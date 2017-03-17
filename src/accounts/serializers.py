from rest_framework import serializers

from accounts.models import User
from lib.utils import validate_email as email_is_valid


# Serializers define the API representation.
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'email')

