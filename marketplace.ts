import { Router, Response } from 'express';
import { db } from '../db';
import { requireAuth, AuthenticatedRequest } from '../auth';

export const marketplaceRouter = Router();

// Browse products
marketplaceRouter.get('/products', (req, res) => {
  const { category, search } = req.query;
  const products = db.getProducts(category as string, search as string);
  return res.json(products);
});

// Product details
marketplaceRouter.get('/products/:id', (req, res) => {
  const product = db.getProductById(req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  return res.json(product);
});

// Place order (Model A: Direct Purchase or Model C: Flexible)
marketplaceRouter.post('/orders', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { items, deliveryAddress, deliveryMethod = 'delivery', paymentModel = 'direct_purchase' } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Order must contain at least one item' });
  }

  // Validate items and compute total
  let totalAmountGHS = 0;
  const validatedItems = [];

  for (const item of items) {
    const product = db.getProductById(item.productId);
    if (!product) {
      return res.status(400).json({ error: `Product ID ${item.productId} not found` });
    }
    if (product.stockQuantity < item.quantity) {
      return res.status(400).json({
        error: `Insufficient stock for "${product.title}". Requested: ${item.quantity}, Available: ${product.stockQuantity}`,
      });
    }

    const subtotal = product.priceGHS * item.quantity;
    totalAmountGHS += subtotal;

    // Deduct stock
    product.stockQuantity -= item.quantity;

    validatedItems.push({
      productId: product.id,
      productName: product.title,
      unitPriceGHS: product.priceGHS,
      quantity: item.quantity,
      unit: product.unit,
      subtotalGHS: subtotal,
    });
  }

  const order = db.createOrder({
    farmerId: req.user!.id,
    farmerName: req.user!.fullName,
    items: validatedItems,
    totalAmountGHS,
    paymentModel,
    paymentStatus: paymentModel === 'direct_purchase' ? 'completed' : 'processing',
    fulfilmentStatus: 'placed',
    deliveryAddress: deliveryAddress || 'Sunyani Farmer Pickup Center',
    deliveryMethod,
    trackingNumber: `GH-AGRI-${Date.now().toString().slice(-6)}`,
  });

  db.addAuditLog({
    actorId: req.user!.id,
    actorName: req.user!.fullName,
    actorRole: req.user!.role,
    action: 'PLACED_ORDER',
    resourceType: 'Order',
    resourceId: order.id,
    details: `Placed order for GHS ${totalAmountGHS} via ${paymentModel}`,
  });

  db.addNotification({
    userId: req.user!.id,
    title: 'Order Placed Successfully',
    message: `Order #${order.id} for GHS ${order.totalAmountGHS.toLocaleString()} has been placed. Tracking: ${order.trackingNumber}`,
    type: 'success',
    link: '/marketplace',
  });

  return res.status(201).json({
    message: 'Order created successfully',
    order,
  });
});

// Get orders
marketplaceRouter.get('/orders', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  if (req.user!.role === 'farmer') {
    const orders = db.getOrders(req.user!.id);
    return res.json(orders);
  }
  // Suppliers, dealers, and admins see relevant orders
  const orders = db.getOrders();
  return res.json(orders);
});

// Update order status / redeem voucher
marketplaceRouter.put('/orders/:id/status', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { fulfilmentStatus, paymentStatus } = req.body;

  const order = db.updateOrderStatus(id, fulfilmentStatus, paymentStatus);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  db.addAuditLog({
    actorId: req.user!.id,
    actorName: req.user!.fullName,
    actorRole: req.user!.role,
    action: 'ORDER_STATUS_UPDATED',
    resourceType: 'Order',
    resourceId: order.id,
    details: `Updated fulfilment to ${fulfilmentStatus}${paymentStatus ? `, payment: ${paymentStatus}` : ''}`,
  });

  return res.json({ message: 'Order status updated successfully', order });
});

// Add new product (Fertilizer Dealer, Seed Dealer, Supplier, Admin)
marketplaceRouter.post('/products', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const {
    title,
    category,
    description,
    priceGHS,
    unit,
    stockQuantity,
    specifications,
    regulatoryApprovalNumber,
    isRegulatedApproved,
    deliveryAvailable,
    pickupAvailable,
    location,
    imageUrl,
  } = req.body;

  if (!title || !priceGHS || !category) {
    return res.status(400).json({ error: 'Title, category, and price are required' });
  }

  const product = db.createProduct({
    supplierId: req.user!.id,
    supplierName: req.user!.fullName,
    supplierVerified: true,
    title,
    category,
    description: description || '',
    priceGHS: Number(priceGHS),
    unit: unit || '50kg Bag',
    stockQuantity: Number(stockQuantity) || 100,
    specifications: specifications || {},
    regulatoryApprovalNumber: regulatoryApprovalNumber || 'MoFA-PPRSD-F2026',
    isRegulatedApproved: isRegulatedApproved !== false,
    deliveryAvailable: deliveryAvailable !== false,
    pickupAvailable: pickupAvailable !== false,
    location: location || 'Sunyani Regional Depot',
    imageUrl: imageUrl || '/src/assets/images/agricultural_inputs_display_1791938388813.jpg',
    rating: 5.0,
    reviewCount: 1,
  });

  db.addAuditLog({
    actorId: req.user!.id,
    actorName: req.user!.fullName,
    actorRole: req.user!.role,
    action: 'CREATED_PRODUCT',
    resourceType: 'Product',
    resourceId: product.id,
    details: `Created product: ${product.title} (GHS ${product.priceGHS})`,
  });

  return res.status(201).json({ message: 'Product created successfully', product });
});

// Update product (Fertilizer Dealer, Seed Dealer, Supplier, Admin)
marketplaceRouter.put('/products/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const updates = req.body;

  if (updates.priceGHS !== undefined) {
    updates.priceGHS = Number(updates.priceGHS);
  }
  if (updates.stockQuantity !== undefined) {
    updates.stockQuantity = Number(updates.stockQuantity);
  }

  const updated = db.updateProduct(id, updates);
  if (!updated) {
    return res.status(404).json({ error: 'Product not found' });
  }

  db.addAuditLog({
    actorId: req.user!.id,
    actorName: req.user!.fullName,
    actorRole: req.user!.role,
    action: 'UPDATED_PRODUCT',
    resourceType: 'Product',
    resourceId: updated.id,
    details: `Updated product ${updated.title}: price GHS ${updated.priceGHS}, stock ${updated.stockQuantity}`,
  });

  return res.json({ message: 'Product updated successfully', product: updated });
});

// Delete product
marketplaceRouter.delete('/products/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const removed = db.deleteProduct(id);
  if (!removed) {
    return res.status(404).json({ error: 'Product not found' });
  }

  db.addAuditLog({
    actorId: req.user!.id,
    actorName: req.user!.fullName,
    actorRole: req.user!.role,
    action: 'DELETED_PRODUCT',
    resourceType: 'Product',
    resourceId: id,
    details: `Deleted product: ${removed.title}`,
  });

  return res.json({ message: 'Product removed successfully' });
});
