from aiohttp import web
import socketio


# sio = socketio.AsyncServer()
sio = socketio.AsyncServer(cors_allowed_origins=["http://localhost:3000"])
app = web.Application()
sio.attach(app)


@sio.event
def connect(sid, environ):
    print("connect ", sid)


@sio.event
def disconnect(sid):
    print("disconnect ", sid)


if __name__ == "__main__":
    web.run_app(app, host="localhost")
