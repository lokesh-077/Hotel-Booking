import os
import json
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from rooms.models import Room

def export_rooms():
    rooms = Room.objects.all()
    if not rooms.exists():
        print("No rooms found in your local database!")
        return

    rooms_data = []
    for r in rooms:
        rooms_data.append({
            "room_number": str(r.room_number),
            "type": r.type,
            "description": r.description,
            "price_per_night": float(r.price_per_night),
            "capacity": r.capacity,
            "facilities": r.facilities if isinstance(r.facilities, list) else [],
            "is_available": r.is_available,
            "is_featured": getattr(r, 'is_featured', False),
            "is_visible": getattr(r, 'is_visible', True),
        })

    output_file = os.path.join(os.path.dirname(__file__), 'my_custom_rooms.json')
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(rooms_data, f, indent=4, ensure_ascii=False)

    print(f"✅ Successfully exported {len(rooms_data)} rooms to my_custom_rooms.json!")

if __name__ == '__main__':
    export_rooms()
