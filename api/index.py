import os
import sys

# Add project root directory to sys.path so app and templates resolve cleanly
root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if root_dir not in sys.path:
    sys.path.insert(0, root_dir)

# Import and expose the same Flask app instance with all routes registered
from app import app
