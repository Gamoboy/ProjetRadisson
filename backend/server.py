#!/usr/bin/env python3
"""
Serveur backend simplifié pour Radisson Material Management
Utilise Flask et SQLite pour une installation plus simple
"""

from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import sqlite3
import os
import json
from datetime import datetime
import uuid

app = Flask(__name__)
CORS(app)

# Configuration
DATABASE = 'radisson.db'

def init_db():
    """Initialise la base de données SQLite"""
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    
    # Table des employés
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS employees (
            id TEXT PRIMARY KEY,
            firstName TEXT NOT NULL,
            lastName TEXT NOT NULL,
            email TEXT,
            phone TEXT,
            department TEXT NOT NULL,
            position TEXT NOT NULL,
            startDate TEXT NOT NULL,
            endDate TEXT,
            status TEXT DEFAULT 'active',
            address TEXT,
            employeeId TEXT UNIQUE,
            signature TEXT,
            materials TEXT,
            createdAt TEXT,
            updatedAt TEXT
        )
    ''')
    
    # Table des matériels
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS materials (
            id TEXT PRIMARY KEY,
            materialId TEXT UNIQUE,
            type TEXT NOT NULL,
            brand TEXT NOT NULL,
            model TEXT NOT NULL,
            serialNumber TEXT NOT NULL,
            assignedTo TEXT,
            condition TEXT DEFAULT 'Neuf',
            purchaseDate TEXT,
            warrantyEnd TEXT,
            assignedDate TEXT,
            returned BOOLEAN DEFAULT 0,
            returnedDate TEXT,
            createdAt TEXT,
            updatedAt TEXT
        )
    ''')
    
    # Table des signatures
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS signatures (
            id TEXT PRIMARY KEY,
            employeeId TEXT NOT NULL,
            signatureData TEXT NOT NULL,
            documentType TEXT DEFAULT 'restitution',
            createdAt TEXT
        )
    ''')
    
    # Insérer des données exemple
    cursor.execute('SELECT COUNT(*) FROM employees')
    if cursor.fetchone()[0] == 0:
        print("🚀 Insertion de données exemple...")
        
        # Employé exemple
        employee_id = str(uuid.uuid4())
        employee_data = {
            'id': employee_id,
            'firstName': 'Marie',
            'lastName': 'Dupont',
            'email': 'marie.dupont@radisson.com',
            'phone': '+33 6 12 34 56 78',
            'department': 'Réception',
            'position': 'Réceptionniste',
            'startDate': '2024-01-15',
            'status': 'active',
            'employeeId': 'EMP001',
            'address': '123 Rue de l Hôtel, 75001 Paris',
            'signature': '',
            'materials': json.dumps([
                {
                    'materialId': 'MAT001',
                    'type': 'Ordinateur portable',
                    'brand': 'Dell',
                    'model': 'Latitude 5520',
                    'serialNumber': 'DL123456789',
                    'assignedDate': '2024-01-15',
                    'condition': 'Neuf',
                    'returned': False
                }
            ]),
            'createdAt': datetime.now().isoformat(),
            'updatedAt': datetime.now().isoformat()
        }
        
        cursor.execute('''
            INSERT INTO employees VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            employee_data['id'],
            employee_data['firstName'],
            employee_data['lastName'],
            employee_data['email'],
            employee_data['phone'],
            employee_data['department'],
            employee_data['position'],
            employee_data['startDate'],
            employee_data.get('endDate'),
            employee_data['status'],
            employee_data['address'],
            employee_data['employeeId'],
            employee_data['signature'],
            employee_data['materials'],
            employee_data['createdAt'],
            employee_data['updatedAt']
        ))
        
        # Matériel exemple
        material_id = str(uuid.uuid4())
        cursor.execute('''
            INSERT INTO materials VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            material_id,
            'MAT001',
            'Ordinateur portable',
            'Dell',
            'Latitude 5520',
            'DL123456789',
            employee_id,
            'Neuf',
            None,
            None,
            '2024-01-15',
            False,
            None,
            datetime.now().isoformat(),
            datetime.now().isoformat()
        ))
        
        conn.commit()
        print("✅ Données exemple insérées avec succès")
    
    conn.close()

# Routes API
@app.route('/api/employees', methods=['GET'])
def get_employees():
    """Récupère tous les employés"""
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    cursor.execute('SELECT * FROM employees')
    employees = []
    for row in cursor.fetchall():
        employee = dict(row)
        employee['materials'] = json.loads(employee['materials']) if employee['materials'] else []
        employees.append(employee)
    
    conn.close()
    return jsonify(employees)

@app.route('/api/employees/<employee_id>', methods=['GET'])
def get_employee(employee_id):
    """Récupère un employé par son ID"""
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    cursor.execute('SELECT * FROM employees WHERE id = ? OR employeeId = ?', (employee_id, employee_id))
    row = cursor.fetchone()
    
    if not row:
        conn.close()
        return jsonify({'error': 'Employé non trouvé'}), 404
    
    employee = dict(row)
    employee['materials'] = json.loads(employee['materials']) if employee['materials'] else []
    
    conn.close()
    return jsonify(employee)

@app.route('/api/employees', methods=['POST'])
def create_employee():
    """Crée un nouvel employé"""
    data = request.get_json()
    
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    
    employee_id = str(uuid.uuid4())
    employee_data = {
        'id': employee_id,
        'firstName': data['firstName'],
        'lastName': data['lastName'],
        'email': data.get('email'),
        'phone': data.get('phone'),
        'department': data['department'],
        'position': data['position'],
        'startDate': data['startDate'],
        'endDate': data.get('endDate'),
        'status': data.get('status', 'active'),
        'address': data.get('address'),
        'employeeId': data.get('employeeId', f'EMP{uuid.uuid4().hex[:6]}'),
        'signature': data.get('signature', ''),
        'materials': json.dumps(data.get('materials', [])),
        'createdAt': datetime.now().isoformat(),
        'updatedAt': datetime.now().isoformat()
    }
    
    cursor.execute('''
        INSERT INTO employees VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        employee_data['id'],
        employee_data['firstName'],
        employee_data['lastName'],
        employee_data['email'],
        employee_data['phone'],
        employee_data['department'],
        employee_data['position'],
        employee_data['startDate'],
        employee_data.get('endDate'),
        employee_data['status'],
        employee_data['address'],
        employee_data['employeeId'],
        employee_data['signature'],
        employee_data['materials'],
        employee_data['createdAt'],
        employee_data['updatedAt']
    ))
    
    conn.commit()
    conn.close()
    
    return jsonify(employee_data), 201

@app.route('/api/materials', methods=['GET'])
def get_materials():
    """Récupère tous les matériels"""
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    cursor.execute('SELECT * FROM materials')
    materials = [dict(row) for row in cursor.fetchall()]
    
    conn.close()
    return jsonify(materials)

@app.route('/api/materials', methods=['POST'])
def create_material():
    """Crée un nouveau matériel"""
    data = request.get_json()
    
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    
    material_id = str(uuid.uuid4())
    material_data = {
        'id': material_id,
        'materialId': data.get('materialId', f'MAT{uuid.uuid4().hex[:8]}'),
        'type': data['type'],
        'brand': data['brand'],
        'model': data['model'],
        'serialNumber': data['serialNumber'],
        'assignedTo': data.get('assignedTo'),
        'condition': data.get('condition', 'Neuf'),
        'purchaseDate': data.get('purchaseDate'),
        'warrantyEnd': data.get('warrantyEnd'),
        'assignedDate': datetime.now().isoformat() if data.get('assignedTo') else None,
        'returned': False,
        'returnedDate': None,
        'createdAt': datetime.now().isoformat(),
        'updatedAt': datetime.now().isoformat()
    }
    
    cursor.execute('''
        INSERT INTO materials VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        material_data['id'],
        material_data['materialId'],
        material_data['type'],
        material_data['brand'],
        material_data['model'],
        material_data['serialNumber'],
        material_data['assignedTo'],
        material_data['condition'],
        material_data['purchaseDate'],
        material_data['warrantyEnd'],
        material_data['assignedDate'],
        material_data['returned'],
        material_data['returnedDate'],
        material_data['createdAt'],
        material_data['updatedAt']
    ))
    
    conn.commit()
    conn.close()
    
    return jsonify(material_data), 201

@app.route('/api/stats', methods=['GET'])
def get_stats():
    """Récupère les statistiques"""
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    
    # Nombre d'employés actifs
    cursor.execute('SELECT COUNT(*) FROM employees WHERE status = "active"')
    active_employees = cursor.fetchone()[0]
    
    # Nombre total de matériels
    cursor.execute('SELECT COUNT(*) FROM materials')
    total_materials = cursor.fetchone()[0]
    
    # Matériels en attente de retour
    cursor.execute('SELECT COUNT(*) FROM materials WHERE returned = 0 AND assignedTo IS NOT NULL')
    pending_returns = cursor.fetchone()[0]
    
    # Nombre de départements uniques
    cursor.execute('SELECT COUNT(DISTINCT department) FROM employees')
    departments = cursor.fetchone()[0]
    
    conn.close()
    
    return jsonify({
        'activeEmployees': active_employees,
        'totalMaterials': total_materials,
        'pendingReturns': pending_returns,
        'departments': departments
    })

@app.route('/api/signatures', methods=['POST'])
def save_signature():
    """Sauvegarde une signature"""
    data = request.get_json()
    
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    
    signature_id = str(uuid.uuid4())
    cursor.execute('''
        INSERT INTO signatures VALUES (?, ?, ?, ?, ?)
    ''', (
        signature_id,
        data['employeeId'],
        data['signatureData'],
        data.get('documentType', 'restitution'),
        datetime.now().isoformat()
    ))
    
    conn.commit()
    conn.close()
    
    return jsonify({
        'id': signature_id,
        'employeeId': data['employeeId'],
        'documentType': data.get('documentType', 'restitution'),
        'createdAt': datetime.now().isoformat()
    }), 201

@app.route('/api/health', methods=['GET'])
def health_check():
    """Vérifie l'état de l'API"""
    return jsonify({
        'status': 'healthy',
        'database': 'connected',
        'timestamp': datetime.now().isoformat()
    })

@app.route('/', methods=['GET'])
def root():
    """Route racine"""
    return jsonify({
        'message': 'Radisson Hotel Material Management API (Simple)',
        'version': '2.0.0',
        'status': 'running'
    })

if __name__ == '__main__':
    print("🚀 Initialisation de la base de données...")
    init_db()
    
    print("🚀 Démarrage du serveur Flask...")
    app.run(
        host='0.0.0.0',
        port=8000,
        debug=True
    )