# Generated by Django 5.2.3 on 2025-07-01 14:07

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('study_material_hub', '0007_alter_studymaterial_uploaded_by'),
    ]

    operations = [
        migrations.AlterField(
            model_name='studymaterial',
            name='uploaded_by',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
    ]
