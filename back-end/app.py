from dotenv import load_dotenv

load_dotenv()

from flask import Flask
from flask_cors import CORS

from infrastructure.database.schema import init_db
from presentation.blueprints.auth import bp as auth_bp
from presentation.blueprints.emergency import bp as emergency_bp
from presentation.blueprints.events import bp as events_bp
from presentation.blueprints.notes import bp as notes_bp
from presentation.blueprints.onboarding import bp as onboarding_bp
from presentation.blueprints.projects import bp as projects_bp
from presentation.blueprints.tasks import bp as tasks_bp

app = Flask(__name__)
CORS(app, resources={r'/api/*': {'origins': '*'}})
init_db()
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(notes_bp, url_prefix='/api/notes')
app.register_blueprint(onboarding_bp, url_prefix='/api/onboarding')
app.register_blueprint(tasks_bp, url_prefix='/api/tasks')
app.register_blueprint(events_bp, url_prefix='/api/events')
app.register_blueprint(projects_bp, url_prefix='/api/projects')
app.register_blueprint(emergency_bp, url_prefix='/api')

if __name__ == '__main__':
  app.run(debug=True, host='0.0.0.0')
