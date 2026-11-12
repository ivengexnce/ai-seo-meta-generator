#!/usr/bin/env python3
"""
migrate.py — One-time migration script for Rankora feedbacks.json storage.
Upgrades all entries to the new schema:
  - id (uuid4 string)
  - name (string)
  - message (string)
  - type ('testimonial' | 'issue')
  - status ('open' | 'in_progress' | 'resolved')
  - approved (boolean, default False)
  - rating (int 1-5)
  - timestamp (ISO 8601 string)
"""

import json
import os
import sys
import uuid
from datetime import datetime, timezone

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FEEDBACK_FILE = os.path.join(BASE_DIR, "data", "feedbacks.json")

SEED_ENTRIES = [
    {
        "id": "c1f7b889-b2c6-4d7a-8b01-523e4d4135e1",
        "name": "Sarah Lin",
        "message": "Rankora completely eliminated our snippet truncation issues on Google. The desktop and mobile preview saved our launch.",
        "type": "testimonial",
        "status": "resolved",
        "approved": True,
        "rating": 5,
        "timestamp": "2026-11-10T14:32:00Z",
    },
    {
        "id": "e4a8d052-78d1-42ec-a077-3e117409c91b",
        "name": "Marcus Chen",
        "message": "Need support for schema.org Product and Article JSON-LD markup.",
        "type": "issue",
        "status": "in_progress",
        "approved": False,
        "rating": 4,
        "timestamp": "2026-11-11T09:15:00Z",
    },
    {
        "id": "93f6c8d2-5a41-4c4e-b5f7-68b321a4f02a",
        "name": "Elena Rostova",
        "message": "Export button occasionally copies without trailing newline on iOS Safari.",
        "type": "issue",
        "status": "open",
        "approved": False,
        "rating": 3,
        "timestamp": "2026-11-12T08:00:00Z",
    },
]


def is_valid_uuid(val: str) -> bool:
    try:
        uuid.UUID(str(val))
        return True
    except (ValueError, AttributeError):
        return False


def migrate():
    os.makedirs(os.path.dirname(FEEDBACK_FILE), exist_ok=True)
    entries = []

    if os.path.exists(FEEDBACK_FILE):
        try:
            with open(FEEDBACK_FILE, "r", encoding="utf-8-sig") as f:
                raw = json.load(f)
                if isinstance(raw, list):
                    entries = raw
        except Exception as e:
            print(f"Warning: Could not read existing feedbacks: {e}")

    if not entries:
        print("No existing entries found. Seeding initial records...")
        entries = SEED_ENTRIES
    else:
        migrated = []
        for item in entries:
            # ID
            item_id = item.get("id")
            if not item_id or not is_valid_uuid(item_id):
                item_id = str(uuid.uuid4())

            # Type
            raw_type = item.get("type")
            if raw_type not in ("testimonial", "issue"):
                category = item.get("category", "").lower()
                if category in ("bug", "issue"):
                    raw_type = "issue"
                else:
                    raw_type = "testimonial"

            # Status
            raw_status = item.get("status")
            if raw_status not in ("open", "in_progress", "resolved"):
                raw_status = "resolved" if raw_type == "testimonial" else "open"

            # Approved
            approved = item.get("approved")
            if approved is None:
                approved = bool(item.get("verified", False))

            # Rating
            try:
                rating = int(item.get("rating", 5))
                rating = max(1, min(5, rating))
            except (ValueError, TypeError):
                rating = 5

            # Timestamp
            ts = item.get("timestamp")
            if not ts:
                date_val = item.get("date")
                if date_val:
                    ts = f"{date_val}T12:00:00Z"
                else:
                    ts = datetime.now(timezone.utc).isoformat()

            migrated.append({
                "id": item_id,
                "name": str(item.get("name") or "Anonymous").strip(),
                "message": str(item.get("message") or "").strip(),
                "type": raw_type,
                "status": raw_status,
                "approved": approved,
                "rating": rating,
                "timestamp": ts,
            })
        entries = migrated

    with open(FEEDBACK_FILE, "w", encoding="utf-8") as f:
        json.dump(entries, f, indent=2, ensure_ascii=False)

    print(f"Successfully migrated {len(entries)} entries in {FEEDBACK_FILE}")


if __name__ == "__main__":
    migrate()
