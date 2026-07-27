import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from rooms.models import Room

def seed():
    custom_file = os.path.join(os.path.dirname(__file__), 'my_custom_rooms.json')
    if os.path.exists(custom_file):
        import json
        with open(custom_file, 'r', encoding='utf-8') as f:
            rooms = json.load(f)
        print(f"Found my_custom_rooms.json! Clearing default rooms and loading {len(rooms)} custom rooms...")
        Room.objects.all().delete()
    else:
        if Room.objects.exists():
            print("Rooms already seeded.")
            return

        rooms = [
            {
                "room_number": "101",
                "type": "Single",
                "description": "A cozy, luxuriously appointed single room perfect for solo travelers. Features a queen-sized bed, en-suite bathroom with rainfall shower, and a private balcony overlooking the city.",
                "price_per_night": 120.00,
                "capacity": 1,
                "facilities": ["Free Wi-Fi", "Air Conditioning", "Flat-screen TV", "Mini-bar"]
            },
            {
                "room_number": "205",
                "type": "Double",
                "description": "Spacious double room designed for comfort and relaxation. Includes a king-sized bed, a dedicated workspace, and a beautiful marble bathroom.",
                "price_per_night": 180.00,
                "capacity": 2,
                "facilities": ["Free Wi-Fi", "Air Conditioning", "Ocean View", "Room Service"]
            },
            {
                "room_number": "501",
                "type": "Suite",
                "description": "Our premium penthouse suite offering the ultimate luxury experience. Features a separate living area, panoramic views, a private jacuzzi, and exclusive lounge access.",
                "price_per_night": 450.00,
                "capacity": 4,
                "facilities": ["Free Wi-Fi", "Air Conditioning", "Jacuzzi", "Living Area", "Butler Service"]
            }
        ]

    valid_fields = {f.name for f in Room._meta.get_fields()}
    for room_data in rooms:
        clean_data = {k: v for k, v in room_data.items() if k in valid_fields}
        Room.objects.update_or_create(room_number=clean_data['room_number'], defaults=clean_data)
        
    print(f"Successfully seeded {len(rooms)} rooms.")

    # Automatically create superuser for Django Admin on Free tier
    from django.contrib.auth import get_user_model
    User = get_user_model()
    if not User.objects.filter(is_superuser=True).exists():
        User.objects.create_superuser('admin', 'admin@nsmahal.com', 'Admin@12345')
        print("Successfully created Django Admin superuser -> username: admin | password: Admin@12345")
    else:
        print("Admin superuser already exists.")

if __name__ == '__main__':
    seed()

