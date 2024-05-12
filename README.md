### server

#---только при первом запуске
python -m venv env
#---только при первом запуске

.\env\Scripts\activate

#---только при первом запуске
pip install -r requirements.txt
#---только при первом запуске

cd ./zadachnik_back

#---только при первом запуске
python manage.py makemigrations

python manage.py makemigrations backend

python manage.py migrate

python manage.py loaddata initial_data.json

python manage.py loaddata direction_traning.json

python manage.py loaddata groups.json

python manage.py loaddata users.json

python manage.py createsuperuser
#---только при первом запуске

python manage.py runserver

### client

cd ./frontend

#---только при первом запуске
npm install
#---только при первом запуске

npm start
