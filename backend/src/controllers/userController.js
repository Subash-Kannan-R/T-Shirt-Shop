import User from '../models/User.js';

export const listUsers = async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
};

export const getProfile = async (req, res) => {
  res.json(req.user);
};

export const getMyShipping = async (req, res) => {
  const user = await User.findById(req.user._id).select('shippingAddress');
  res.json(user?.shippingAddress || {});
};

export const updateMyShipping = async (req, res) => {
  const fields = [
    'email','firstName','lastName','companyName','country','streetAddress','apartment','city','state','pinCode','phone'
  ];
  const payload = {};
  for (const k of fields) if (k in req.body) payload[k] = req.body[k];
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: { shippingAddress: payload } },
    { new: true, projection: { password: 0 } }
  );
  res.json(user.shippingAddress || {});
};

// Update profile
export const updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;
    const updateData = {};
    
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateData },
      { new: true, projection: { password: 0 } }
    );
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to update profile' });
  }
};

// Upload profile photo
export const uploadProfilePhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    // File path will be available as req.file.path
    const photoUrl = `/uploads/profiles/${req.file.filename}`;
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { profilePhoto: photoUrl } },
      { new: true, projection: { password: 0 } }
    );
    
    res.json({ profilePhoto: photoUrl, user });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to upload photo' });
  }
};

// Change password
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current and new password are required' });
    }
    
    const user = await User.findById(req.user._id);
    
    // Verify current password
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }
    
    // Update password
    user.password = newPassword;
    await user.save();
    
    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to change password' });
  }
};
