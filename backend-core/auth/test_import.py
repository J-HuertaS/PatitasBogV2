import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

try:
    import profile_api
    print("✅ profile_api imported successfully")
    print("Functions:", [f for f in dir(profile_api) if not f.startswith('_')])
    if hasattr(profile_api, 'register_profile_api'):
        print("✅ register_profile_api function found")
    else:
        print("❌ register_profile_api function NOT found")
except Exception as e:
    print("❌ Error importing profile_api:", e)
