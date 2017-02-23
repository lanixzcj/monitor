from django.contrib import admin
from django import forms
from models import UserAction, MyUser, DeviceInfo, MediaInfo, FileInfo, \
    ProcessInfo, IpPacket, TrustHost, WarningHistory, Host, IpPacketsRules, FileRules
from django.contrib.auth.models import Group
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.forms import ReadOnlyPasswordHashField
# Register your models here.


class UserCreationForm(forms.ModelForm):
    """A form for creating new users. Includes all the required
    fields, plus a repeated password."""
    password1 = forms.CharField(label='Password', widget=forms.PasswordInput)
    password2 = forms.CharField(label='Password confirmation', widget=forms.PasswordInput)

    class Meta:
        model = MyUser
        fields = ('username', 'password', 'mac_address', 'email', 'tel')

    def clean_password2(self):
        # Check that the two password entries match
        password1 = self.cleaned_data.get("password1")
        password2 = self.cleaned_data.get("password2")
        if password1 and password2 and password1 != password2:
            raise forms.ValidationError("Passwords don't match")
        return password2

    def save(self, commit=True):
        # Save the provided password in hashed format
        user = super(UserCreationForm, self).save(commit=False)
        user.set_password(self.cleaned_data["password1"])
        if commit:
            user.save()
        return user


class UserChangeForm(forms.ModelForm):
    """A form for updating users. Includes all the fields on
    the user, but replaces the password field with admin's
    password hash display field.
    """
    password = ReadOnlyPasswordHashField()

    class Meta:
        model = MyUser
        fields = ('username', 'password', 'mac_address', 'email', 'tel', 'is_active', 'is_admin')

    def clean_password(self):
        # Regardless of what the user provides, return the initial value.
        # This is done here, rather than on the field, because the
        # field does not have access to the initial value
        return self.initial["password"]


class MyUserAdmin(UserAdmin):
    # The forms to add and change user instances
    form = UserChangeForm
    add_form = UserCreationForm

    # The fields to be used in displaying the User model.
    # These override the definitions on the base UserAdmin
    # that reference specific fields on auth.User.
    list_display = ('username', 'password', 'mac_address', 'email', 'tel', 'is_admin')
    list_filter = ('is_admin', 'groups',)
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal info', {'fields': ('mac_address', 'email', 'tel',)}),
        ('Permissions', {'fields': ('is_admin', 'groups','user_permissions',)}),
    )
    # add_fieldsets is not a standard ModelAdmin attribute. UserAdmin
    # overrides get_fieldsets to use this attribute when creating a user.
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'mac_address', 'email', 'tel', 'password1', 'password2')}
        ),
    )
    search_fields = ('username',)
    ordering = ('username',)
    filter_horizontal = ('groups', 'user_permissions',)


admin.site.register(MyUser, MyUserAdmin)

admin.site.register(UserAction)
admin.site.register(DeviceInfo)
admin.site.register(MediaInfo)
admin.site.register(FileInfo)
admin.site.register(ProcessInfo)
admin.site.register(IpPacket)
admin.site.register(TrustHost)
admin.site.register(WarningHistory)
admin.site.register(Host)
admin.site.register(IpPacketsRules)
admin.site.register(FileRules)