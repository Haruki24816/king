import { reactive } from "vue"
import { io } from "socket.io-client"
import { room } from "./room"
import { king } from "./king"

export const system = reactive({
  stat: 0, // 0：初期状態、1：接続時、2：接続時（招待あり）、3：入室時、4：一時切断、5：切断
  myId: null,
  roomId: "",
  stores: {
    room: room,
    king: king,
  },
  makeRoom(myName, roomName) {
    this.stat = 3
    this.myId = 0
    this.roomId = generate_id()
    socket.emit("enter_room", this.roomId)
    setParam("r", this.roomId)
    this.stores.room.setRoomName(roomName)
    this.stores.room.addUser(myName, socket.id)
    setParam("s", socket.id)
  },
  enterRoom(myName) {
    this.stat = 3
    this.myId = this.stores.room.data.users.length
    this.operateStore("room", "addUser", myName, socket.id)
    setParam("s", socket.id)
  },
  reload() {
    setParam("r", null)
    setParam("s", null)
    window.location.reload()
  },
  async operateStore(storeName, methodName, ...args) {
    await asyncEmit("broadcast", {
      event: "operateStore",
      data: { storeName: storeName, methodName: methodName, args: args },
    })
    this.operateOwnStore(storeName, methodName, ...args)
  },
  operateOwnStore(storeName, methodName, ...args) {
    if (!Object.hasOwn(this.stores, storeName)) {
      return
    }
    const store = this.stores[storeName]
    if (!store.methods.includes(methodName)) {
      return
    }
    store[methodName](...args)
  },
  syncStoreData(storeData) {
    for (const storeName in storeData) {
      const newStoreData = storeData[storeName]
      const store = this.stores[storeName]
      store.data = newStoreData
    }
  },
  exportStoreData() {
    const storeData = {}
    for (const storeName in this.stores) {
      const store = this.stores[storeName]
      storeData[storeName] = store.data
    }
    return storeData
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
      if (await trySyncStores([sidParam])) {
        // 入室可能の場合
        system.stat = 2
        system.roomId = roomIdParam
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
    if (await trySyncStores(system.stores.room.getSidList(system.myId))) {
      if (system.stores.room.data.users[system.myId].left) {
        // 再接続不可能
        system.stat = 5
        socket.disconnect()
        return
      }
      // 再接続可能
      system.stat = 3
      system.operateStore("room", "updateUserSid", system.myId, socket.id)
      setParam("s", socket.id)
    } else {
      // 再接続不可能
      system.stat = 5
      socket.disconnect()
    }
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

socket.on("getStoreData", (callback) => {
  if (system.stat == 3) {
    callback(system.exportStoreData())
  } else {
    callback(null)
  }
})

socket.on("operateStore", (data) => {
  const storeName = data.storeName
  const methodName = data.methodName
  const args = data.args
  system.operateOwnStore(storeName, methodName, ...args)
})

async function trySyncStores(sidList) {
  for (const sid of sidList) {
    const storeData = await asyncEmit("proxy", {
      event: "getStoreData",
      data: null,
      to: sid,
    })
    if (storeData != null) {
      system.syncStoreData(storeData)
      return true
    }
  }
  return false
}

window.addEventListener("beforeunload", () => {
  system.stat = 5
  system.operateStore("room", "leaveUser", system.myId)
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
