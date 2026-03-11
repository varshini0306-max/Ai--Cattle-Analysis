"""
CattleAI Backend - Main Application
Integrates with VARSHINI-II-MCA frontend
"""
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
import uuid
import logging
from datetime import datetime

from models.predictor import CattleHealthPredictor
from database.db_manager import DatabaseManager

app = Flask(__name__)
CORS(app)

# Configuration
app.config['MAX_CONTENT_LENGTH'] = 100 * 1024 * 1024  # 100MB
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['ALLOWED_EXTENSIONS'] = {'png', 'jpg', 'jpeg', 'gif', 'webp', 'mp4', 'avi', 'mov', 'mkv'}

# ✅ FIX: Setup logger directly using Python's built-in logging
os.makedirs('logs', exist_ok=True)
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('logs/app.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Initialize components
predictor = CattleHealthPredictor()
db_manager = DatabaseManager()

os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

@app.route('/')
def index():
    """Health check"""
    return jsonify({
        'status': 'healthy',
        'service': 'CattleAI Backend API',
        'version': '1.0.0',
        'timestamp': datetime.now().isoformat(),
        'frontend_compatible': 'VARSHINI-II-MCA'
    })

@app.route('/api/predict', methods=['POST'])
def predict():
    """Main prediction endpoint - called from prediction.html"""
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        if file.filename == '' or not allowed_file(file.filename):
            return jsonify({'error': 'Invalid file'}), 400
        
        # Get form data from frontend
        cattle_id = request.form.get('cattle_id', 'unknown')
        cattle_breed = request.form.get('cattle_breed', 'unknown')
        cattle_age = request.form.get('cattle_age', 'unknown')
        upload_type = request.form.get('upload_type', 'image')
        
        # Save file
        filename = secure_filename(file.filename)
        unique_filename = f"{uuid.uuid4()}_{filename}"
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
        file.save(filepath)
        
        logger.info(f"File uploaded: {unique_filename}, Type: {upload_type}")
        
        # Get AI prediction
        result = predictor.analyze(
            filepath=filepath,
            file_type=upload_type,
            cattle_info={
                'id': cattle_id,
                'breed': cattle_breed,
                'age': cattle_age
            }
        )
        
        # Add metadata
        result['metadata'] = {
            'filename': filename,
            'upload_time': datetime.now().isoformat(),
            'cattle_id': cattle_id,
            'cattle_breed': cattle_breed,
            'cattle_age': cattle_age
        }
        
        # Save to database
        prediction_id = db_manager.save_prediction(result)
        result['prediction_id'] = prediction_id
        
        logger.info(f"Prediction completed: ID={prediction_id}")
        
        return jsonify(result), 200
        
    except Exception as e:
        logger.error(f"Prediction error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/history', methods=['GET'])
def get_history():
    """Get prediction history"""
    try:
        cattle_id = request.args.get('cattle_id')
        limit = int(request.args.get('limit', 50))
        offset = int(request.args.get('offset', 0))
        
        history = db_manager.get_prediction_history(cattle_id, limit, offset)
        return jsonify({'count': len(history), 'predictions': history}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/statistics', methods=['GET'])
def get_statistics():
    """Get overall statistics"""
    try:
        stats = db_manager.get_statistics()
        return jsonify(stats), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/diseases', methods=['GET'])
def get_diseases():
    """Get list of all diseases"""
    diseases = [
        'Digital Dermatitis',
        'Sole Ulcer',
        'White Line Disease',
        'Laminitis',
        'Joint Infection',
        'Hoof Overgrowth'
    ]
    return jsonify({'diseases': diseases}), 200

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    """Serve uploaded files"""
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

if __name__ == '__main__':
    os.makedirs('uploads', exist_ok=True)
    os.makedirs('logs', exist_ok=True)
    os.makedirs('app/database', exist_ok=True)
    
    app.run(host='0.0.0.0', port=5000, debug=True)