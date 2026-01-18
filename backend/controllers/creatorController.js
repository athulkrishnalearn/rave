const User = require('../models/User');
const Product = require('../models/Product');
const AffiliateLink = require('../models/AffiliateLink');

// Get all products available for affiliate marketing
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find({ isActive: true })
      .populate('company', 'name description logoUrl')
      .select('name description price commissionRate imageUrl promotionalText paymentLink');

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting products',
      error: error.message
    });
  }
};

// Generate affiliate link for a product
exports.generateAffiliateLink = async (req, res) => {
  try {
    const { productId, socialPlatform, socialUsername } = req.body;

    // Validate product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Get the authenticated creator
    const creator = await User.findById(req.user.id);
    if (!creator) {
      return res.status(404).json({
        success: false,
        message: 'Creator not found'
      });
    }

    // Generate unique affiliate ID
    const affiliateId = `${creator._id.toString().slice(-6)}${Date.now()}`;
    
    // Create affiliate link
    const affiliateLink = {
      productId: product._id,
      link: `${process.env.BASE_URL || 'http://localhost:3000'}/a/${affiliateId}`,
      clicks: 0,
      conversions: 0,
      earnings: 0,
      socialPlatform,
      socialUsername
    };

    // Create affiliate link in the separate collection
    const newAffiliateLink = await AffiliateLink.create({
      userId: creator._id,
      productId: product._id,
      link: affiliateLink.link,
      socialPlatform,
      socialUsername
    });
    
    // Add reference to user's affiliate links
    creator.affiliateLinks.push({
      productId: product._id,
      link: affiliateLink.link,
      clicks: 0,
      conversions: 0,
      earnings: 0,
      socialPlatform,
      socialUsername
    });
    await creator.save();

    // Return the affiliate link
    res.status(201).json({
      success: true,
      message: 'Affiliate link generated successfully',
      data: {
        ...affiliateLink,
        _id: creator.affiliateLinks[creator.affiliateLinks.length - 1]._id
      }
    });
  } catch (error) {
    console.error('Generate affiliate link error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error generating affiliate link',
      error: error.message
    });
  }
};

// Get creator's affiliate links
exports.getAffiliateLinks = async (req, res) => {
  try {
    const affiliateLinks = await AffiliateLink.find({ userId: req.user.id }).populate('productId', 'name price commissionRate imageUrl');
    
    res.status(200).json({
      success: true,
      data: affiliateLinks
    });
  } catch (error) {
    console.error('Get affiliate links error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting affiliate links',
      error: error.message
    });
  }
};

// Get creator's earnings summary
exports.getEarningsSummary = async (req, res) => {
  try {
    const affiliateLinks = await AffiliateLink.find({ userId: req.user.id });
    
    // Calculate total earnings
    const totalEarnings = affiliateLinks.reduce((sum, link) => sum + link.earnings, 0);
    const totalClicks = affiliateLinks.reduce((sum, link) => sum + link.clicks, 0);
    const totalConversions = affiliateLinks.reduce((sum, link) => sum + link.conversions, 0);
    
    res.status(200).json({
      success: true,
      data: {
        totalEarnings,
        totalClicks,
        totalConversions,
        affiliateLinksCount: affiliateLinks.length
      }
    });
  } catch (error) {
    console.error('Get earnings summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting earnings summary',
      error: error.message
    });
  }
};

// Add social account
exports.addSocialAccount = async (req, res) => {
  try {
    const { platform, username, url, followers } = req.body;

    const creator = await User.findById(req.user.id);

    // Check if social account already exists
    const existingAccount = creator.socialAccounts.find(
      account => account.platform === platform && account.username === username
    );

    if (existingAccount) {
      return res.status(400).json({
        success: false,
        message: 'Social account already exists'
      });
    }

    // Add new social account
    creator.socialAccounts.push({
      platform,
      username,
      url,
      followers: followers || 0
    });

    await creator.save();

    res.status(201).json({
      success: true,
      message: 'Social account added successfully',
      data: creator.socialAccounts[creator.socialAccounts.length - 1]
    });
  } catch (error) {
    console.error('Add social account error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error adding social account',
      error: error.message
    });
  }
};

// Get creator's social accounts
exports.getSocialAccounts = async (req, res) => {
  try {
    const creator = await User.findById(req.user.id).select('socialAccounts');
    
    res.status(200).json({
      success: true,
      data: creator.socialAccounts
    });
  } catch (error) {
    console.error('Get social accounts error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting social accounts',
      error: error.message
    });
  }
};

// Track click on affiliate link (internal use, not for external access)
exports.trackClick = async (req, res) => {
  try {
    const { affiliateId } = req.params;

    // Find user by affiliate ID (extracted from the link)
    // This would require a reverse lookup which is complex
    // A better approach would be to store affiliate IDs in a separate collection
    // For now, we'll simulate this with a simple approach
    
    // In a real implementation, you'd have an AffiliateLink model
    // and update the click count there
    
    res.status(200).json({
      success: true,
      message: 'Click tracked'
    });
  } catch (error) {
    console.error('Track click error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error tracking click',
      error: error.message
    });
  }
};

// Get affiliate link analytics
exports.getLinkAnalytics = async (req, res) => {
  try {
    const affiliateLinks = await AffiliateLink.find({ userId: req.user.id }).populate('productId', 'name');
    
    // Return analytics for all affiliate links
    const analytics = affiliateLinks.map(link => ({
      productId: link.productId,
      productName: link.productId ? link.productId.name : 'Unknown Product',
      link: link.link,
      clicks: link.clicks,
      conversions: link.conversions,
      earnings: link.earnings,
      socialPlatform: link.socialPlatform,
      socialUsername: link.socialUsername,
      createdAt: link.createdAt
    }));
    
    res.status(200).json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('Get link analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting link analytics',
      error: error.message
    });
  }
};