# Generated by Django 4.2.17 on 2024-12-26 22:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('events', '0002_alter_salsa_time_alter_salsa_table'),
    ]

    operations = [
        migrations.AlterField(
            model_name='salsa',
            name='time',
            field=models.TimeField(blank=True, null=True),
        ),
    ]