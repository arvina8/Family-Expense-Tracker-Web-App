const express = require('express');
const router = express.Router();
const { createGroup, myGroups, addMember, removeMember, getGroup, joinGroup, inviteMember, listInvites, acceptInvite, deleteGroup, leaveGroup } = require('../controllers/groupController');
const { auth, requireGroupAdmin } = require('../middleware/auth');

router.use(auth);

router.post('/', createGroup);
router.get('/mine', myGroups);
router.get('/:groupId', getGroup);
router.post('/:groupId/members', requireGroupAdmin(req => req.params.groupId), addMember);
router.delete('/:groupId/members', requireGroupAdmin(req => req.params.groupId), removeMember);
router.post('/join', joinGroup); // body: { groupIdOrCode }
router.post('/:groupId/invite', requireGroupAdmin(req => req.params.groupId), inviteMember);
router.get('/:groupId/invites', requireGroupAdmin(req => req.params.groupId), listInvites);
router.post('/invites/:token/accept', acceptInvite);
router.delete('/:groupId', requireGroupAdmin(req => req.params.groupId), deleteGroup);
router.post('/:groupId/leave', leaveGroup);

module.exports = router;
