from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
import os
from dotenv import load_dotenv
from datetime import date

load_dotenv()

app = Flask(__name__)
CORS(app)

def get_db():
    return mysql.connector.connect(
        host=os.getenv("DB_HOST", "localhost"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        database=os.getenv("DB_NAME")
    )

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    print('Login request data:', data)
    email = data.get('email')
    password = data.get('password')
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM user WHERE Email=%s", (email,))
    user = cursor.fetchone()
    print('User fetched from DB:', user)
    db.close()
    if user and user['Password'] == password:
        print('Login successful for:', email)
        return jsonify({"success": True, "user": {"UserID": user["UserID"], "Name": user["Name"], "UserType": user["UserType"]}})
    print('Login failed for:', email)
    return jsonify({"success": False, "message": "Invalid credentials"}), 401

@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    name = data.get('name')
    email = data.get('email')
    phone = data.get('phone')
    password = data.get('password')
    if not name or not email or not phone or not password:
        return jsonify({"success": False, "message": "All fields are required."}), 400
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM user WHERE Email=%s", (email,))
    if cursor.fetchone():
        db.close()
        return jsonify({"success": False, "message": "Email already registered."}), 409
    cursor.execute(
        "INSERT INTO user (Name, Email, Phone, Password, UserType) VALUES (%s, %s, %s, %s, %s)",
        (name, email, phone, password, 'customer')
    )
    db.commit()
    db.close()
    return jsonify({"success": True, "message": "User registered successfully."})

@app.route('/movies', methods=['GET'])
def get_movies():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM movie")
    movies = cursor.fetchall()
    db.close()
    mapped_movies = []
    for m in movies:
        mapped_movies.append({
            "id": m["MovieID"],
            "title": m["Title"],
            "posterUrl": m["PosterUrl"] or "https://via.placeholder.com/300x450?text=" + m["Title"].replace(" ", "+"),
            "description": m["Description"] or "No description available.",
            "releaseDate": str(m["ReleaseDate"]),
            "duration": m["Duration"],
            "genre": [g.strip() for g in m["Genre"].split(",")],
            "rating": str(m["Rating"]),
            "director": "Unknown",
            "cast": [],
            "language": m["Language"],
            "featured": False
        })
    return jsonify(mapped_movies)

@app.route('/movies/now', methods=['GET'])
def get_now_showing_movies():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    today = date.today().isoformat()
    cursor.execute('''
        SELECT DISTINCT m.* FROM movie m
        JOIN movieshow s ON m.MovieID = s.MovieID
        WHERE s.Date = %s
    ''', (today,))
    movies = cursor.fetchall()
    db.close()
    mapped_movies = []
    for m in movies:
        mapped_movies.append({
            "id": m["MovieID"],
            "title": m["Title"],
            "posterUrl": m["PosterUrl"] or "https://via.placeholder.com/300x450?text=" + m["Title"].replace(" ", "+"),
            "description": m["Description"] or "No description available.",
            "releaseDate": str(m["ReleaseDate"]),
            "duration": m["Duration"],
            "genre": [g.strip() for g in m["Genre"].split(",")],
            "rating": str(m["Rating"]),
            "director": "Unknown",
            "cast": [],
            "language": m["Language"],
            "featured": False
        })
    return jsonify(mapped_movies)

@app.route('/movies/past', methods=['GET'])
def get_past_movies():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    today = date.today().isoformat()
    cursor.execute('''
        SELECT DISTINCT m.* FROM movie m
        JOIN movieshow s ON m.MovieID = s.MovieID
        WHERE s.Date < %s
    ''', (today,))
    movies = cursor.fetchall()
    db.close()
    mapped_movies = []
    for m in movies:
        mapped_movies.append({
            "id": m["MovieID"],
            "title": m["Title"],
            "posterUrl": m["PosterUrl"] or "https://via.placeholder.com/300x450?text=" + m["Title"].replace(" ", "+"),
            "description": m["Description"] or "No description available.",
            "releaseDate": str(m["ReleaseDate"]),
            "duration": m["Duration"],
            "genre": [g.strip() for g in m["Genre"].split(",")],
            "rating": str(m["Rating"]),
            "director": "Unknown",
            "cast": [],
            "language": m["Language"],
            "featured": False
        })
    return jsonify(mapped_movies)

@app.route('/movies/upcoming', methods=['GET'])
def get_upcoming_movies():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    today = date.today().isoformat()
    cursor.execute('''
        SELECT DISTINCT m.* FROM movie m
        JOIN movieshow s ON m.MovieID = s.MovieID
        WHERE s.Date > %s
    ''', (today,))
    movies = cursor.fetchall()
    db.close()
    mapped_movies = []
    for m in movies:
        mapped_movies.append({
            "id": m["MovieID"],
            "title": m["Title"],
            "posterUrl": m["PosterUrl"] or "https://via.placeholder.com/300x450?text=" + m["Title"].replace(" ", "+"),
            "description": m["Description"] or "No description available.",
            "releaseDate": str(m["ReleaseDate"]),
            "duration": m["Duration"],
            "genre": [g.strip() for g in m["Genre"].split(",")],
            "rating": str(m["Rating"]),
            "director": "Unknown",
            "cast": [],
            "language": m["Language"],
            "featured": False
        })
    return jsonify(mapped_movies)

@app.route('/movie/<int:movie_id>', methods=['GET'])
def get_movie_by_id(movie_id):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM movie WHERE MovieID = %s", (movie_id,))
    m = cursor.fetchone()
    db.close()
    if not m:
        return jsonify({}), 404
    return jsonify({
        "id": m["MovieID"],
        "title": m["Title"],
        "posterUrl": m["PosterUrl"] or "https://via.placeholder.com/300x450?text=" + m["Title"].replace(" ", "+"),
        "description": m["Description"] or "No description available.",
        "releaseDate": str(m["ReleaseDate"]),
        "duration": m["Duration"],
        "genre": [g.strip() for g in m["Genre"].split(",")],
        "rating": str(m["Rating"]),
        "director": "Unknown",
        "cast": [],
        "language": m["Language"],
        "featured": False
    })

@app.route('/showtimes/movie/<int:movie_id>', methods=['GET'])
def get_showtimes_by_movie_id(movie_id):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM movieshow WHERE MovieID = %s", (movie_id,))
    showtimes = cursor.fetchall()
    db.close()
    # Convert date/time fields to string for JSON serialization
    for s in showtimes:
        if 'Date' in s and hasattr(s['Date'], 'isoformat'):
            s['Date'] = s['Date'].isoformat()
        if 'ShowTime' in s:
            s['ShowTime'] = str(s['ShowTime'])
    return jsonify(showtimes)

@app.route('/showtime/<int:showtime_id>', methods=['GET'])
def get_showtime_by_id(showtime_id):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM movieshow WHERE ShowID = %s", (showtime_id,))
    s = cursor.fetchone()
    if not s:
        db.close()
        return jsonify({}), 404
    cursor.execute("SELECT * FROM movie WHERE MovieID = %s", (s["MovieID"],))
    m = cursor.fetchone()
    # Fetch screen info for seat layout
    screen_id = s["ScreenID"]
    cursor.execute("SELECT * FROM screen WHERE ScreenID = %s", (screen_id,))
    screen = cursor.fetchone()
    db.close()
    seat_capacity = screen["SeatCapacity"] if screen else 96
    # Generate seat layout: try to make it as square as possible
    import math
    n_cols = math.ceil(math.sqrt(seat_capacity))
    n_rows = math.ceil(seat_capacity / n_cols)
    # Use letters for rows (A, B, ...)
    row_labels = [chr(ord('A') + i) for i in range(n_rows)]
    seats = []
    for row_idx, row in enumerate(row_labels):
        for col in range(1, n_cols + 1):
            seat_num = row_idx * n_cols + (col - 1) + 1
            if seat_num > seat_capacity:
                break
            # Mark last 2 rows as premium
            seat_type = 'premium' if row_idx >= n_rows - 2 else 'standard'
            seats.append({
                'id': f'{row}{col}',
                'row': row,
                'number': col,
                'type': seat_type,
                'status': 'available'
            })
    # Convert date/time fields to string for JSON serialization
    if 'Date' in s and hasattr(s['Date'], 'isoformat'):
        s['Date'] = s['Date'].isoformat()
    if 'ShowTime' in s:
        s['ShowTime'] = str(s['ShowTime'])
    for k, v in s.items():
        if type(v).__name__ == 'timedelta':
            s[k] = str(v)
    return jsonify({
        'showtime': s,
        'movie': {
            "id": m["MovieID"],
            "title": m["Title"],
            "posterUrl": m["PosterUrl"] or "https://via.placeholder.com/300x450?text=" + m["Title"].replace(" ", "+"),
            "description": m["Description"] or "No description available.",
            "releaseDate": str(m["ReleaseDate"]),
            "duration": m["Duration"],
            "genre": [g.strip() for g in m["Genre"].split(",")],
            "rating": str(m["Rating"]),
            "director": "Unknown",
            "cast": [],
            "language": m["Language"],
            "featured": False
        },
        'seats': seats
    })

@app.route('/theaters', methods=['GET'])
def get_theaters():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    movie_id = request.args.get('movieId')
    if movie_id:
        cursor.execute('''
            SELECT DISTINCT t.* FROM theater t
            JOIN movieshow s ON t.TheaterID = s.TheaterID
            WHERE s.MovieID = %s
        ''', (movie_id,))
    else:
        cursor.execute('SELECT * FROM theater')
    theaters = cursor.fetchall()
    db.close()
    return jsonify(theaters)

@app.route('/showtimes', methods=['GET'])
def get_showtimes_by_movie_and_theater():
    movie_id = request.args.get('movieId')
    theater_id = request.args.get('theaterId')
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute('''
        SELECT * FROM movieshow
        WHERE MovieID = %s AND TheaterID = %s
        ORDER BY Date, ShowTime
    ''', (movie_id, theater_id))
    showtimes = cursor.fetchall()
    db.close()
    # Convert date/time fields to string for JSON serialization
    for s in showtimes:
        if 'Date' in s and hasattr(s['Date'], 'isoformat'):
            s['Date'] = s['Date'].isoformat()
        if 'ShowTime' in s:
            s['ShowTime'] = str(s['ShowTime'])
    return jsonify(showtimes)

@app.route('/booking', methods=['POST'])
def create_booking():
    data = request.json
    user_id = data.get('userId')
    show_id = data.get('showId')
    total_amount = data.get('totalAmount')
    if not user_id or not show_id or total_amount is None:
        return jsonify({'success': False, 'message': 'Missing required fields'}), 400
    db = get_db()
    cursor = db.cursor()
    cursor.execute(
        "INSERT INTO booking (UserID, ShowID, BookingDate, TotalAmount) VALUES (%s, %s, NOW(), %s)",
        (user_id, show_id, total_amount)
    )
    db.commit()
    booking_id = cursor.lastrowid
    db.close()
    return jsonify({'success': True, 'bookingId': booking_id})

if __name__ == '__main__':
    app.run(debug=True)