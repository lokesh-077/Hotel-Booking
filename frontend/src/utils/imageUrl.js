/**
 * Resolves a room image URL cleanly whether it is:
 * - A Cloudinary CDN URL (starts with https://)
 * - A local Django media URL (relative path like /media/rooms/...)
 * - Missing / null (provides a beautiful fallback based on room type)
 */
export const getImageUrl = (imagePath, roomType = 'Single') => {
    if (!imagePath) {
        switch (roomType) {
            case 'Single':
                return 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80';
            case 'Double':
                return 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80';
            case 'Suite':
                return 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80';
            default:
                return 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80';
        }
    }

    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath;
    }

    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const baseUrl = isLocal 
        ? 'http://localhost:8000' 
        : 'https://ns-mahal-backend.onrender.com';

    const normalizedPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    return `${baseUrl}${normalizedPath}`;
};

export default getImageUrl;
