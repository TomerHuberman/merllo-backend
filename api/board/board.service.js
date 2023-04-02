const dbService = require("../../services/db.service");
const logger = require("../../services/logger.service");
const utilService = require("../../services/util.service");
const ObjectId = require("mongodb").ObjectId;

async function query(filterBy = { txt: "", memberId: "" }) {
  try {
    const criteria = {
      title: { $regex: filterBy.txt, $options: "i" },
      'members._id': filterBy.memberId  ,
    };
    const collection = await dbService.getCollection("board");
    var boards = await collection.find(criteria).toArray();
    return boards;
  } catch (err) {
    logger.error("cannot find boards", err);
    throw err;
  }
}

async function getById(boardId) {
  try {
    const collection = await dbService.getCollection("board");
    const board = collection.findOne({ _id: ObjectId(boardId) });
    return board;
  } catch (err) {
    logger.error(`while finding board ${boardId}`, err);
    throw err;
  }
}

async function remove(boardId) {
  try {
    const collection = await dbService.getCollection("board");
    await collection.deleteOne({ _id: ObjectId(boardId) });
    return boardId;
  } catch (err) {
    logger.error(`cannot remove board ${boardId}`, err);
    throw err;
  }
}

async function add(board) {
  try {
    const collection = await dbService.getCollection("board");
    await collection.insertOne(board);
    return board;
  } catch (err) {
    logger.error("cannot insert board", err);
    throw err;
  }
}

async function update(board,newActivity) {
  try {
    const boardToSave = {
      title: board.title,
      appHeaderBgc: board.appHeaderBgc,
      isStarred: board.isStarred,
      archivedAt: board.archivedAt,
      isLabelFullDisplay: board.isLabelFullDisplay,
      labels: board.labels,
      groups: board.groups,
      members: board.members,
      style: board.style,
      // activities: board.activities,
    };
    const collection = await dbService.getCollection("board");
    await collection.updateOne(
      { _id: ObjectId(board._id) },
      { $set: {boardToSave} },
      {$push:{ activities:newActivity}}
    );
    console.log("board: ", board);
    return board;
  } catch (err) {
    logger.error(`cannot update board ${boardId}`, err);
    throw err;
  }
}

module.exports = {
  remove,
  query,
  getById,
  add,
  update,
};
