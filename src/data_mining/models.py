from __future__ import unicode_literals

from django.db import models
from rest_framework import serializers


class WarningGenerules(models.Model):
    time = models.CharField(max_length=30)
    userid = models.CharField(max_length=30)
    description = models.CharField(max_length=100)
    rank = models.IntegerField()
    species = models.CharField(max_length=30)
    fit = models.FloatField()

    def __unicode__(self):
        return self.species


class WarningResults(models.Model):
    time = models.CharField(max_length=30)
    userid = models.CharField(max_length=30)
    description = models.CharField(max_length=100)
    rank = models.IntegerField()
    species = models.CharField(max_length=30)
    type = models.IntegerField()
    support = models.FloatField()

    def __unicode__(self):
        return self.species
