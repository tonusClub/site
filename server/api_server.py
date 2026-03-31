#!/usr/bin/env python3
import json
import os
import random
import time
import urllib.error
import urllib.parse
import urllib.request
from http.server import BaseHTTPRequestHandler, HTTPServer
from socketserver import ThreadingMixIn
from datetime import datetime, timedelta


HOST = os.getenv("HOST", "127.0.0.1")
PORT = int(os.getenv("PORT", "3000"))
VK_TOKEN = os.getenv("VK_TOKEN", "")
VK_PEER_ID = os.getenv("VK_PEER_ID", "")
VK_API_VERSION = os.getenv("VK_API_VERSION", "5.199")
RU_MONTHS = [
    "января",
    "февраля",
    "марта",
    "апреля",
    "мая",
    "июня",
    "июля",
    "августа",
    "сентября",
    "октября",
    "ноября",
    "декабря",
]


def build_vk_message(name, phone, source, created_at):
    return "\n".join(
        [
            "Новая заявка с сайта",
            f"Имя: {name}",
            f"Телефон: {phone}",
            "Источник: сайт",
            f"Дата: {created_at}",
        ]
    )


def normalize_ru_phone(value):
    digits = "".join(char for char in str(value or "").strip() if char.isdigit())

    if not digits:
        raise ValueError("phone is required")

    if len(digits) == 11 and digits[0] in ("7", "8"):
        local_digits = digits[1:]
    elif len(digits) == 10:
        local_digits = digits
    else:
        raise ValueError("phone must be a valid RU phone number")

    return "+7 ({}) {}-{}-{}".format(
        local_digits[0:3],
        local_digits[3:6],
        local_digits[6:8],
        local_digits[8:10],
    )


def format_lead_date():
    moscow_time = datetime.utcnow() + timedelta(hours=3)
    return "{} {} {} года {}".format(
        moscow_time.day,
        RU_MONTHS[moscow_time.month - 1],
        moscow_time.year,
        moscow_time.strftime("%H:%M"),
    )


def send_vk_message(message):
    if not VK_TOKEN:
        raise RuntimeError("VK token is required")

    if not VK_PEER_ID:
        raise RuntimeError("VK peer id is required")

    body = urllib.parse.urlencode(
        {
            "access_token": VK_TOKEN,
            "peer_id": VK_PEER_ID,
            "random_id": f"{int(time.time() * 1000)}{random.randint(1000, 99999)}",
            "message": message,
            "v": VK_API_VERSION,
        }
    ).encode("utf-8")

    request = urllib.request.Request(
        "https://api.vk.com/method/messages.send",
        data=body,
        headers={"Content-Type": "application/x-www-form-urlencoded; charset=utf-8"},
        method="POST",
    )

    with urllib.request.urlopen(request, timeout=20) as response:
        payload = json.loads(response.read().decode("utf-8"))

    if "error" in payload:
        raise RuntimeError(payload["error"].get("error_msg", "VK delivery failed"))

    return payload.get("response")


class ThreadingHTTPServer(ThreadingMixIn, HTTPServer):
    daemon_threads = True


class Handler(BaseHTTPRequestHandler):
    def _send_json(self, status_code, payload):
        encoded = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(encoded)))
        self.end_headers()
        self.wfile.write(encoded)

    def do_GET(self):
        if self.path == "/healthz":
            self._send_json(200, {"ok": True})
            return

        self._send_json(404, {"ok": False, "error": "not found"})

    def do_POST(self):
        if self.path != "/api/lead":
            self._send_json(404, {"ok": False, "error": "not found"})
            return

        try:
            content_length = int(self.headers.get("Content-Length", "0"))
        except ValueError:
            content_length = 0

        raw_body = self.rfile.read(content_length).decode("utf-8")

        try:
            payload = json.loads(raw_body or "{}")
        except json.JSONDecodeError:
            self._send_json(400, {"ok": False, "error": "invalid json"})
            return

        name = str(payload.get("name", "")).strip()
        phone = str(payload.get("phone", "")).strip()
        source = str(payload.get("source", "")).strip() or "unknown"

        if not name:
            self._send_json(400, {"ok": False, "error": "name is required"})
            return

        try:
            phone = normalize_ru_phone(phone)
        except ValueError as error:
            self._send_json(400, {"ok": False, "error": str(error)})
            return

        message = build_vk_message(
            name=name,
            phone=phone,
            source=source,
            created_at=format_lead_date(),
        )

        try:
            send_vk_message(message)
        except Exception as error:
            self._send_json(502, {"ok": False, "error": str(error)})
            return

        self._send_json(200, {"ok": True})

    def log_message(self, format, *args):
        return


def main():
    server = ThreadingHTTPServer((HOST, PORT), Handler)
    print(f"Listening on http://{HOST}:{PORT}")
    server.serve_forever()


if __name__ == "__main__":
    main()
