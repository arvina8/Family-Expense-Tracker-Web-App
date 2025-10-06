const Category = require('../models/Category');

const isGroupMember = (user, groupId) =>
  user.memberships?.some(m => String(m.group?._id || m.group) === String(groupId));

const ensureCategoryAccess = async (user, categoryId) => {
  if (!categoryId) {
    return { error: { status: 400, message: 'categoryId is required' } };
  }

  const category = await Category.findById(categoryId);
  if (!category) {
    return { error: { status: 404, message: 'Category not found' } };
  }

  if (!isGroupMember(user, category.group)) {
    return { error: { status: 403, message: 'Forbidden: not a group member' } };
  }

  return { category };
};

exports.createCategory = async (req, res) => {
  try {
    const { name, group } = req.body;
    if (!name || !group) return res.status(400).json({ error: 'name and group are required' });

    if (!isGroupMember(req.user, group)) {
      return res.status(403).json({ error: 'Forbidden: not a group member' });
    }

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

    if (!isGroupMember(req.user, groupId)) {
      return res.status(403).json({ error: 'Forbidden: not a group member' });
    }

    const categories = await Category.find({ group: groupId }).sort({ name: 1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const { error, category } = await ensureCategoryAccess(req.user, req.params.id);
    if (error) {
      return res.status(error.status).json({ error: error.message });
    }

    res.json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'name is required' });
    }

    const { error, category } = await ensureCategoryAccess(req.user, req.params.id);
    if (error) {
      return res.status(error.status).json({ error: error.message });
    }

    category.name = name;
    await category.save();
    res.json(category);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { error, category } = await ensureCategoryAccess(req.user, req.params.id);
    if (error) {
      return res.status(error.status).json({ error: error.message });
    }

    await category.deleteOne();
    res.json({ message: 'Category deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
