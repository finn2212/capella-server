const express = require('express');
const router = express.Router();
const musicSheetController = require('../controllers/musicSheetController');

// Routes setup
router.post('/music-sheet', musicSheetController.createMusicSheet);
// musicSheetRoutes definition
router.get('/music-sheet/:shopwareId', musicSheetController.getMusicSheetByShopwareId);
router.put('/music-sheet/:id', musicSheetController.updateMusicSheet);
router.delete('/music-sheet/:id', musicSheetController.deleteMusicSheet);
router.get('/music-sheets', musicSheetController.getAllMusicSheets);

module.exports = router;
