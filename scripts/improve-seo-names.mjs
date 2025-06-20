#!/usr/bin/env node

/**
 * Improve SEO Names - Create Better, Shorter, More SEO-Friendly Names
 */

import { Client } from '@neondatabase/serverless';
import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

config({ path: path.join(__dirname, '..', '.env.local') });

const DATABASE_URL = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;

// Improved SEO name mappings for better, shorter names
const IMPROVED_SEO_NAMES = {
  // Clean up the very long names
  'fais-a-wide-horizontal-format-image-that-visually-represents-the-integration-of-ai-and-blockchain-technologies-in-financial-services-without-using-any-wor-ru33be8vad3q0nacp4c9cpq4dsmbfswebp': 'fais-ai-blockchain-fintech-integration',
  
  // Clean up temp and random names
  'fais-tempimage2png': 'fais-temp-demo-image-2',
  'fais-tempimage1png': 'fais-temp-demo-image-1',
  'fais-tmpxbht5ht0': 'fais-demo-video-1',
  'fais-tmpjqimjlbf': 'fais-demo-video-2', 
  'fais-tmpw2j61nje': 'fais-demo-video-3',
  'fais-tmp1mvnxlhh': 'fais-demo-video-4',
  
  // Shorten the very long AI generated names while keeping key terms
  'fais-202505122151futuristic-office-collaborationsimplecompose01jv2xcqegeqzsm27xw0wayv3d': 'fais-futuristic-office-collaboration',
  'fais-202505122155futuristic-blockchain-technologysimplecompose01jv2xkk35fg99g5m1yecjjxa3': 'fais-futuristic-blockchain-technology',
  'fais-202505122155futuristic-blockchain-technologysimplecompose01jv2xkk30es1barfywfe58erp': 'fais-blockchain-technology-animation',
  'fais-202505122002ai-powered-transformationsimplecompose01jv2q5pqqekcsr3vyh2q6w63q': 'fais-ai-powered-transformation',
  'fais-202505122033futuristic-ai-interfaceremix01jv2rydgyenzshraz6wwbapjp': 'fais-futuristic-ai-interface',
  'fais-202505122033futuristic-ai-interfaceremix01jv2rydhwfg0am2xmdh0sv8eb': 'fais-ai-interface-design',
  'fais-202505122057futuristic-blockchain-paymentsremix01jv2tacjdf7prr72x36a3r710': 'fais-blockchain-payments-system',
  'fais-202505121951web3-gaming-revolutionsimplecompose01jv2phxzzeprrz0e36tjat8hy': 'fais-web3-gaming-revolution',
  'fais-assetstask01jv0a75qfeahspk0r5pf1k8fs1746988744img0thumb': 'fais-ai-asset-generation',
  'fais-202505112142ai-collage-glowremix01jv0adatqehetjekdp5rcs3qn': 'fais-ai-collage-design',
  'fais-202505112149ai-glow-effectstoryboard01jv0aw3mvf7et4sgshfjs7z7v': 'fais-ai-glow-effect-animation',
  'fais-202505112145abstract-nft-artsimplecompose01jv0amtsbf0vrb4qw92z6pq0n': 'fais-abstract-nft-artwork',
  'fais-202505112154digital-harmonysimplecompose01jv0b560pexvvbv6we6kkm31v': 'fais-digital-harmony-design',
  'fais-202505112154digital-harmonysimplecompose01jv0b560tf81vdpdjdnmadr38': 'fais-digital-harmony-visualization',
  'fais-202505112158futuristic-data-connectivitysimplecompose01jv0bd9emep8ssw4bwmkwkptb': 'fais-futuristic-data-connectivity',
  'fais-202505112158futuristic-data-connectivitysimplecompose01jv0bd9effk38f7eqbr7fhg37': 'fais-data-connectivity-network',
  'fais-202505112158futuristic-data-connectivitysimplecompose01jv0bd9effk38f7eqbr7fhg37-1': 'fais-data-network-visualization',
  'fais-202505112234futuristic-lab-collaborationsimplecompose01jv0deq63ftxae9efk3hvka21': 'fais-futuristic-lab-collaboration',
  'fais-202505112234futuristic-lab-collaborationsimplecompose01jv0deq5yf8d89bcz26rh7bvy': 'fais-lab-collaboration-workspace',
  'fais-202505120027futuristic-fabric-showdownremix01jv0ky3akem0a8r1c6yppzez5-1': 'fais-futuristic-fabric-design',
  
  // Improve other long names
  'fais-1525272441578-qsun1wc6mdk3geegvjjt75pmibcc8iv3drkakgyblc-lc4ex0rkr35becehkh7gwgsy1yg0rpwebp': 'fais-ai-technology-showcase',
  
  // Improve screenshot names to be more descriptive
  'fais-screenshot-2025-01-05-175331-wppshqywiclyfltcfzhxylrpy93pixpng': 'fais-admin-dashboard-screenshot',
  'fais-screenshot-2025-01-05-174629-wxpq1mw2oplbb8v70zjesn9rqpq7w0png': 'fais-development-tools-screenshot',
  'fais-screenshot-2025-01-05-172939-8hjfc36gfs5xyiuijmgkmijgjnvigipng': 'fais-project-management-screenshot',
  'fais-screenshot-2025-01-05-172306-qosrwgzaefz7ghuseah756pbdbr88ypng': 'fais-analytics-dashboard-screenshot',
  'fais-screenshot-2025-01-05-165735-yrprehlpfzcuhqhfoodaeqol59jfjxpng': 'fais-blockchain-explorer-screenshot',
  'fais-screenshot-2025-01-05-160852-cbiqdofamowtentm4tnfnigclpjko3png': 'fais-smart-contract-interface-screenshot',
  'fais-screenshot-2025-01-05-160711-x4tscx0tznl0kekc9xtedtdk9eifztpng': 'fais-defi-platform-screenshot',
  'fais-screenshot-2025-01-05-160251-a1hfy83k9rfzoenroo51nuuulpxwxrpng': 'fais-web3-application-screenshot',
  'fais-screenshot-2025-05-11-220319': 'fais-ai-tools-interface-screenshot',
  
  // Improve other technical names
  'fais-202504262343innovative-cyborg-workspaceremix01jssxav00eks85h1ef0sb7h0d': 'fais-innovative-cyborg-workspace',
  'fais-202504262326cyborg-collaboration-hubremix01jsswcesvf7yrxzw8jabkgkfa': 'fais-cyborg-collaboration-hub',
  'fais-instantid1746353345762': 'fais-ai-generated-portrait-1',
  'fais-instantid1746351252803webp': 'fais-ai-generated-portrait-2',
  'fais-fantasticaiceowebp': 'fais-ai-generated-ceo-portrait',
  
  // Clean up logo names
  'fais-logofaisblackpng': 'fais-logo-black',
  'fais-logowhitefais': 'fais-logo-white',
  'fais-logo-cti5ytuzqkap18obgwvhgn8onhosicpng': 'fais-company-logo',
  'fais-favicon-su6zv0smwkrfpbbr1vizoyxy2hvvxuico': 'fais-favicon-icon',
  'fais-cropped-faviconf-1-2-80x80-iqlsgveyxlrkkxjcbkdgdo4nh7knsspng': 'fais-favicon-cropped',
  
  // Team member photos
  'fais-photo2024-09-0614-10-40-uxollltn4pxpt3zujzotwguhczcxlzjpg': 'fais-team-member-photo-1',
  'fais-photo2024-09-0614-10-40-1024x1024-vzkoohjbsylkqzacwnod2huut3hogzjpg': 'fais-team-member-photo-2',
  'fais-faisceo-eugene-lukyanov': 'fais-ceo-eugene-lukyanov-photo',
  'fais-eugene-lukyanov-hlds14ajhxg6fcqy0aykb0mtkloekojpg': 'fais-eugene-lukyanov-portrait',
  'fais-julia-mazura-tddicj1s7yd7xa7tiixu2voewhj5aawebp': 'fais-julia-mazura-photo',
  'fais-vitaliy-melnyk-wluvov0lc7iymyie2kccgkftawppfcwebp': 'fais-vitaliy-melnyk-photo',
  'fais-team-of-professionalswebp': 'fais-professional-team-photo',
  
  // Project showcase images
  'fais-blockchainandaiblogtopbanner2-spfkgjkisugbccc9xpyn7bqdkgqz4zwebp': 'fais-blockchain-ai-blog-banner',
  'fais-ai-and-blockchain-tech-bindr0m9odzkk6kwqdhgnb81k2jnejwebp': 'fais-ai-blockchain-technology',
  'fais-web3-game-jh8vuewqa09rwqv0kukvn7i7ehhz7wwebp': 'fais-web3-game-development',
  'fais-nft-marketplace-development': 'fais-nft-marketplace-platform',
  'fais-mev-staking-dapp-qu9tslxd01qmzelwswl4gilhfv3lanwebp': 'fais-mev-staking-dapp',
  'fais-dapp-development-300x300-0niivsqb62yuq79oegmuc9nvn4u09bwebp': 'fais-dapp-development-services',
  
  // Generic placeholder
  'fais-placeholderpng': 'fais-placeholder-image'
};

async function improveSEONames() {
  console.log('🚀 Starting SEO Name Improvements...\n');

  const client = new Client({ connectionString: DATABASE_URL });
  await client.connect();

  try {
    let updatedCount = 0;
    let skippedCount = 0;

    for (const [oldName, newName] of Object.entries(IMPROVED_SEO_NAMES)) {
      try {
        // Check if the old name exists
        const existsResult = await client.query(
          'SELECT id, seo_name FROM images WHERE seo_name = $1',
          [oldName]
        );

        if (existsResult.rows.length === 0) {
          console.log(`⏭️ Skipping "${oldName}" - not found`);
          skippedCount++;
          continue;
        }

        // Check if new name already exists
        const conflictResult = await client.query(
          'SELECT id FROM images WHERE seo_name = $1 AND seo_name != $2',
          [newName, oldName]
        );

        if (conflictResult.rows.length > 0) {
          console.log(`⚠️ Conflict: "${newName}" already exists, skipping`);
          skippedCount++;
          continue;
        }

        // Update the name
        await client.query(
          'UPDATE images SET seo_name = $1 WHERE seo_name = $2',
          [newName, oldName]
        );

        console.log(`✅ Updated: "${oldName}" → "${newName}"`);
        updatedCount++;

      } catch (error) {
        console.error(`❌ Error updating "${oldName}":`, error.message);
      }
    }

    console.log(`\n🎉 SEO Name Improvements completed!`);
    console.log(`✅ Updated: ${updatedCount} names`);
    console.log(`⏭️ Skipped: ${skippedCount} names`);

    // Show updated statistics
    const stats = await client.query(`
      SELECT 
        COUNT(*) as total,
        AVG(LENGTH(seo_name)) as avg_length,
        MAX(LENGTH(seo_name)) as max_length,
        COUNT(CASE WHEN LENGTH(seo_name) > 60 THEN 1 END) as long_names
      FROM images
    `);

    console.log(`\n📊 Updated Statistics:`);
    const stat = stats.rows[0];
    console.log(`- Total images: ${stat.total}`);
    console.log(`- Average SEO name length: ${Math.round(stat.avg_length)} chars`);
    console.log(`- Max SEO name length: ${stat.max_length} chars`);
    console.log(`- Names over 60 chars: ${stat.long_names}`);

    // Show remaining long names
    const remainingLongNames = await client.query(`
      SELECT seo_name, LENGTH(seo_name) as length
      FROM images 
      WHERE LENGTH(seo_name) > 70
      ORDER BY length DESC
      LIMIT 5
    `);

    if (remainingLongNames.rows.length > 0) {
      console.log(`\n📏 Remaining long names (may need manual review):`);
      remainingLongNames.rows.forEach(row => {
        console.log(`- ${row.seo_name} (${row.length} chars)`);
      });
    }

  } finally {
    await client.end();
  }
}

improveSEONames().catch(console.error);
