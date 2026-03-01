from aiohttp import web
import socketio


# sio = socketio.AsyncServer()
sio = socketio.AsyncServer(cors_allowed_origins=["http://localhost:3000"])
app = web.Application()
sio.attach(app)


@sio.event
async def enter_room(sid, room_id):
    await sio.enter_room(sid, room_id)


@sio.event
async def proxy(sid, data):
    event = data["event"]
    data_ = data["data"]
    to = data["to"]

    if len(set(sio.rooms(sid)) & set(sio.rooms(to))) == 0:
        return

    try:
        return await sio.call(event, data_, to=to, timeout=10)
    except socketio.exceptions.TimeoutError:
        pass


@sio.event
async def broadcast(sid, data):
    event = data["event"]
    data_ = data["data"]
    await sio.emit(event, data_, room=sio.rooms(sid), skip_sid=sid)


@sio.event
async def disconnect(sid):
    await sio.emit("suspendUser", sid, room=sio.rooms(sid))


if __name__ == "__main__":
    web.run_app(app, host="localhost")
