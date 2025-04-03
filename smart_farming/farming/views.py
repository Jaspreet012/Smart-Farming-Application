from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from .models import CropRecommendation
from .forms import CropForm

def home(request):
    return render(request, 'home.html')

@login_required
def recommend_crop(request):
    if request.method == 'POST':
        form = CropForm(request.POST)
        if form.is_valid():
            soil_type = form.cleaned_data['soil_type']
            temperature = form.cleaned_data['temperature']
            rainfall = form.cleaned_data['rainfall']

            if soil_type == 'Loamy' and temperature > 20 and rainfall > 100:
                crop = 'Wheat'
            else:
                crop = 'Rice'

            recommendation = CropRecommendation(
                farmer=request.user.farmer,
                soil_type=soil_type,
                temperature=temperature,
                rainfall=rainfall,
                recommended_crop=crop
            )
            recommendation.save()
            return render(request, 'recommendation.html', {'crop': crop})

    else:
        form = CropForm()
    return render(request, 'recommend_form.html', {'form': form})
