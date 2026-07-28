import cloudinary
import cloudinary.uploader
import itertools

api_key = "461362986823151"
cloud_name = "lixfodnk"

char1_opts = ['I', 'l', '1']
char2_opts = ['O', '0']
char3_opts = ['l', 'I', '1']

success_secret = None

for c1, c2, c3 in itertools.product(char1_opts, char2_opts, char3_opts):
    secret = f"sZETe59Xh{c1}{c2}-GBkf7_2iiJVG3x{c3}"
    
    cloudinary.config(
        cloud_name=cloud_name,
        api_key=api_key,
        api_secret=secret
    )
    
    try:
        # Ping cloudinary or upload a tiny file
        res = cloudinary.uploader.upload(b"tiny_test", resource_type="raw", public_id="test_ping")
        print(f"SUCCESS! The correct secret is: {secret}")
        success_secret = secret
        break
    except Exception as e:
        pass

if not success_secret:
    print("Failed to find the correct secret.")
