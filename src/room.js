export const room = {
  data: {
    roomName: "",
    users: [
      // { userName: ユーザー名, sid: セッションID, left: 退出済みかどうか },
    ],
  },
  methods: [
    "setRoomName",
    "addUser",
    "updateUserSid",
    "leaveUser",
    "upUserOrder",
    "downUserOrder",
  ],
  setRoomName(roomName) {
    this.data.roomName = roomName
  },
  addUser(userName, sid) {
    this.data.users.push({
      userName: userName,
      sid: sid,
      left: false,
      order: this.getUserCount(),
    })
  },
  updateUserSid(userId, sid) {
    this.data.users[userId].sid = sid
  },
  leaveUser(userId) {
    const userData = this.data.users[userId]
    userData.left = true
    for (const otherUserData of this.data.users) {
      if (userData.order < otherUserData.order) {
        otherUserData.order -= 1
      }
    }
  },
  upUserOrder(userId) {
    const users = this.getUsers()
    const userData = users[userId]
    const swapUserId = this.getUserIds()[userData.order - 1]
    if (swapUserId === undefined) {
      return
    }
    const swapUserData = users[swapUserId]
    userData.order -= 1
    swapUserData.order += 1
  },
  downUserOrder(userId) {
    const users = this.getUsers()
    const userData = users[userId]
    const swapUserId = this.getUserIds()[userData.order + 1]
    if (swapUserId === undefined) {
      return
    }
    const swapUserData = users[swapUserId]
    userData.order += 1
    swapUserData.order -= 1
  },
  getSidList(skip = null) {
    const sidList = []
    for (const userId in this.getUsers()) {
      const userData = this.data.users[userId]
      if (userId == skip) {
        continue
      }
      sidList.push(userData.sid)
    }
    return sidList
  },
  getUsers() {
    const users = {}
    for (const userId in this.data.users) {
      const userData = this.data.users[userId]
      if (!userData.left) {
        users[userId] = userData
      }
    }
    return users
  },
  getUserCount() {
    return Object.keys(this.getUsers()).length
  },
  getUserIds() {
    const users = this.getUsers()
    const userIdDict = {}
    for (const userId in users) {
      const userData = users[userId]
      userIdDict[userData.order] = userId
    }
    const userIds = []
    for (let order = 0; order < this.getUserCount(); order += 1) {
      userIds.push(userIdDict[order])
    }
    return userIds
  },
}
