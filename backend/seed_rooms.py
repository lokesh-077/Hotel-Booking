import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from rooms.models import Room

def seed():
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

    for room_data in rooms:
        Room.objects.create(**room_data)
        
    print(f"Successfully seeded {len(rooms)} rooms.")

if __name__ == '__main__':
    seed()
