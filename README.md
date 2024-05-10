### server

.\env\Scripts\activate

cd ./zadachnik_back

python manage.py makemigrations

python manage.py migrate

python manage.py loaddata initial_data.json

python manage.py loaddata direction_traning.json

python manage.py loaddata groups.json

python manage.py loaddata users.json

python manage.py createsuperuser

python manage.py runserver

### client

cd ./frontend

npm start
