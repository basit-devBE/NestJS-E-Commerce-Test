const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Create some sample products
  const products = [
    {
      name: 'Smartphone X',
      description: 'Latest generation smartphone with advanced features',
      price: 999.99,
      stock: 50,
    },
    {
      name: 'Laptop Pro',
      description: 'High-performance laptop for professionals',
      price: 1299.99,
      stock: 25,
    },
    {
      name: 'Wireless Headphones',
      description: 'Noise-cancelling wireless headphones with premium sound quality',
      price: 249.99,
      stock: 100,
    },
    {
      name: 'Smart Watch',
      description: 'Fitness and health tracking smartwatch',
      price: 199.99,
      stock: 75,
    },
    {
      name: 'Tablet Ultra',
      description: 'Lightweight tablet with stunning display',
      price: 599.99,
      stock: 40,
    },
    {
      name: 'Bluetooth Speaker',
      description: 'Portable waterproof speaker with 24-hour battery life',
      price: 129.99,
      stock: 120,
    },
    {
      name: 'Gaming Console',
      description: 'Next-gen gaming console with 4K graphics',
      price: 499.99,
      stock: 15,
    },
    {
      name: 'Wireless Earbuds',
      description: 'True wireless earbuds with charging case',
      price: 149.99,
      stock: 200,
    },
    {
      name: 'Digital Camera',
      description: 'Professional DSLR camera with 4K video recording',
      price: 899.99,
      stock: 30,
    },
    {
      name: 'Smart Home Hub',
      description: 'Central control device for all smart home devices',
      price: 159.99,
      stock: 60,
    }
  ];

  console.log('Starting to seed products...');
  
  for (const product of products) {
    const createdProduct = await prisma.product.create({
      data: product,
    });
    console.log(`Created product: ${createdProduct.name} (ID: ${createdProduct.id})`);
  }

  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error('Error seeding products:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });