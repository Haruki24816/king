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
export const socket = io(url)

socket.on("connect", () => {
  if (system.stat == 0) {
    // 初回接続時
    const roomIdParam = getParam("r")
    const sidParam = getParam("s")
    if (roomIdParam != null && sidParam != null) {
      // 招待URLの場合
      socket.emit("enter_room", roomIdParam, () => {
        socket.emit("proxy", { event: "getRoomData", data: null, to: sidParam }, (roomData) => {
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
        })
      })
    } else {
      // 招待URLでない場合
      system.stat = 1
    }
  } else if (system.stat == 4) {
    // 再接続時
    socket.emit("enter_room", system.roomId, () => {
      const sidList = []
      for (const userId in system.roomData.users) {
        const userData = system.roomData.users[userId]
        sidList.push(userData.sid)
      }
      function tryGetRoomData(sidList) {
        socket.emit("proxy", { event: "getRoomData", data: null, to: sidList[0] }, (roomData) => {
          if (roomData != null) {
            // 再接続可能
            system.stat = 3
            system.roomData = roomData
            system.roomData.users[system.myId].sid = socket.id
            system.roomData.users[system.myId].stat = 0
            socket.emit("broadcast", {
              event: "updateUser",
              data: {
                userId: system.myId,
                userData: system.roomData.users[system.myId],
              },
            })
            setParam("s", socket.id)
          } else if (sidList.length == 1) {
            //再接続不可能
            system.stat = 5
            socket.disconnect()
          } else {
            tryGetRoomData(sidList.slice(1))
          }
        })
      }
      tryGetRoomData(sidList)
    })
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
    for (const userId in system.roomData.users) {
      const userData = system.roomData.users[userId]
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
