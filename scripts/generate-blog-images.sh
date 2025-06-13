#!/bin/bash

# Blog Article Image Generation Script
# Run these commands to generate high-quality images for the three articles

echo "=== Generating High-Quality Blog Article Images ==="
echo ""

# 1. Optimism Layer 2 Business Transformation
echo "1. Generating Optimism Layer 2 image..."
curl -X POST "http://localhost:3001/api/generate-media" \
  -H "Content-Type: application/json" \
  -d '{
    "mediaType": "image",
    "modelIdentifier": "google/imagen-4",
    "prompt": "Modern professional illustration of Optimism Layer 2 blockchain technology transforming business. Show interconnected corporate buildings with glowing blue network connections, Ethereum symbols floating around, speed indicators showing fast transactions. Sleek futuristic design with blue, purple, and white gradient background. High-tech business transformation concept.",
    "aspectRatio": "16:9"
  }'

echo ""
echo "2. Generating Quantum Computing AI image..."
curl -X POST "http://localhost:3001/api/generate-media" \
  -H "Content-Type: application/json" \
  -d '{
    "mediaType": "image", 
    "modelIdentifier": "google/imagen-4",
    "prompt": "Futuristic quantum computing and AI convergence illustration. Show quantum circuits with glowing qubits, neural network patterns, and holographic AI interfaces. Abstract technological design with blue, teal, and silver color scheme. Quantum processors, floating data particles, and AI brain representations. High-tech scientific visualization.",
    "aspectRatio": "16:9"
  }'

echo ""
echo "3. Generating Blockchain Supply Chain image..."
curl -X POST "http://localhost:3001/api/generate-media" \
  -H "Content-Type: application/json" \
  -d '{
    "mediaType": "image",
    "modelIdentifier": "google/imagen-4", 
    "prompt": "Professional supply chain blockchain illustration showing global logistics network. Container ships, warehouses, delivery trucks connected by glowing blockchain nodes and verification badges. World map background with trade routes, transparency icons, and tracking elements. Blue and green corporate color scheme with modern clean design.",
    "aspectRatio": "16:9"
  }'

echo ""
echo "=== Image Generation Complete ==="
echo ""
echo "Next steps:"
echo "1. Upload generated images to blob storage with these exact filenames:"
echo "   - optimism-layer-2-business-transformation-high-quality.jpg"
echo "   - quantum-computing-ai-future-high-quality.jpg" 
echo "   - blockchain-supply-chain-revolution-high-quality.jpg"
echo ""
echo "2. Verify social media metadata at: http://localhost:3001/admin/social-metadata"
echo ""
echo "3. Test the updated articles:"
echo "   - http://localhost:3001/blog/how-optimism-layer-2-can-transform-your-business"
echo "   - http://localhost:3001/blog/the-future-of-quantum-computing-in-ai"
echo "   - http://localhost:3001/blog/how-blockchain-is-revolutionizing-supply-chain-management"
