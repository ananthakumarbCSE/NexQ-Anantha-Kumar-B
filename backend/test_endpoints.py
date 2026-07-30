"""Smoke-test every Q-Edge Guardian endpoint."""
import json
import urllib.request

BASE = "http://127.0.0.1:8001"
PASS = 0
FAIL = 0


def req(method, path, body=None):
    data = json.dumps(body).encode() if body else None
    rq = urllib.request.Request(
        f"{BASE}{path}",
        data=data,
        headers={"Content-Type": "application/json"} if data else {},
        method=method,
    )
    with urllib.request.urlopen(rq) as r:
        return r.status, json.loads(r.read())


def check(name, status, resp, expected_status, assertions):
    global PASS, FAIL
    ok = status == expected_status and all(assertions)
    tag = "PASS" if ok else "FAIL"
    if ok:
        PASS += 1
    else:
        FAIL += 1
    print(f"[{tag}] {name}  (HTTP {status})")
    if not ok:
        print(f"       Response: {resp}")


# 1 — Root
s, r = req("GET", "/")
check("GET /", s, r, 200, [r.get("project") == "Q-Edge Guardian", r.get("status") == "Running"])

# 2 — Health
s, r = req("GET", "/health")
check("GET /health", s, r, 200, [r.get("status") == "healthy"])

# 3 — POST traffic
s, r = req("POST", "/api/v1/traffic", {"vehicle_count": 25, "congestion_level": "High"})
check("POST /api/v1/traffic", s, r, 201, [r.get("vehicle_count") == 25, "recommendation" in r])

# 4 — GET traffic
s, r = req("GET", "/api/v1/traffic")
check("GET /api/v1/traffic", s, r, 200, [isinstance(r, list), len(r) >= 1])

# 5 — POST emergency
s, r = req("POST", "/api/v1/emergency", {"vehicle_type": "Ambulance", "location": "Lane A"})
check("POST /api/v1/emergency", s, r, 201, [r.get("vehicle_type") == "Ambulance", r.get("status") == "ACTIVE"])

# 6 — GET emergency
s, r = req("GET", "/api/v1/emergency")
check("GET /api/v1/emergency", s, r, 200, [isinstance(r, list), len(r) >= 1])

# 7 — POST signal
s, r = req("POST", "/api/v1/signal", {"lane": "A", "signal_color": "GREEN", "green_duration": 45})
check("POST /api/v1/signal", s, r, 201, [r.get("lane") == "A", r.get("green_duration") == 45])

# 8 — GET signal
s, r = req("GET", "/api/v1/signal")
check("GET /api/v1/signal", s, r, 200, [isinstance(r, list), len(r) >= 1])

# 9 — Dashboard
s, r = req("GET", "/api/v1/dashboard")
check("GET /api/v1/dashboard", s, r, 200, [
    r.get("traffic_records", 0) >= 1,
    r.get("emergency_events", 0) >= 1,
    r.get("active_signals", 0) >= 1,
])

print(f"\n{'='*40}")
print(f"Results: {PASS} passed, {FAIL} failed")
