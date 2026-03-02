import { reactive } from "vue"
import { io } from "socket.io-client"

export const system = reactive({
  stat: 0, // 0：初期状態、1：接続時、2：接続時（招待あり）、3：入室時、4：一時切断、5：切断
  myId: 0,
  roomId: "",
  roomData: {
    roomName: "",
    users: [
      // { userName: ユーザー名, sid: セッションID, stat: 0：通常、1：一時切断、2：切断 },
    ],
  },
  makeRoom(myName, roomName) {
    this.stat = 3
    this.roomId = generate_id()
    socket.emit("enter_room", this.roomId)
    setParam("r", this.roomId)
    this.roomData.roomName = roomName
    this.roomData.users.push({ userName: myName, sid: socket.id, stat: 0 })
    setParam("s", socket.id)
  },
  enterRoom(myName) {
    this.stat = 3
    this.myId = this.roomData.users.length
    this.roomData.users.push({ userName: myName, sid: socket.id, stat: 0 })
    socket.emit("broadcast", {
      event: "addUser",
      data: { userName: myName, sid: socket.id, stat: 0 },
    })
    setParam("s", socket.id)
  },
  disconnectForDebug() {
    socket.disconnect()
  },
  connectForDebug() {
    socket.connect()
  },
})

const url = process.env.NODE_ENV === "production" ? undefined : "http://localhost:8080"
const socket = io(url)

socket.on("connect", async () => {
  if (system.stat == 0) {
    // 初回接続時
    const roomIdParam = getParam("r")
    const sidParam = getParam("s")
    if (roomIdParam != null && sidParam != null) {
      // 招待URLの場合
      await asyncEmit("enter_room", roomIdParam)
      const roomData = await asyncEmit("proxy", { event: "getRoomData", data: null, to: sidParam })
      if (roomData != null) {
        // 入室可能の場合
        system.stat = 2
        system.roomId = roomIdParam
        system.roomData = roomData
      } else {
        // 入室不可能の場合
        system.stat = 5
        socket.disconnect()
      }
    } else {
      // 招待URLでない場合
      system.stat = 1
    }
  } else if (system.stat == 4) {
    // 再接続時
    await asyncEmit("enter_room", system.roomId)
    for (const userData of system.roomData.users) {
      const roomData = await asyncEmit("proxy", { event: "getRoomData", data: null, to: userData.sid })
      if (roomData != null) {
        // 再接続可能
        system.stat = 3
        system.roomData = roomData
        system.roomData.users[system.myId].sid = socket.id
        system.roomData.users[system.myId].stat = 0
        setParam("s", socket.id)
        await asyncEmit("broadcast", {
          event: "updateUser",
          data: {
            userId: system.myId,
            userData: system.roomData.users[system.myId],
          },
        })
        return
      }
    }
    // 再接続不可能
    system.stat = 5
    socket.disconnect()
  }
})

socket.on("disconnect", () => {
  if (system.stat == 3) {
    system.stat = 4
  } else {
    system.stat = 5
    socket.disconnect()
  }
})

socket.on("getRoomData", (callback) => {
  if (system.stat == 3) {
    callback(system.roomData)
  } else {
    callback(null)
  }
})

socket.on("addUser", (userData) => {
  if (system.stat == 2 || system.stat == 3) {
    system.roomData.users.push(userData)
  }
})

socket.on("suspendUser", (sid) => {
  if (system.stat == 2 || system.stat == 3) {
    for (const userData of system.roomData.users) {
      if (userData.sid == sid) {
        userData.stat = 1
      }
    }
  }
})

socket.on("updateUser", (data) => {
  const userId = data.userId
  const userData = data.userData
  if (system.stat == 2 || system.stat == 3) {
    system.roomData.users[userId] = userData
  }
})

function asyncEmit(eventName, data) {
  return new Promise((resolve) => {
    socket.emit(eventName, data, (response) => {
      resolve(response)
    })
  })
}

function getParam(key) {
  return new URLSearchParams(document.location.search).get(key)
}

function setParam(key, value) {
  const params = new URLSearchParams(document.location.search)
  if (value != null) {
    params.set(key, value)
  } else {
    params.delete(key)
  }
  window.history.replaceState(null, "", "?" + params.toString())
}

function generate_id() {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  const array = new Uint8Array(16)
  crypto.getRandomValues(array)
  return Array.from(array).map(x => charset[x % charset.length]).join("")
}
