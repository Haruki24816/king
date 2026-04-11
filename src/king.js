export const king = {
  data: {
    stat: 0, // 0：初期状態、1：準備段階、2：
    turn: 0,
    players: [
      // { 
      //   hand: 手持ちカード（IDのリスト）, 
      //   debts: 借金（キーがプレイヤーID、値が金額の辞書型）,
      // },
    ],
    cards: [
      // { 
      //   back: 柄コード（0～2）, 
      //   face: 0：エース、1：百円、2：ジャック・クイーン、3：キング、4：ジョーカー, 
      //   location: -2：非表示、-1：デッキ、0以降：プレイヤーID,
      // },
    ],
    firstShuffle: [], // シャッフルされたカードIDのリスト（1周目まで使用）
    secondShuffle: [], // シャッフルされたカードIDのリスト（2周目以降使用）
  },
  methods: [
    "start",
    "collectCard",
    "drawCard",
    "pay",
  ],
  start(playerNum, firstShuffle, secondShuffle) {
    this.data.stat = 1
    this.data.turn = 0
    this.data.players = []
    for (let playerId = 0; playerId < playerNum; playerId += 1) {
      this.data.players.push({
        hand: [],
        debts: {},
      })
    }
    this.data.cards = generateCards()
    this.data.firstShuffle = firstShuffle
    this.data.secondShuffle = secondShuffle
  },
  collectCard(playerId, cardId) {
    if (15 <= this.filterCards(null, null, playerId).length) {
      return
    }
    this.data.cards[cardId].location = playerId
    const allCardNum = this.data.cards.length
    const deckCardNum = this.filterCards(null, null, -1).length
    const hideCardNum = this.filterCards(null, null, -2).length
    const playerNum = this.data.players.length
    if ((allCardNum - deckCardNum - hideCardNum) == (playerNum * 15)) {
      this.data.stat = 2
    }
  },
  drawCard(cardId) {
    this.data.stat = 3
    this.data.cards[cardId].location = this.data.turn
    this.data.players[this.data.turn].hand.push(cardId)
  },
  pay(playerId, cardId) {
    this.data.cards[cardId].location = this.data.turn
    this.data.players[playerId].hand.push(cardId)
    const turnPlayerData = this.data.players[this.data.turn]
    let count = 0
    for (const playerData of this.data.players) {
      if (this.countAmount(playerData.hand) == this.countAmount(turnPlayerData.hand)) {
        count += 1
      }
    }
    if (count == this.data.players.length) {
      this.data.stat = 2
      this.data.turn += 1
      if (this.data.turn == this.data.players.length) {
        this.data.turn = 0
      }
      for (const playerData of this.data.players) {
        playerData.hand = []
      }
    }
  },
  countAmount(cardIds) {
    const counts = {
      0: 0,
      1: 0,
      2: 0,
      3: 0,
      4: 0,
    }
    for (const cardId of cardIds) {
      const cardData = this.data.cards[cardId]
      counts[cardData.face] += 1
    }
    return 1000 * counts[0] + 100 * counts[1] + 500 * counts[2] + 500 * counts[3] + 2000 * counts[4]
  },
  filterCards(back, face, location) {
    const cardIds = []
    for (const cardId in this.data.cards) {
      cardIds.push(Number(cardId))
    }
    return cardIds.filter((cardId) => {
      if (back != null && this.data.cards[cardId].back != back) {
        return false
      }
      if (face != null && this.data.cards[cardId].face != face) {
        return false
      }
      if (location != null && this.data.cards[cardId].location != location) {
        return false
      }
      return true
    })
  },
  generateShuffle() {
    const cardIds = []
    for (let cardId = 0; cardId < 162; cardId += 1) {
      cardIds.push(cardId)
    }
    return shuffleArray(cardIds)
  },
}

function generateCards() {
  const cards = []
  const faceNumbers = [
    4, // エースの枚数
    36, // 百円の枚数
    8, // ジャック・クイーンの枚数
    4, // キングの枚数
    2, // ジョーカーの枚数
  ]
  for (let back = 0; back < 3; back += 1) {
    for (let face = 0; face < 5; face += 1) {
      for (let num = 0; num < faceNumbers[face]; num += 1) {
        if (face != 4) {
          cards.push({
            back: back,
            face: face,
            location: -1,
          })
        } else {
          cards.push({
            back: back,
            face: face,
            location: -2,
          })
        }
      }
    }
  }
  return cards
}

function shuffleArray(array) {
  const newArray = [...array]
  for (let index = newArray.length - 1; 0 <= index; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    const temp = newArray[index]
    newArray[index] = newArray[swapIndex]
    newArray[swapIndex] = temp
  }
  return newArray
}
