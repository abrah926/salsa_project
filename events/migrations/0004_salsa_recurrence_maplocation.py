# Generated by Django 4.2.17 on 2024-12-27 00:21

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('events', '0003_alter_salsa_time'),
    ]

    operations = [
        migrations.AddField(
            model_name='salsa',
            name='recurrence',
            field=models.CharField(blank=True, choices=[('DAILY', 'Daily'), ('WEEKLY', 'Weekly'), ('MONTHLY', 'Monthly')], max_length=50, null=True),
        ),
        migrations.CreateModel(
            name='MapLocation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('latitude', models.FloatField()),
                ('longitude', models.FloatField()),
                ('event', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='map_location', to='events.salsa')),
            ],
        ),
    ]
