from django.conf.urls import url
from django.utils.translation import ugettext_lazy as _

import views as account_views

urlpatterns = [
    url(_(r'^login/$'), account_views.UserLoginView.as_view(), name='login'),

]
