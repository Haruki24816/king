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
  ],
  setRoomName(roomName) {
    this.data.roomName = roomName
  },
  addUser(userName, sid) {
    this.data.users.push({
      userName: userName,
      sid: sid,
      left: false,
    })
  },
  updateUserSid(userId, sid) {
    this.data.users[userId].sid = sid
  },
  leaveUser(userId) {
    const userData = this.data.users[userId]
    userData.left = true
  },
  getSidList(skip = null) {
    const sidList = []
    for (const userId in this.data.users) {
      const userData = this.data.users[userId]
      if (userId == skip) {
        continue
      }
      if (userData.left) {
        continue
      }
      sidList.push(userData.sid)
    }
    return sidList
  },
}
