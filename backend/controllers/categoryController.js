const Category = require('../models/Category');

exports.createCategory = async (req, res) => {
  try {
    const { name, group } = req.body;
    if (!name || !group) return res.status(400).json({ error: 'name and group are required' });
    
    // Verify user is member of the group
    const isMember = req.user.memberships?.some(m => String(m.group?._id || m.group) === String(group));
    if (!isMember) return res.status(403).json({ error: 'Forbidden: not a group member' });
    
    const category = new Category({ name, group });
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const { groupId } = req.query;
    if (!groupId) return res.status(400).json({ error: 'groupId is required' });
    
    // Verify user is member of the group
    const isMember = req.user.memberships?.some(m => String(m.group?._id || m.group) === String(groupId));
    if (!isMember) return res.status(403).json({ error: 'Forbidden: not a group member' });
    
    const categories = await Category.find({ group: groupId });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const category = await Category.findByIdAndUpdate(req.params.id, { name }, {
      new: true,
      runValidators: true
    });
    
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json(category);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json({ message: 'Category deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
