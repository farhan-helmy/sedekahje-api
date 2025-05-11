import fs from 'fs'
import path from 'path'
import { DB } from '~/config'
import { Institution } from '~/models'

// Connect to MongoDB
DB().then(async () => {
  try {
    // Read the JSON file
    const filePath = path.join(process.cwd(), 'db', 'sedekahje-data.json')
    const jsonData = fs.readFileSync(filePath, 'utf8')
    const institutions = JSON.parse(jsonData)

    // Clear existing institutions
    await Institution.deleteMany({})
    console.log('Cleared existing institutions')

    // Track used slugs to handle duplicates
    const usedSlugs = new Set<string>()

    // Add slug field to each institution
    const institutionsWithSlug = institutions.map((institution: any) => {
      let baseSlug = institution.name
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
      
      let slug = baseSlug
      let counter = 1
      
      // If slug already exists, add a numeric suffix
      while (usedSlugs.has(slug)) {
        slug = `${baseSlug}-${counter}`
        counter++
      }
      
      // Add the final slug to the set of used slugs
      usedSlugs.add(slug)
      
      return { ...institution, slug }
    })

    // Insert the institutions
    await Institution.insertMany(institutionsWithSlug)
    console.log(`Seeded ${institutionsWithSlug.length} institutions successfully`)

    process.exit(0)
  } catch (error) {
    console.error('Error seeding data:', error)
    process.exit(1)
  }
}).catch((error) => {
  console.error('Error connecting to database:', error)
  process.exit(1)
}) 