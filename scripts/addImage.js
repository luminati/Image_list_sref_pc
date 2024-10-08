const fs = require('fs');
const path = require('path');

const imagePath = path.join(__dirname, '..', 'src', 'data', 'images.json');

const addImage = (url, tags, description, category) => {
  const imageData = JSON.parse(fs.readFileSync(imagePath, 'utf8'));
  const newId = Math.max(...imageData.images.map(img => img.id)) + 1;

  const newImage = {
    id: newId,
    url,
    tags,
    description,
    category
  };

  imageData.images.push(newImage);

  fs.writeFileSync(imagePath, JSON.stringify(imageData, null, 2));
  console.log('Image added successfully!');
};

// Example usage:
// node addImage.js "https://example.com/image.jpg" "tag1,tag2,tag3" "Image description" "general"
if (require.main === module) {
  const [url, tags, description, category] = process.argv.slice(2);
  if (!url || !tags || !description || !category) {
    console.log('Usage: node addImage.js <url> <tags> <description> <category>');
    process.exit(1);
  }
  addImage(url, tags.split(','), description, category);
}

module.exports = addImage;