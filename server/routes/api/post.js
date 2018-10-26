import express from 'express';

const router = express.Router();


// @route GET api/posts/test
// @desc  test post route
// @access public
router.get('/test', (req, res) => {
  res.json({ msg: 'post Works' });
});
export default router;
