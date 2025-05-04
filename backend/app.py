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
        SELECT * FROM movie
        WHERE ReleaseDate > %s
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
    screen_id = s["ScreenID"]
    # Get only booked seats for this screen
    cursor.execute("SELECT SeatNumber FROM seat WHERE ScreenID = %s AND Availability = 0", (screen_id,))
    booked_seats = [row['SeatNumber'] for row in cursor.fetchall()]
    db.close()
    # Generate all possible seats (A1-H12)
    rows = ['A','B','C','D','E','F','G','H']
    seats_per_row = 12
    seats = []
    for row in rows:
        for i in range(1, seats_per_row + 1):
            seat_number = f"{row}{i}"
            # Mark premium at the back (rows G and H)
            if row in ['G', 'H']:
                seat_type = 'premium'
            else:
                seat_type = 'regular'
            seats.append({
                'id': seat_number,
                'row': row,
                'number': i,
                'type': seat_type,
                'status': 'reserved' if seat_number in booked_seats else 'available'
            })
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
    seat_numbers = data.get('seatNumbers', [])  # e.g. ['A1', 'B4']
    seat_types = data.get('seatTypes', [])      # e.g. ['Regular', 'Premium']

    if not user_id or not show_id or total_amount is None or not seat_numbers:
        return jsonify({'success': False, 'message': 'Missing required fields'}), 400

    db = get_db()
    cursor = db.cursor(dictionary=True)
    try:
        # Get ScreenID for this show
        cursor.execute("SELECT ScreenID FROM movieshow WHERE ShowID = %s", (show_id,))
        show = cursor.fetchone()
        if not show:
            db.close()
            return jsonify({'success': False, 'message': 'Show not found'}), 404
        screen_id = show['ScreenID']

        # Insert booking
        cursor = db.cursor()
        cursor.execute(
            "INSERT INTO booking (UserID, ShowID, BookingDate, TotalAmount) VALUES (%s, %s, NOW(), %s)",
            (user_id, show_id, total_amount)
        )
        db.commit()
        booking_id = cursor.lastrowid

        # For each seatNumber, update or insert into seat table as booked
        for idx, seat_number in enumerate(seat_numbers):
            seat_type = seat_types[idx] if idx < len(seat_types) else 'Regular'
            cursor.execute(
                "UPDATE seat SET Availability = 0 WHERE ScreenID = %s AND SeatNumber = %s",
                (screen_id, seat_number)
            )
            if cursor.rowcount == 0:
                cursor.execute(
                    "INSERT INTO seat (ScreenID, SeatNumber, SeatType, Availability) VALUES (%s, %s, %s, 0)",
                    (screen_id, seat_number, seat_type)
                )
        db.commit()
        db.close()
        return jsonify({'success': True, 'bookingId': booking_id})
    except Exception as e:
        print("Booking error:", e)  # Add this line
        db.rollback()
        db.close()
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/populate-seats/<int:screen_id>', methods=['POST'])
def populate_seats(screen_id):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
    seats_per_row = 12
    inserted = 0
    for row in rows:
        for i in range(1, seats_per_row + 1):
            seat_number = f"{row}{i}"
            # Determine seat type
            if (row == 'D' or row == 'E') and 4 <= i <= 9:
                seat_type = 'Premium'
            elif row == 'H' and (i == 1 or i == 12):
                seat_type = 'Accessible'
            else:
                seat_type = 'Regular'
            # Only insert if not already present
            cursor.execute("SELECT SeatID FROM seat WHERE ScreenID = %s AND SeatNumber = %s", (screen_id, seat_number))
            if not cursor.fetchone():
                cursor.execute(
                    "INSERT INTO seat (ScreenID, SeatNumber, SeatType, Availability) VALUES (%s, %s, %s, 1)",
                    (screen_id, seat_number, seat_type)
                )
                inserted += 1
    db.commit()
    db.close()
    return jsonify({'success': True, 'inserted': inserted})

@app.route('/populate-seats-all', methods=['POST'])
def populate_seats_all():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT ScreenID FROM screen")
    screens = cursor.fetchall()
    total_inserted = 0
    for screen in screens:
        screen_id = screen['ScreenID']
        rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
        seats_per_row = 12
        for row in rows:
            for i in range(1, seats_per_row + 1):
                seat_number = f"{row}{i}"
                if (row == 'D' or row == 'E') and 4 <= i <= 9:
                    seat_type = 'Premium'
                elif row == 'H' and (i == 1 or i == 12):
                    seat_type = 'Accessible'
                else:
                    seat_type = 'Regular'
                cursor.execute("SELECT SeatID FROM seat WHERE ScreenID = %s AND SeatNumber = %s", (screen_id, seat_number))
                if not cursor.fetchone():
                    cursor.execute(
                        "INSERT INTO seat (ScreenID, SeatNumber, SeatType, Availability) VALUES (%s, %s, %s, 1)",
                        (screen_id, seat_number, seat_type)
                    )
                    total_inserted += 1
    db.commit()
    db.close()
    return jsonify({'success': True, 'inserted': total_inserted})

if __name__ == '__main__':
    app.run(debug=True)