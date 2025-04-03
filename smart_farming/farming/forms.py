from django import forms

class CropForm(forms.Form):
    soil_type = forms.ChoiceField(choices=[('Loamy', 'Loamy'), ('Sandy', 'Sandy'), ('Clay', 'Clay')])
    temperature = forms.FloatField()
    rainfall = forms.FloatField()
