import Checkout from '../models/Checkout.js';

// Get or create checkout by session ID
export const getCheckout = async (req, res) => {
  try {
    const { sessionId } = req.params;
    let checkout = await Checkout.findOne({ sessionId, status: 'draft' });
    
    if (!checkout) {
      // Create new checkout
      checkout = await Checkout.create({ 
        sessionId,
        email: '',
        shippingAddress: {}
      });
    }
    
    res.json(checkout);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to get checkout' });
  }
};

// Update checkout
export const updateCheckout = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const updateData = req.body;
    
    let checkout = await Checkout.findOneAndUpdate(
      { sessionId, status: 'draft' },
      { $set: updateData },
      { new: true, upsert: true }
    );
    
    res.json(checkout);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to update checkout' });
  }
};

// Mark checkout as completed
export const completeCheckout = async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    const checkout = await Checkout.findOneAndUpdate(
      { sessionId, status: 'draft' },
      { status: 'completed' },
      { new: true }
    );
    
    if (!checkout) {
      return res.status(404).json({ message: 'Checkout not found' });
    }
    
    res.json(checkout);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to complete checkout' });
  }
};

// Delete checkout
export const deleteCheckout = async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    await Checkout.deleteOne({ sessionId });
    
    res.json({ message: 'Checkout deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to delete checkout' });
  }
};
