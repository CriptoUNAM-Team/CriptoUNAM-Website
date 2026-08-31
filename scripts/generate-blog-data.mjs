import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

// Lee los datos antiguos directamente del archivo JSON
async function readOldData() {
  const oldDataPath = path.join(process.cwd(), 'src', 'data', 'newsletterData.json');
  try {
    const oldDataContent = await fs.readFile(oldDataPath, 'utf-8');
    return JSON.parse(oldDataContent);
  } catch (error) {
    console.warn("No se pudo leer el archivo de datos antiguo, se procederá solo con los nuevos posts.", error);
    return [];
  }
}

const BLOG_DIR = path.join(process.cwd(), 'blog');
const OUTPUT_FILE = path.join(process.cwd(), 'public', 'blog-posts.json');

async function generateBlogData() {
  console.log('Iniciando la generación de datos del blog...');

  const files = await fs.readdir(BLOG_DIR);
  const newPosts = [];

  for (const file of files) {
    if (path.extname(file) === '.md') {
      const filePath = path.join(BLOG_DIR, file);
      const fileContent = await fs.readFile(filePath, 'utf-8');
      const { data, content } = matter(fileContent);

      if (!data.title || !data.date || !data.author || !data.image) {
        console.warn(`Saltando archivo ${file}: metadatos incompletos.`);
        continue;
      }

      newPosts.push({
        id: path.basename(file, '.md'),
        titulo: data.title,
        fecha: data.date,
        autor: data.author,
        imagen: data.image,
        tags: data.tags || ['General'],
        contenido: content,
      });
    }
  }
  
  console.log(`Se encontraron ${newPosts.length} nuevos posts en formato Markdown.`);
  
  const newsletterData = await readOldData();
  console.log(`Se encontraron ${newsletterData.length} posts en el archivo JSON antiguo.`);

  const combinedData = [...newsletterData, ...newPosts];
  
  combinedData.sort((a, b) => {
    const dateA = new Date(a.fecha).getTime();
    const dateB = new Date(b.fecha).getTime();
    return dateB - dateA;
  });

  await fs.writeFile(OUTPUT_FILE, JSON.stringify(combinedData, null, 2));

  console.log(`¡Éxito! Se generó el archivo blog-posts.json con ${combinedData.length} entradas.`);
}

generateBlogData().catch(error => {
  console.error('Error generando los datos del blog:', error);
  process.exit(1);
});
