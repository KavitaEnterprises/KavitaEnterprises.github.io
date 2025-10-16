// Node.js Backend Server for Dashboard
const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;
const PRODUCTS_FILE = path.join(__dirname, 'data', 'products.json');

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(__dirname)); // Serve static files

// API Routes

// Get all products
app.get('/api/products', async (req, res) => {
	try {
		const data = await fs.readFile(PRODUCTS_FILE, 'utf8');
		const products = JSON.parse(data);
		res.json(products);
	} catch (error) {
		console.error('Error reading products:', error);
		res.status(500).json({ error: 'Failed to read products' });
	}
});

// Get single product by ID
app.get('/api/products/:id', async (req, res) => {
	try {
		const data = await fs.readFile(PRODUCTS_FILE, 'utf8');
		const products = JSON.parse(data);
		const product = products.find(p => p.id === parseInt(req.params.id));
		
		if (product) {
			res.json(product);
		} else {
			res.status(404).json({ error: 'Product not found' });
		}
	} catch (error) {
		console.error('Error reading product:', error);
		res.status(500).json({ error: 'Failed to read product' });
	}
});

// Create new product
app.post('/api/products', async (req, res) => {
	try {
		const data = await fs.readFile(PRODUCTS_FILE, 'utf8');
		const products = JSON.parse(data);
		
		// Generate new ID
		const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
		const newProduct = { id: newId, ...req.body };
		
		products.push(newProduct);
		
		// Write back to file
		await fs.writeFile(PRODUCTS_FILE, JSON.stringify(products, null, 2), 'utf8');
		
		res.status(201).json(newProduct);
	} catch (error) {
		console.error('Error creating product:', error);
		res.status(500).json({ error: 'Failed to create product' });
	}
});

// Update existing product
app.put('/api/products/:id', async (req, res) => {
	try {
		const data = await fs.readFile(PRODUCTS_FILE, 'utf8');
		let products = JSON.parse(data);
		
		const index = products.findIndex(p => p.id === parseInt(req.params.id));
		
		if (index === -1) {
			return res.status(404).json({ error: 'Product not found' });
		}
		
		// Update product
		products[index] = { id: parseInt(req.params.id), ...req.body };
		
		// Write back to file
		await fs.writeFile(PRODUCTS_FILE, JSON.stringify(products, null, 2), 'utf8');
		
		res.json(products[index]);
	} catch (error) {
		console.error('Error updating product:', error);
		res.status(500).json({ error: 'Failed to update product' });
	}
});

// Delete product
app.delete('/api/products/:id', async (req, res) => {
	try {
		const data = await fs.readFile(PRODUCTS_FILE, 'utf8');
		let products = JSON.parse(data);
		
		const initialLength = products.length;
		products = products.filter(p => p.id !== parseInt(req.params.id));
		
		if (products.length === initialLength) {
			return res.status(404).json({ error: 'Product not found' });
		}
		
		// Write back to file
		await fs.writeFile(PRODUCTS_FILE, JSON.stringify(products, null, 2), 'utf8');
		
		res.json({ message: 'Product deleted successfully' });
	} catch (error) {
		console.error('Error deleting product:', error);
		res.status(500).json({ error: 'Failed to delete product' });
	}
});

// Backup products
app.post('/api/products/backup', async (req, res) => {
	try {
		const data = await fs.readFile(PRODUCTS_FILE, 'utf8');
		const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
		const backupFile = path.join(__dirname, 'data', `products-backup-${timestamp}.json`);
		
		await fs.writeFile(backupFile, data, 'utf8');
		
		res.json({ message: 'Backup created successfully', filename: `products-backup-${timestamp}.json` });
	} catch (error) {
		console.error('Error creating backup:', error);
		res.status(500).json({ error: 'Failed to create backup' });
	}
});

// Start server
app.listen(PORT, () => {
	console.log(`
╔════════════════════════════════════════════╗
║  🚀 FinGaurd Dashboard Server Running     ║
╠════════════════════════════════════════════╣
║  📍 URL: http://localhost:${PORT}         ║
║  📊 Dashboard: /dashboard.html            ║
║  🔌 API: /api/products                    ║
╚════════════════════════════════════════════╝
	`);
});
