import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight, faCamera } from '@fortawesome/free-solid-svg-icons'
import SEOHead from '../components/SEOHead'
import '../styles/global.css'

// Mapeo de imágenes por mes
const monthImages: Record<string, string[]> = {
  ENERO: [
    '65abfefe-90b1-4122-985a-0b02dd95833e.JPG',
    'IMG_1021.HEIC',
    'IMG_1054.HEIC',
    'IMG_1061.HEIC',
    'IMG_1064.HEIC',
    'IMG_1065.HEIC'
  ],
  FEBRERO: [
    '305D7F65-74C4-412C-B606-11154F7D2FE6 2.JPG',
    '3ECEA6CC-BED8-4421-BBA2-BF6BC6669922.JPG',
    '77bb370d-c32f-42f8-aa79-87d47929b239.JPG',
    'B1F27CE8-9CBC-4D5D-9431-9EF3B19986DA.JPG',
    'camphoto_1903590565.JPG',
    'camphoto_959030623.JPG',
    'IMG_1370.HEIC',
    'IMG_1379.HEIC',
    'IMG_1407.HEIC',
    'IMG_1486.PNG',
    'IMG_1509.HEIC',
    'IMG_1516.HEIC',
    'IMG_1526.HEIC',
    'IMG_1650.HEIC',
    'IMG_1652.HEIC',
    'IMG_1655.HEIC',
    'IMG_1666.HEIC',
    'IMG_1670.HEIC',
    'IMG_1673.HEIC',
    'IMG_1674.HEIC',
    'IMG_1676.HEIC',
    'IMG_1678.HEIC',
    'IMG_1740.jpg',
    'IMG_4409.HEIF',
    'IMG_4454.HEIF'
  ],
  MARZO: [
    '16EF3BED-A9CC-4B2C-8A91-4003EBC49487.JPG',
    '784BBF1F-045F-41FC-A49C-DE177B0C5003.JPG',
    'A7CBB16B-FD9E-44A6-9DEE-AA596EE15697.JPG',
    'IMG_1801.HEIC',
    'IMG_1877.HEIC',
    'IMG_1901.HEIC',
    'IMG_1913.HEIC',
    'IMG_1922.HEIC',
    'IMG_1932.HEIC',
    'IMG_1946.JPG',
    'IMG_1947.JPG',
    'IMG_2016.HEIC',
    'IMG_2028.HEIC',
    'IMG_2031.HEIC',
    'IMG_2220.HEIC',
    'IMG_2377.HEIC',
    'IMG_2391.HEIC',
    'IMG_2431 2.HEIC',
    'IMG_2548.PNG',
    'IMG_2613.HEIC',
    'IMG_2696.HEIC',
    'IMG_2804.HEIC',
    'IMG_2862.HEIC',
    'IMG_2870.HEIC',
    'IMG_2896.HEIC',
    'IMG_2897.HEIC',
    'IMG_2901.HEIC',
    'IMG_2903.HEIC'
  ],
  ABRIL: [
    'c3eb8977-2bc8-457f-a87f-b7f17d6ed967.JPG',
    'IMG_2955.HEIC',
    'IMG_2958.HEIC',
    'IMG_2964.HEIC',
    'IMG_3002.HEIC',
    'IMG_3011.HEIC',
    'IMG_3036.JPG',
    'IMG_3043.HEIC',
    'IMG_3046.HEIC',
    'IMG_3052.JPG',
    'IMG_3090.HEIC',
    'IMG_3091.HEIC',
    'IMG_3260.HEIC',
    'IMG_3283.HEIC',
    'IMG_3329.PNG',
    'IMG_3418.HEIC',
    'IMG_3425.HEIC',
    'IMG_3429.heic',
    'IMG_3430.HEIC',
    'IMG_3433.HEIC',
    'IMG_3480.HEIC',
    'IMG_3488.HEIC',
    'IMG_3489.HEIC',
    'IMG_3508.HEIC',
    'IMG_3509.HEIC',
    'IMG_3520.HEIC',
    'IMG_3524.HEIC',
    'IMG_3529.HEIC',
    'IMG_3534.HEIC'
  ],
  MAYO: [
    '0c04b7d6-0cf1-43b4-9506-c8318a4af1ea 2.JPG',
    '4f3ba804-7c7d-4bb0-96de-6d912d5b6a4d 2.JPG',
    '5c7e70e9-fd07-4f7d-99a0-e1bcc1eab3bf 2.JPG',
    '6BDD7C54-BCDC-4682-930E-2D959357A8C4 2.JPG',
    '804ae1cf-1914-44e6-bc74-b225c7b7231e 2.JPG',
    'ABBCCA98-4998-4B87-A228-152B8ECF8587 2.JPG',
    'DFA28DF5-0D1A-40BC-B2FD-E018B3FB87A1 2.JPG',
    'e0126864-cbe4-4eb8-ab67-96e4d4270da2 2.JPG',
    'e7696d32-51e5-4b71-8902-13f2b214b0a5 2.JPG',
    'IMG_3547 2.HEIC',
    'IMG_3553 2.HEIC',
    'IMG_3557 2.HEIC',
    'IMG_3560 2.JPG',
    'IMG_3579 2.HEIC',
    'IMG_3593 2.HEIC',
    'IMG_3612 2.HEIC',
    'IMG_3617 2.HEIC',
    'IMG_3657 2.HEIC',
    'IMG_3658 2.HEIC',
    'IMG_3682 2.HEIC',
    'IMG_3722 2.JPG',
    'IMG_3725 2.JPG',
    'IMG_3753 2.HEIC',
    'IMG_3763 2.JPG',
    'IMG_3889 2.HEIC',
    'IMG_3890 2.HEIC',
    'IMG_3949 2.HEIC',
    'IMG_3950 2.HEIC',
    'IMG_3973 2.HEIC',
    'IMG_3997 2.HEIC',
    'IMG_4008 2.HEIC',
    'IMG_4104 2.HEIC',
    'IMG_4105 2.HEIC',
    'IMG_4157 2.HEIC',
    'IMG_4160 2.HEIC'
  ],
  JUNIO: [
    '55A059F5-EDEE-4124-A622-D429C35A23FE.JPG',
    '7556f6fe-e87c-4a43-b8bf-879035a20da2.JPG',
    'a1a2c0db-d26b-42ed-aa03-7a95aceb3b18.JPG',
    'IMG_4187.PNG',
    'IMG_4260.HEIC',
    'IMG_4260.jpg',
    'IMG_4272.HEIC',
    'IMG_4437.HEIC',
    'IMG_4437.jpg',
    'IMG_4458.PNG',
    'IMG_4493.JPG'
  ],
  JULIO: [
    'IMG_4561.JPG',
    'IMG_4606.HEIC',
    'IMG_4610.HEIC',
    'IMG_4623.HEIC',
    'IMG_4641.HEIC',
    'IMG_4662.HEIC',
    'IMG_4677.HEIC',
    'IMG_4688.PNG',
    'IMG_4689.HEIC',
    'IMG_4712.JPG',
    'IMG_4764.HEIC',
    'IMG_4796.HEIC',
    'IMG_4807.HEIC',
    'IMG_4829.HEIC',
    'IMG_4855.HEIC',
    'IMG_4864.HEIC',
    'IMG_4905.HEIC',
    'IMG_4935.HEIC',
    'IMG_4940.HEIC'
  ],
  AGOSTO: [
    'camphoto_1804928587 2.JPG',
    'camphoto_1804928587.JPG',
    'camphoto_33463914 2.JPG',
    'camphoto_959030623 2.JPG',
    'IMG_5117.HEIC',
    'IMG_5195.HEIC',
    'IMG_5210.HEIC',
    'IMG_5214.HEIC',
    'IMG_5220.HEIC',
    'IMG_5269.HEIC',
    'IMG_5273.HEIC',
    'IMG_5279.HEIC',
    'IMG_5289.HEIC',
    'IMG_5322.HEIC',
    'IMG_5324.HEIC',
    'IMG_5329.HEIC',
    'IMG_5358.HEIC',
    'IMG_5363.HEIC',
    'IMG_5371.HEIC',
    'IMG_5376.HEIC',
    'IMG_5426.HEIC',
    'IMG_5429.JPG',
    'IMG_5455 2.HEIC',
    'IMG_5456 2.HEIC',
    'IMG_5465.HEIC',
    'IMG_5471.HEIC',
    'IMG_5474.HEIC',
    'IMG_5479.HEIC',
    'IMG_5489.HEIC',
    'IMG_5494.HEIC',
    'IMG_5515.JPG',
    'IMG_5516.JPG',
    'IMG_5525.JPG'
  ],
  SEPTIEMBRE: [
    'camphoto_33463914 3.JPG',
    'camphoto_959030623 3.JPG',
    'IMG_5753 3.jpg',
    'IMG_5799 3.HEIC',
    'IMG_5847 3.JPG',
    'IMG_5922 3.HEIC',
    'IMG_5977 3.HEIC',
    'IMG_5979 3.HEIC',
    'IMG_6014 3.HEIC',
    'IMG_6025 3.HEIC',
    'IMG_6042 3.HEIC',
    'IMG_6046 3.HEIC',
    'IMG_6063 3.HEIC',
    'IMG_6102 3.HEIC',
    'IMG_6116 3.HEIC',
    'IMG_6217 3.HEIC',
    'IMG_6417 3.HEIC',
    'IMG_6462 3.HEIC',
    'IMG_6493 3.HEIC'
  ],
  OCTUBRE: [
    '57b46d46-8f91-44c5-b7f6-868620625819.JPG',
    'IMG_6538.HEIC',
    'IMG_6539.HEIC',
    'IMG_6710.HEIC',
    'IMG_6717.HEIC',
    'IMG_6727.JPG',
    'IMG_6784.HEIC',
    'IMG_6787.HEIC',
    'IMG_6799.PNG',
    'IMG_6805.PNG',
    'IMG_6914.PNG',
    'IMG_6954.HEIC',
    'IMG_6958.HEIC',
    'IMG_6960.HEIC',
    'IMG_6983 2.JPG',
    'IMG_7006.HEIC',
    'IMG_7009.HEIC',
    'photo_2025-12-20 13.30.49.jpeg',
    'photo_2025-12-20 13.30.51.jpeg',
    'photo_2025-12-20 13.30.53.jpeg',
    'photo_2025-12-20 13.30.55.jpeg'
  ],
  NOVIEMBRE: [
    '007f7872bdaaf1719ef62595f2f2bd39 2.JPG',
    'IMG_7079 2.JPG',
    'IMG_7081 2.HEIC',
    'IMG_7092 2.HEIC',
    'IMG_7185 2.HEIC',
    'IMG_7222 2.HEIC',
    'IMG_7251 2.HEIC',
    'IMG_7277 2.HEIC',
    'IMG_7283 2.JPG',
    'IMG_7306 2.HEIC',
    'IMG_7326 2.HEIC',
    'IMG_7346 2.HEIC',
    'IMG_7382 2.HEIC',
    'IMG_7418 2.HEIC',
    'IMG_7432 2.HEIC',
    'IMG_7477 2.HEIC',
    'IMG_7509 2.PNG',
    'IMG_7518 2.HEIC',
    'IMG_7519 2.HEIC',
    'IMG_7526 2.HEIC',
    'IMG_7569 2.HEIC',
    'IMG_7581 2.HEIC',
    'IMG_7595 2.PNG',
    'IMG_7596 2.PNG',
    'IMG_7598 2.PNG',
    'IMG_7647 2.HEIC',
    'IMG_7658 2.HEIC',
    'IMG_7795 2.HEIC',
    'IMG_7929 2.HEIC',
    'IMG_7934 2.HEIC',
    'photo_2025-12-20 13.33.26.jpeg',
    'photo_2025-12-20 13.33.29.jpeg',
    'photo_2025-12-20 13.33.31.jpeg',
    'photo_2025-12-20 13.33.33.jpeg'
  ],
  DICIEMBRE: [
    'IMG_8034.JPG',
    'IMG_8049.HEIC',
    'IMG_8062.PNG',
    'IMG_8088.PNG',
    'IMG_8129.PNG',
    'IMG_8156.HEIC',
    'IMG_8164.JPG'
  ]
}

const YearInReview: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const totalSlides = 18

  // Función helper para obtener la ruta de la imagen
  const getImagePath = (month: string, filename: string) => {
    // En Vite, las rutas desde /public se sirven desde la raíz
    // No codificar aquí, dejar que el navegador maneje la codificación
    return `/images/${month}_CRIPTOUNAM/${filename}`
  }

  // Componente de galería de imágenes
  const ImageGallery: React.FC<{ month: string }> = ({ month }) => {
    const images = monthImages[month] || []
    
    // Procesar imágenes: convertir HEIC/HEIF a JPG y filtrar solo compatibles
    const compatibleImages = images
      .map(filename => {
        const ext = filename.toLowerCase()
        // Si es HEIC/HEIF, buscar versión JPG equivalente (ya convertida)
        if (ext.endsWith('.heic') || ext.endsWith('.heif')) {
          const baseName = filename.replace(/\.(heic|HEIC|heif|HEIF)$/i, '')
          return `${baseName}.jpg` // Usar versión JPG convertida
        }
        return filename
      })
      .filter(filename => {
        const ext = filename.toLowerCase()
        return ext.endsWith('.jpg') || ext.endsWith('.jpeg') || ext.endsWith('.png') || ext.endsWith('.gif') || ext.endsWith('.webp') || ext.endsWith('.JPG') || ext.endsWith('.JPEG') || ext.endsWith('.PNG')
      })
      // Eliminar duplicados (por si hay tanto HEIC como JPG en la lista)
      .filter((value, index, self) => self.indexOf(value) === index)
    
    if (compatibleImages.length === 0) {
      return (
        <div className="image-placeholder">
          <FontAwesomeIcon icon={faCamera} />
          <p>No hay imágenes compatibles disponibles</p>
        </div>
      )
    }

    // Log para debugging
    if (import.meta.env.DEV) {
      console.log(`📸 ${month}: ${compatibleImages.length} imágenes compatibles`, compatibleImages)
    }

    return (
      <div className="image-gallery">
        <div className="image-gallery-grid">
          {compatibleImages.map((filename, index) => {
            // Construir diferentes variaciones de la ruta
            const basePath = `/images/${month}_CRIPTOUNAM/`
            
            // Generar todas las variaciones posibles
            const paths = [
              basePath + encodeURIComponent(filename), // Codificado completo
              basePath + filename.replace(/\s+/g, '%20'), // Espacios como %20
              basePath + filename, // Sin codificar
              basePath + filename.replace(/\s+/g, '+'), // Espacios como +
              // Variaciones de mayúsculas/minúsculas
              basePath + filename.toLowerCase(),
              basePath + filename.toUpperCase(),
            ]
            
            // Eliminar duplicados
            const uniquePaths = Array.from(new Set(paths))
            
            if (import.meta.env.DEV && index < 3) {
              console.log(`🖼️ [${index}] Intentando cargar: ${filename}`, uniquePaths[0])
            }
            
            return (
              <div 
                key={`${month}-${index}-${filename}`} 
                className="gallery-image-wrapper"
              >
                <img
                  src={uniquePaths[0]}
                  alt={`${month} - ${filename}`}
                  className="gallery-image"
                  loading="lazy"
                  data-filename={filename}
                  data-attempt="0"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    const attempt = parseInt(target.dataset.attempt || '0')
                    
                    if (attempt < uniquePaths.length - 1) {
                      // Intentar siguiente variación
                      const nextAttempt = attempt + 1
                      target.dataset.attempt = String(nextAttempt)
                      target.src = uniquePaths[nextAttempt]
                      if (import.meta.env.DEV) {
                        console.warn(`🔄 [${target.dataset.filename}] Reintentando (${nextAttempt + 1}/${uniquePaths.length}): ${uniquePaths[nextAttempt]}`)
                      }
                    } else {
                      // Todas las variaciones fallaron
                      if (import.meta.env.DEV) {
                        console.error(`❌ No se pudo cargar: ${filename}`, uniquePaths)
                      }
                      target.style.display = 'none'
                      target.style.opacity = '0'
                    }
                  }}
                  onLoad={(e) => {
                    const target = e.currentTarget as HTMLImageElement
                    target.style.opacity = '1'
                    target.style.filter = 'none'
                    target.style.display = 'block'
                    if (import.meta.env.DEV && index < 3) {
                      console.log(`✅ Cargada: ${filename}`)
                    }
                  }}
                />
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides)
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        nextSlide()
      } else if (e.key === 'ArrowLeft') {
        prevSlide()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const progress = ((currentSlide + 1) / totalSlides) * 100

  return (
    <>
      <SEOHead 
        title="CriptoUNAM Executive Recap 2024-2025"
        description="Resumen ejecutivo del año 2024-2025 de CriptoUNAM"
      />
      <div className="year-review-container">
        <style>{`
          :root {
            --unam-blue: #002B7A;
            --unam-gold: #D4AF37;
            --bg-dark: #0a0a0c;
            --card-bg: rgba(255, 255, 255, 0.03);
            --transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
          }

          .year-review-container {
            background-color: var(--bg-dark);
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            color: #fff;
            overflow: hidden;
            height: 100vh;
            width: 100vw;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 9999;
            isolation: isolate;
          }

          .year-review-container * {
            box-sizing: border-box;
          }

          .presentation {
            width: 100vw;
            height: 100vh;
            position: relative;
          }

          .slide {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 60px;
            opacity: 0;
            pointer-events: none;
            transform: translateY(20px);
            transition: var(--transition);
            z-index: 1;
          }

          .slide.active {
            opacity: 1;
            pointer-events: all;
            transform: translateY(0);
            z-index: 10;
          }

          .slide-title {
            font-family: 'Urbanist', 'Chakra Petch', sans-serif;
            font-size: 42px;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: -1px;
            margin-bottom: 15px;
            text-align: center;
            line-height: 1;
          }

          .slide-subtitle {
            font-size: 20px;
            color: var(--unam-gold);
            text-transform: uppercase;
            letter-spacing: 4px;
            margin-bottom: 40px;
            font-weight: 600;
          }

          .content-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 0;
            width: 100%;
            max-width: 100%;
            align-items: start;
            height: 100%;
          }
          
          .content-grid-month {
            width: 100%;
            height: calc(100vh - 200px);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          }

          .card {
            background: var(--card-bg);
            border: 1px solid rgba(255,255,255,0.1);
            padding: 20px;
            border-radius: 16px;
            backdrop-filter: blur(10px);
            font-size: 14px;
            line-height: 1.5;
          }

          .logo-main {
            height: 180px;
            margin-bottom: 30px;
            filter: drop-shadow(0 0 20px rgba(212, 175, 55, 0.3));
          }

          .floating-logo {
            position: absolute;
            top: 40px;
            left: 40px;
            height: 50px;
            z-index: 100;
            opacity: 0.6;
          }

          .month-badge {
            background: var(--unam-gold);
            color: #000;
            padding: 5px 15px;
            border-radius: 4px;
            font-weight: 900;
            font-size: 14px;
            margin-bottom: 15px;
            display: inline-block;
          }

          .stats-huge {
            font-size: 140px;
            font-weight: 900;
            color: var(--unam-gold);
            line-height: 1;
            font-family: 'Urbanist', 'Chakra Petch', sans-serif;
          }

          .project-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            width: 100%;
            max-width: 1200px;
          }

          /* .project-tile definido más abajo con animaciones mejoradas */

          .team-section {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 30px;
            width: 100%;
            max-width: 1000px;
          }

          .team-member {
            text-align: center;
          }

          .team-member h4 {
            color: var(--unam-gold);
            font-size: 18px;
            margin-bottom: 5px;
          }

          .team-member p {
            font-size: 14px;
            opacity: 0.7;
          }

          .controls {
            position: absolute;
            bottom: 40px;
            display: flex;
            align-items: center;
            gap: 20px;
            z-index: 100;
          }

          .nav-btn {
            background: rgba(255,255,255,0.1);
            border: none;
            color: white;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            cursor: pointer;
            transition: 0.3s;
            display: flex;
            justify-content: center;
            align-items: center;
          }

          .nav-btn:hover {
            background: var(--unam-gold);
            color: black;
          }

          .progress-bar {
            width: 300px;
            height: 4px;
            background: rgba(255,255,255,0.1);
            border-radius: 2px;
            position: relative;
          }

          .progress-fill {
            position: absolute;
            left: 0;
            top: 0;
            height: 100%;
            background: var(--unam-gold);
            transition: 0.3s;
          }

          .bg-glow {
            position: absolute;
            width: 600px;
            height: 600px;
            background: radial-gradient(circle, rgba(0, 43, 122, 0.2) 0%, transparent 70%);
            border-radius: 50%;
            z-index: 0;
            pointer-events: none;
          }

          .image-placeholder {
            width: 100%;
            height: 350px;
            background: #111;
            border-radius: 16px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            border: 1px dashed rgba(255,255,255,0.2);
            color: rgba(255,255,255,0.3);
          }

          .image-placeholder svg {
            font-size: 48px;
            margin-bottom: 10px;
          }

          .image-gallery {
            width: 100%;
            max-width: 100%;
            max-height: calc(100vh - 200px);
            height: calc(100vh - 200px);
            overflow-y: auto;
            overflow-x: hidden;
            padding: 20px;
            background: rgba(0,0,0,0.2);
            border-radius: 0;
            border: none;
          }

          .image-gallery-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 20px;
            padding: 10px;
            width: 100%;
          }

          .gallery-image {
            width: 100%;
            height: 250px;
            object-fit: cover;
            border-radius: 12px;
            border: 2px solid rgba(212, 175, 55, 0.4);
            transition: all 0.3s ease;
            cursor: pointer;
            display: block !important;
            background: rgba(255,255,255,0.02);
            opacity: 1 !important;
            visibility: visible !important;
            position: relative;
            z-index: 2;
          }
          
          .gallery-image:not([src]), 
          .gallery-image[src=""],
          .gallery-image[style*="display: none"] {
            display: none !important;
          }

          .gallery-image:hover {
            transform: scale(1.05);
            border-color: var(--unam-gold);
            box-shadow: 0 4px 12px rgba(212, 175, 55, 0.4);
          }

          .gallery-image[src=""] {
            display: none;
          }

          .gallery-image-wrapper {
            position: relative;
            width: 100%;
            min-height: 250px;
            background: rgba(0,0,0,0.2);
            border-radius: 12px;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .gallery-image-wrapper::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.3);
            z-index: 1;
            opacity: 0;
            transition: opacity 0.3s;
          }
          
          .gallery-image-wrapper:has(img[src=""])::before,
          .gallery-image-wrapper:not(:has(img[src]))::before {
            opacity: 1;
          }

          .image-gallery::-webkit-scrollbar {
            width: 8px;
          }

          .image-gallery::-webkit-scrollbar-track {
            background: rgba(255,255,255,0.05);
            border-radius: 4px;
          }

          .image-gallery::-webkit-scrollbar-thumb {
            background: var(--unam-gold);
            border-radius: 4px;
          }

          .image-gallery::-webkit-scrollbar-thumb:hover {
            background: #F4C842;
          }

          /* Estilos mejorados para slides especiales */
          .hackathon-card {
            background: rgba(0, 0, 0, 0.4);
            padding: 30px;
            border-radius: 20px;
            border: 3px solid var(--unam-gold);
            position: relative;
            overflow: hidden;
            transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
            animation: slideInUp 0.6s ease-out backwards;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), 
                        inset 0 0 60px rgba(212, 175, 55, 0.1),
                        0 0 40px rgba(212, 175, 55, 0.2);
          }

          .hackathon-card::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: rgba(212, 175, 55, 0.1);
            animation: rotate 8s linear infinite;
            opacity: 0;
            transition: opacity 0.5s;
          }

          .hackathon-card::after {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: rgba(212, 175, 55, 0.2);
            transition: left 0.6s;
          }

          .hackathon-card:hover::before {
            opacity: 1;
          }

          .hackathon-card:hover::after {
            left: 100%;
          }

          .hackathon-card:hover {
            transform: translateY(-8px) scale(1.02);
            border-color: var(--unam-gold);
            box-shadow: 0 15px 50px rgba(212, 175, 55, 0.5), 
                        inset 0 0 80px rgba(212, 175, 55, 0.2),
                        0 0 60px rgba(212, 175, 55, 0.4);
            background: rgba(212, 175, 55, 0.15);
          }

          .hackathon-card:nth-child(1) {
            animation-delay: 0.1s;
          }

          .hackathon-card:nth-child(2) {
            animation-delay: 0.2s;
          }

          .hackathon-item {
            padding: 10px 12px;
            margin: 4px 0;
            border-left: 3px solid transparent;
            border-radius: 6px;
            transition: all 0.3s ease;
            animation: fadeInLeft 0.5s ease-out backwards;
            background: rgba(255, 255, 255, 0.02);
            position: relative;
          }

          .hackathon-item::before {
            content: '▸';
            position: absolute;
            left: -10px;
            color: var(--unam-gold);
            opacity: 0;
            transition: all 0.3s;
            font-size: 18px;
          }

          .hackathon-item:nth-child(1) { animation-delay: 0.2s; }
          .hackathon-item:nth-child(2) { animation-delay: 0.25s; }
          .hackathon-item:nth-child(3) { animation-delay: 0.3s; }
          .hackathon-item:nth-child(4) { animation-delay: 0.35s; }
          .hackathon-item:nth-child(5) { animation-delay: 0.4s; }
          .hackathon-item:nth-child(6) { animation-delay: 0.45s; }
          .hackathon-item:nth-child(7) { animation-delay: 0.5s; }
          .hackathon-item:nth-child(8) { animation-delay: 0.55s; }
          .hackathon-item:nth-child(9) { animation-delay: 0.6s; }
          .hackathon-item:nth-child(10) { animation-delay: 0.65s; }
          .hackathon-item:nth-child(11) { animation-delay: 0.7s; }
          .hackathon-item:nth-child(12) { animation-delay: 0.75s; }
          .hackathon-item:nth-child(13) { animation-delay: 0.8s; }
          .hackathon-item:nth-child(14) { animation-delay: 0.85s; }
          .hackathon-item:nth-child(15) { animation-delay: 0.9s; }
          .hackathon-item:nth-child(16) { animation-delay: 0.95s; }
          .hackathon-item:nth-child(17) { animation-delay: 1s; }
          .hackathon-item:nth-child(18) { animation-delay: 1.05s; }

          .hackathon-item:hover {
            padding-left: 20px;
            background: rgba(212, 175, 55, 0.15);
            border-left-color: var(--unam-gold);
            transform: translateX(5px);
            box-shadow: 0 2px 10px rgba(212, 175, 55, 0.2);
          }

          .hackathon-item:hover::before {
            opacity: 1;
            left: 0;
          }

          .hackathon-total {
            color: var(--unam-gold);
            animation: pulse 2s ease-in-out infinite;
            text-shadow: 0 0 30px rgba(212, 175, 55, 0.8);
            position: relative;
          }

          .hackathon-total::before {
            content: '💰';
            margin-right: 10px;
            font-size: 32px;
            animation: bounce 2s ease-in-out infinite;
            display: inline-block;
          }

          .project-tile {
            background: rgba(0, 0, 0, 0.4);
            padding: 35px;
            border-radius: 24px;
            border: 3px solid var(--unam-gold);
            position: relative;
            overflow: hidden;
            transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
            animation: scaleIn 0.6s ease-out backwards;
            cursor: pointer;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4),
                        inset 0 0 60px rgba(212, 175, 55, 0.1),
                        0 0 50px rgba(212, 175, 55, 0.15);
          }

          .project-tile::before {
            content: '⭐';
            position: absolute;
            top: 15px;
            right: 15px;
            font-size: 24px;
            opacity: 0.3;
            animation: twinkle 2s ease-in-out infinite;
            transition: all 0.3s;
          }

          .project-tile::after {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: rgba(212, 175, 55, 0.1);
            opacity: 0;
            transition: opacity 0.5s;
            animation: rotate 10s linear infinite;
          }

          .project-tile:hover::before {
            opacity: 1;
            transform: scale(1.3) rotate(15deg);
          }

          .project-tile:hover::after {
            opacity: 1;
          }

          .project-tile:hover {
            transform: translateY(-12px) scale(1.03) rotate(1deg);
            border-color: var(--unam-gold);
            box-shadow: 0 20px 60px rgba(212, 175, 55, 0.5),
                        inset 0 0 80px rgba(212, 175, 55, 0.2),
                        0 0 80px rgba(212, 175, 55, 0.4);
            background: rgba(212, 175, 55, 0.15);
          }

          .project-tile:nth-child(1) { animation-delay: 0.1s; }
          .project-tile:nth-child(2) { animation-delay: 0.15s; }
          .project-tile:nth-child(3) { animation-delay: 0.2s; }
          .project-tile:nth-child(4) { animation-delay: 0.25s; }
          .project-tile:nth-child(5) { animation-delay: 0.3s; }
          .project-tile:nth-child(6) { animation-delay: 0.35s; }
          .project-tile:nth-child(7) { animation-delay: 0.4s; }

          .project-tile h3 {
            position: relative;
            z-index: 2;
            transition: all 0.4s;
            color: var(--unam-gold);
            font-size: 24px;
          }

          .project-tile:hover h3 {
            transform: scale(1.08);
            text-shadow: 0 0 25px rgba(212, 175, 55, 0.8);
            filter: brightness(1.2);
          }

          .project-tile p {
            font-size: 14px;
            opacity: 0.8;
            line-height: 1.4;
            position: relative;
            z-index: 2;
            transition: all 0.3s;
          }

          .project-tile:hover p {
            opacity: 1;
          }

          .future-card {
            background: rgba(0, 0, 0, 0.4);
            padding: 35px;
            border-radius: 20px;
            border: 3px solid var(--unam-gold);
            position: relative;
            overflow: hidden;
            transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
            animation: rotateIn 0.7s ease-out backwards;
            cursor: pointer;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4),
                        inset 0 0 60px rgba(212, 175, 55, 0.1),
                        0 0 50px rgba(212, 175, 55, 0.15);
          }

          .future-card::before {
            content: '🚀';
            position: absolute;
            top: 15px;
            right: 15px;
            font-size: 28px;
            opacity: 0.4;
            animation: float 3s ease-in-out infinite;
            transition: all 0.3s;
          }

          .future-card::after {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: rgba(212, 175, 55, 0.1);
            opacity: 0;
            transition: opacity 0.5s;
            animation: rotate 12s linear infinite;
          }

          .future-card:hover::before {
            opacity: 1;
            transform: scale(1.4) rotate(20deg);
          }

          .future-card:hover::after {
            opacity: 1;
          }

          .future-card:hover {
            transform: translateY(-12px) rotate(-2deg) scale(1.05);
            border-color: var(--unam-gold);
            box-shadow: 0 20px 60px rgba(212, 175, 55, 0.5),
                        inset 0 0 80px rgba(212, 175, 55, 0.2),
                        0 0 80px rgba(212, 175, 55, 0.4);
            background: rgba(212, 175, 55, 0.15);
          }

          .future-card:nth-child(1) { animation-delay: 0.1s; }
          .future-card:nth-child(2) { animation-delay: 0.15s; }
          .future-card:nth-child(3) { animation-delay: 0.2s; }
          .future-card:nth-child(4) { animation-delay: 0.25s; }
          .future-card:nth-child(5) { animation-delay: 0.3s; }
          .future-card:nth-child(6) { animation-delay: 0.35s; }
          .future-card:nth-child(7) { animation-delay: 0.4s; }

          .future-card h3 {
            position: relative;
            z-index: 2;
            transition: all 0.4s;
            text-align: center;
            color: var(--unam-gold);
            font-size: 24px;
            letter-spacing: 1px;
          }

          .future-card:hover h3 {
            transform: scale(1.15);
            text-shadow: 0 0 30px rgba(212, 175, 55, 0.9);
            filter: brightness(1.3);
            letter-spacing: 2px;
          }

          /* Animaciones */
          @keyframes slideInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes fadeInLeft {
            from {
              opacity: 0;
              transform: translateX(-20px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          @keyframes scaleIn {
            from {
              opacity: 0;
              transform: scale(0.8);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }

          @keyframes rotateIn {
            from {
              opacity: 0;
              transform: rotate(-5deg) scale(0.9);
            }
            to {
              opacity: 1;
              transform: rotate(0) scale(1);
            }
          }

          @keyframes pulse {
            0%, 100% {
              opacity: 1;
              transform: scale(1);
            }
            50% {
              opacity: 0.9;
              transform: scale(1.05);
            }
          }

          @keyframes shimmer {
            0% {
              background-position: -200% center;
            }
            100% {
              background-position: 200% center;
            }
          }

          @keyframes rotate {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }

          @keyframes bounce {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-10px);
            }
          }

          @keyframes twinkle {
            0%, 100% {
              opacity: 0.3;
              transform: scale(1);
            }
            50% {
              opacity: 1;
              transform: scale(1.2);
            }
          }

          @keyframes float {
            0%, 100% {
              transform: translateY(0) rotate(0deg);
            }
            50% {
              transform: translateY(-10px) rotate(10deg);
            }
          }

          .hackathon-container {
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(15px);
            border: 3px solid var(--unam-gold);
            box-shadow: 0 12px 48px rgba(0, 0, 0, 0.5), 
                        inset 0 0 80px rgba(212, 175, 55, 0.1),
                        0 0 60px rgba(212, 175, 55, 0.2);
            position: relative;
            overflow: hidden;
          }

          .hackathon-container::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: rgba(212, 175, 55, 0.05);
            animation: rotate 20s linear infinite;
            pointer-events: none;
          }

          .future-container {
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(15px);
            border: 3px solid var(--unam-gold);
            box-shadow: 0 12px 48px rgba(0, 0, 0, 0.5), 
                        inset 0 0 80px rgba(212, 175, 55, 0.1),
                        0 0 60px rgba(212, 175, 55, 0.2);
            position: relative;
            overflow: hidden;
          }

          .future-container::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: rgba(212, 175, 55, 0.05);
            animation: rotate 25s linear infinite reverse;
            pointer-events: none;
          }

          /* Estilos para tarjetas de embajadores */
          .ambassador-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 30px;
            width: 100%;
            max-width: 1400px;
            padding: 20px;
          }

          .ambassador-card {
            background: rgba(0, 0, 0, 0.5);
            border: 3px solid var(--unam-gold);
            border-radius: 24px;
            padding: 30px;
            position: relative;
            overflow: hidden;
            transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
            animation: scaleIn 0.6s ease-out backwards;
            cursor: pointer;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4),
                        inset 0 0 60px rgba(212, 175, 55, 0.1),
                        0 0 50px rgba(212, 175, 55, 0.15);
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
          }

          .ambassador-card::before {
            content: '⭐';
            position: absolute;
            top: 15px;
            right: 15px;
            font-size: 28px;
            opacity: 0.4;
            animation: twinkle 2s ease-in-out infinite;
            transition: all 0.3s;
          }

          .ambassador-card::after {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: rgba(212, 175, 55, 0.1);
            opacity: 0;
            transition: opacity 0.5s;
            animation: rotate 10s linear infinite;
          }

          .ambassador-card:hover::before {
            opacity: 1;
            transform: scale(1.3) rotate(15deg);
          }

          .ambassador-card:hover::after {
            opacity: 1;
          }

          .ambassador-card:hover {
            transform: translateY(-12px) scale(1.03);
            border-color: var(--unam-gold);
            box-shadow: 0 20px 60px rgba(212, 175, 55, 0.5),
                        inset 0 0 80px rgba(212, 175, 55, 0.2),
                        0 0 80px rgba(212, 175, 55, 0.4);
            background: rgba(212, 175, 55, 0.15);
          }

          .ambassador-card:nth-child(1) { animation-delay: 0.1s; }
          .ambassador-card:nth-child(2) { animation-delay: 0.2s; }
          .ambassador-card:nth-child(3) { animation-delay: 0.3s; }

          .ambassador-photo {
            width: 180px;
            height: 180px;
            border-radius: 50%;
            border: 4px solid var(--unam-gold);
            object-fit: cover;
            margin-bottom: 20px;
            box-shadow: 0 8px 30px rgba(212, 175, 55, 0.4);
            transition: all 0.4s;
            position: relative;
            z-index: 2;
          }

          .ambassador-card:hover .ambassador-photo {
            transform: scale(1.1);
            box-shadow: 0 12px 40px rgba(212, 175, 55, 0.6);
            border-color: #F4C842;
          }

          .ambassador-name {
            color: var(--unam-gold);
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 10px;
            position: relative;
            z-index: 2;
            transition: all 0.4s;
            text-shadow: 0 0 20px rgba(212, 175, 55, 0.6);
          }

          .ambassador-card:hover .ambassador-name {
            transform: scale(1.05);
            text-shadow: 0 0 30px rgba(212, 175, 55, 0.9);
          }

          .ambassador-title {
            color: rgba(255, 255, 255, 0.9);
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 15px;
            position: relative;
            z-index: 2;
            text-transform: uppercase;
            letter-spacing: 1px;
          }

          .ambassador-description {
            color: rgba(255, 255, 255, 0.8);
            font-size: 14px;
            line-height: 1.6;
            position: relative;
            z-index: 2;
            max-height: 200px;
            overflow-y: auto;
          }

          .ambassador-description::-webkit-scrollbar {
            width: 6px;
          }

          .ambassador-description::-webkit-scrollbar-track {
            background: rgba(255,255,255,0.05);
            border-radius: 3px;
          }

          .ambassador-description::-webkit-scrollbar-thumb {
            background: var(--unam-gold);
            border-radius: 3px;
          }

          .ambassador-badge {
            position: absolute;
            top: 20px;
            left: 20px;
            background: var(--unam-gold);
            color: #000;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 1px;
            z-index: 3;
            box-shadow: 0 4px 15px rgba(212, 175, 55, 0.4);
          }

          @media (max-width: 768px) {
            .slide {
              padding: 30px 20px;
            }

            .slide-title {
              font-size: 36px;
            }

            .content-grid {
              grid-template-columns: 1fr;
              gap: 20px;
            }

            .project-grid {
              grid-template-columns: 1fr;
            }

            .team-section {
              grid-template-columns: 1fr;
            }

            .stats-huge {
              font-size: 80px;
            }

            .progress-bar {
              width: 150px;
            }

            .content-grid {
              grid-template-columns: 1fr;
              gap: 20px;
            }

            .image-gallery {
              max-height: 60vh;
              height: 60vh;
            }

            .image-gallery-grid {
              grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
              gap: 10px;
            }

            .gallery-image {
              height: 120px;
            }

            .ambassador-grid {
              grid-template-columns: 1fr;
              gap: 20px;
              padding: 10px;
            }

            .ambassador-photo {
              width: 140px;
              height: 140px;
            }

            .ambassador-name {
              font-size: 22px;
            }

            .ambassador-description {
              font-size: 12px;
              max-height: 150px;
            }
          }
        `}</style>

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Urbanist:wght@400;700;900&family=Inter:wght@300;400;600&display=swap" rel="stylesheet" />

        <img 
          src="/images/LogosCriptounam3.svg" 
          className="floating-logo" 
          alt="CriptoUNAM" 
        />

        <div className="bg-glow" style={{ top: '-200px', left: '-200px' }}></div>
        <div className="bg-glow" style={{ bottom: '-200px', right: '-200px' }}></div>

        <div className="presentation">
          {/* SLIDE 1: PORTADA */}
          <div className={`slide ${currentSlide === 0 ? 'active' : ''}`}>
            <img 
              src="/images/LogosCriptounam3.svg" 
              className="logo-main" 
              alt="CriptoUNAM" 
            />
            <h1 className="slide-title" style={{ fontSize: '90px' }}>
              RECAP<span style={{ color: 'var(--unam-gold)' }}> CRIPTOUNAM 2025</span>
            </h1>
            <p className="slide-subtitle">ESTO FUE LO QUE HICIMOS EN 2025 🎉</p>
            <p style={{ opacity: 0.6 }}></p>
          </div>

          

          {/* SLIDES MENSUALES (1-12) */}
          <div className={`slide ${currentSlide === 1 ? 'active' : ''}`}>
            <div className="month-badge">ENERO</div>
            <h2 className="slide-title">
              Hackathon <span style={{ color: 'var(--unam-gold)' }}>De VARA en ITAM</span>
            </h2>
            <div className="content-grid">
              <ImageGallery month="ENERO" />
            </div>
          </div>

          <div className={`slide ${currentSlide === 2 ? 'active' : ''}`}>
            <div className="month-badge">FEBRERO</div>
            <h2 className="slide-title">
              Eventos en Economía UNAM <span style={{ color: 'var(--unam-gold)' }}></span>
            </h2>
            <div className="content-grid">
              <ImageGallery month="FEBRERO" />
            </div>
          </div>

          <div className={`slide ${currentSlide === 3 ? 'active' : ''}`}>
            <div className="month-badge">MARZO</div>
            <h2 className="slide-title">
              Argentina, Bootcamps y <span style={{ color: 'var(--unam-gold)' }}>Workshops</span>
            </h2>
            <div className="content-grid">
              <ImageGallery month="MARZO" />
            </div>
          </div>

          <div className={`slide ${currentSlide === 4 ? 'active' : ''}`}>
            <div className="month-badge">ABRIL</div>
            <h2 className="slide-title">
              Expansión <span style={{ color: 'var(--unam-gold)' }}>Interuniversitaria</span>
            </h2>
            <div className="content-grid">
              <ImageGallery month="ABRIL" />
            </div>
          </div>

          <div className={`slide ${currentSlide === 5 ? 'active' : ''}`}>
            <div className="month-badge">MAYO</div>
            <h2 className="slide-title">
              Hackathones <span style={{ color: 'var(--unam-gold)' }}>LatAm</span>
            </h2>
            <div className="content-grid">
              <ImageGallery month="MAYO" />
            </div>
          </div>

          <div className={`slide ${currentSlide === 6 ? 'active' : ''}`}>
            <div className="month-badge">JUNIO</div>
            <h2 className="slide-title">
              Nouns amigos, Diputados y  <span style={{ color: 'var(--unam-gold)' }}>Demo Day en BaseBatch</span>
            </h2>
            <div className="content-grid">
              <ImageGallery month="JUNIO" />
            </div>
          </div>

          <div className={`slide ${currentSlide === 7 ? 'active' : ''}`}>
            <div className="month-badge">JULIO</div>
            <h2 className="slide-title">
              Summer <span style={{ color: 'var(--unam-gold)' }}>Builders</span>
            </h2>
            <div className="content-grid">
              <ImageGallery month="JULIO" />
            </div>
          </div>

          <div className={`slide ${currentSlide === 8 ? 'active' : ''}`}>
            <div className="month-badge">AGOSTO</div>
            <h2 className="slide-title">
              Bitso Win, <span style={{ color: 'var(--unam-gold)' }}> ETH Global NewYork & Monad Hackathon</span>
            </h2>
            <div className="content-grid">
              <ImageGallery month="AGOSTO" />
            </div>
          </div>

          <div className={`slide ${currentSlide === 9 ? 'active' : ''}`}>
            <div className="month-badge">SEPTIEMBRE</div>
            <h2 className="slide-title">
              Meridian <span style={{ color: 'var(--unam-gold)' }}>Rio & CU Islas</span>
            </h2>
            <div className="content-grid">
              <ImageGallery month="SEPTIEMBRE" />
            </div>
          </div>

          <div className={`slide ${currentSlide === 10 ? 'active' : ''}`}>
            <div className="month-badge">OCTUBRE</div>
            <h2 className="slide-title">
              BASE, Starknet, Solana & <span style={{ color: 'var(--unam-gold)' }}>ETH México Monterrey</span>
            </h2>
            <div className="content-grid">
              <ImageGallery month="OCTUBRE" />
            </div>
          </div>

          <div className={`slide ${currentSlide === 11 ? 'active' : ''}`}>
            <div className="month-badge">NOVIEMBRE</div>
            <h2 className="slide-title">
              Devconnect, Foro Blockchain <span style={{ color: 'var(--unam-gold)' }}>ETH Global Argentina</span>
            </h2>
            <div className="content-grid">
              <ImageGallery month="NOVIEMBRE" />
            </div>
          </div>

          <div className={`slide ${currentSlide === 12 ? 'active' : ''}`}>
            <div className="month-badge">DICIEMBRE</div>
            <h2 className="slide-title">
              Cierre  <span style={{ color: 'var(--unam-gold)' }}></span>
            </h2>
            <div className="content-grid">
              <ImageGallery month="DICIEMBRE" />
            </div>
          </div>

          {/* SLIDE: IMPACTO EN CIFRAS (después de Diciembre) */}
          <div className={`slide ${currentSlide === 13 ? 'active' : ''}`}>
            <h2 className="slide-title">
              NUESTRA PARTICIPACIÓN EN <span style={{ color: 'var(--unam-gold)' }}>HACKATHONES 2025</span>
            </h2>
            <div className="hackathon-container" style={{ 
              width: '100%', 
              maxWidth: '1200px', 
              maxHeight: '70vh', 
              overflowY: 'auto',
              padding: '30px',
              borderRadius: '20px'
            }}>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                gap: '25px',
                marginBottom: '30px'
              }}>
                <div className="hackathon-card">
                  <h3 style={{ 
                    color: 'var(--unam-gold)', 
                    marginBottom: '20px', 
                    fontSize: '26px', 
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    textShadow: '0 0 20px rgba(212, 175, 55, 0.6)'
                  }}>
                    <span style={{ fontSize: '32px' }}>🏆</span>
                    Hackathones Ganados
                  </h3>
                  <div style={{ fontSize: '14px', lineHeight: '1.8' }}>
                    <p className="hackathon-item"><strong>UNIFOOD</strong> - ETHCDM - <span style={{ color: 'var(--unam-gold)' }}>500 USD</span></p>
                    <p className="hackathon-item"><strong>CampusCoin</strong> - BaseBatch Latam 001 - <span style={{ color: 'var(--unam-gold)' }}>1,250 USD</span></p>
                    <p className="hackathon-item"><strong>MY DENTAL VAULT</strong> - POLKADOT - <span style={{ color: 'var(--unam-gold)' }}>200 USD</span></p>
                    <p className="hackathon-item"><strong>UNAM DAO</strong> - SHERRY (AVAX) - <span style={{ color: 'var(--unam-gold)' }}>300 USD</span></p>
                    <p className="hackathon-item"><strong>LA KINIELA</strong> - BITSO HACKATHON - <span style={{ color: 'var(--unam-gold)' }}>1,500 USD</span></p>
                    <p className="hackathon-item"><strong>ENERPAY</strong> - BITSO HACKATHON - <span style={{ color: 'var(--unam-gold)' }}>1,000 USD</span></p>
                    <p className="hackathon-item"><strong>NEARMINT</strong> - STARKNET RESOLVE - <span style={{ color: 'var(--unam-gold)' }}>600 USD</span></p>
                    <p className="hackathon-item"><strong>UNBOX</strong> - SOLANA SHIPYARD - <span style={{ color: 'var(--unam-gold)' }}>150 USD</span></p>
                    <p className="hackathon-item"><strong>VERIFICA.XYZ</strong> - ETH MEXICO MONTERREY - <span style={{ color: 'var(--unam-gold)' }}>1,500 USD</span></p>
                    <p className="hackathon-item"><strong>EVVM SCANNER</strong> - ETH GLOBAL ARGENTINA - <span style={{ color: 'var(--unam-gold)' }}>1,375 USD</span></p>
                    <p className="hackathon-item"><strong>PREMIO.XYZ</strong> - CELO PROOF OF SHIP - <span style={{ color: 'var(--unam-gold)' }}>40 USD</span></p>
                    <p className="hackathon-item"><strong>SKILLHUB ID</strong> - STELLAR MEXICO - <span style={{ color: 'var(--unam-gold)' }}>100 USD</span></p>
                  </div>
                  <div className="hackathon-total" style={{ 
                    marginTop: '25px', 
                    paddingTop: '25px', 
                    borderTop: '3px solid var(--unam-gold)',
                    fontSize: '24px',
                    fontWeight: 'bold'
                  }}>
                    TOTAL: <span style={{ fontSize: '36px' }}>8,515 USD</span>
                  </div>
                </div>
                <div className="hackathon-card">
                  <h3 style={{ 
                    color: 'var(--unam-gold)', 
                    marginBottom: '20px', 
                    fontSize: '26px', 
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    textShadow: '0 0 20px rgba(212, 175, 55, 0.6)'
                  }}>
                    <span style={{ fontSize: '32px' }}>🚀</span>
                    Hackathones Participados
                  </h3>
                  <div style={{ fontSize: '14px', lineHeight: '1.8' }}>
                    <p className="hackathon-item"><strong>UNIFOOD</strong> - ETHCDM <span style={{ color: 'var(--unam-gold)' }}>🏆 500 USD</span></p>
                    <p className="hackathon-item"><strong>CampusCoin</strong> - BaseBatch Latam 001 <span style={{ color: 'var(--unam-gold)' }}>🏆 1,250 USD</span></p>
                    <p className="hackathon-item"><strong>MY DENTAL VAULT</strong> - POLKADOT <span style={{ color: 'var(--unam-gold)' }}>🏆 200 USD</span></p>
                    <p className="hackathon-item"><strong>UNAM DAO</strong> - SHERRY (AVAX) <span style={{ color: 'var(--unam-gold)' }}>🏆 300 USD</span></p>
                    <p className="hackathon-item"><strong>LA KINIELA</strong> - BITSO HACKATHON <span style={{ color: 'var(--unam-gold)' }}>🏆 1,500 USD</span></p>
                    <p className="hackathon-item"><strong>ENERPAY</strong> - BITSO HACKATHON <span style={{ color: 'var(--unam-gold)' }}>🏆 1,000 USD</span></p>
                    <p className="hackathon-item"><strong>NEARMINT</strong> - STARKNET RESOLVE <span style={{ color: 'var(--unam-gold)' }}>🏆 600 USD</span></p>
                    <p className="hackathon-item"><strong>UNBOX</strong> - SOLANA SHIPYARD <span style={{ color: 'var(--unam-gold)' }}>🏆 150 USD</span></p>
                    <p className="hackathon-item"><strong>VERIFICA.XYZ</strong> - ETH MEXICO MONTERREY <span style={{ color: 'var(--unam-gold)' }}>🏆 1,500 USD</span></p>
                    <p className="hackathon-item"><strong>EVVM SCANNER</strong> - ETH GLOBAL ARGENTINA <span style={{ color: 'var(--unam-gold)' }}>🏆 1,375 USD</span></p>
                    <p className="hackathon-item"><strong>PREMIO.XYZ</strong> - CELO PROOF OF SHIP <span style={{ color: 'var(--unam-gold)' }}>🏆 40 USD</span></p>
                    <p className="hackathon-item"><strong>SKILLHUB ID</strong> - STELLAR MEXICO <span style={{ color: 'var(--unam-gold)' }}>🏆 100 USD</span></p>
                    <p className="hackathon-item" style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid rgba(255,255,255,0.1)' }}><strong>ALEPH ARGENTINA</strong> - UNIFOOD</p>
                    <p className="hackathon-item"><strong>PUMAPAY</strong> - BITSO Y STELLAR ARGENTINA</p>
                    <p className="hackathon-item"><strong>ZENTRADE</strong> - MERIDIAN RIO DE JANEIRO</p>
                    <p className="hackathon-item"><strong>WORLD CUP</strong> - ETH GLOBAL NUEVA YORK</p>
                    <p className="hackathon-item"><strong>CORE WAVE AGENTS</strong> - COREDAO BUILDATHON</p>
                    <p className="hackathon-item"><strong>MOBILE MONAD HACKATHON</strong> - KINIELA & INSURANCE</p>
                  </div>
                  <div className="hackathon-total" style={{ 
                    marginTop: '25px', 
                    paddingTop: '25px', 
                    borderTop: '3px solid var(--unam-gold)',
                    fontSize: '24px',
                    fontWeight: 'bold',
                    textAlign: 'center'
                  }}>
                    TOTAL: <span style={{ fontSize: '36px' }}>18 Hackathones</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SLIDE 15: HALL OF FAME (PROYECTOS) */}
          <div className={`slide ${currentSlide === 14 ? 'active' : ''}`}>
            <h2 className="slide-title">
              HALL OF <span style={{ color: 'var(--unam-gold)' }}>FAME</span>
            </h2>
            <p className="slide-subtitle">Soluciones On-Chain de Alto Nivel</p>
            <div className="project-grid">
              <div className="project-tile">
                <h3>UTONOMA</h3>
                <p>Proyecto destacado de CriptoUNAM.</p>
              </div>
              <div className="project-tile">
                <h3>VERIFICA.XYZ</h3>
                <p>Transparencia institucional con ENS. Ganador de 3 tracks en ETH México Monterrey.</p>
              </div>
              <div className="project-tile">
                <h3>LA KINIELA</h3>
                <p>Predicciones descentralizadas en Arbitrum. Ganadores del Bitso Hackathon 2025.</p>
              </div>
              <div className="project-tile">
                <h3>PUMAPAY</h3>
                <p>Proyecto destacado de CriptoUNAM.</p>
              </div>
              <div className="project-tile">
                <h3>UNBOX</h3>
                <p>Tokenización de streetwear y art toys en Solana. Ganador en Solana Shipyard.</p>
              </div>
              <div className="project-tile">
                <h3>EVVM SCANNER</h3>
                <p>Ganador en ETH Global Argentina con 1,375 USD en premios.</p>
              </div>
              <div className="project-tile">
                <h3>PREMIO.XYZ</h3>
                <p>Ganador en Celo Proof of Ship con 40 USD en premios.</p>
              </div>
            </div>
          </div>

          {/* SLIDE 17: LO QUE SE VIENE PARA 2026 */}
          <div className={`slide ${currentSlide === 15 ? 'active' : ''}`}>
            <h2 className="slide-title">
              LO QUE SE VIENE PARA <span style={{ color: 'var(--unam-gold)' }}>2026</span>
            </h2>
            <div className="future-container" style={{ 
              width: '100%', 
              maxWidth: '1200px', 
              maxHeight: '70vh', 
              overflowY: 'auto',
              padding: '30px',
              borderRadius: '20px'
            }}>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
                gap: '25px'
              }}>
                <div className="future-card">
                  <h3 style={{ color: 'var(--unam-gold)', fontSize: '22px', fontWeight: 'bold' }}>HACKATHON UNAM</h3>
                </div>
                <div className="future-card">
                  <h3 style={{ color: 'var(--unam-gold)', fontSize: '22px', fontWeight: 'bold' }}>BOOTCAMPS</h3>
                </div>
                <div className="future-card">
                  <h3 style={{ color: 'var(--unam-gold)', fontSize: '22px', fontWeight: 'bold' }}>INCUBACION DE PROYECTOS</h3>
                </div>
                <div className="future-card">
                  <h3 style={{ color: 'var(--unam-gold)', fontSize: '22px', fontWeight: 'bold' }}>GO TO MARKETS</h3>
                </div>
                <div className="future-card">
                  <h3 style={{ color: 'var(--unam-gold)', fontSize: '22px', fontWeight: 'bold' }}>ONBOARDING ESTUDIANTES</h3>
                </div>
                <div className="future-card">
                  <h3 style={{ color: 'var(--unam-gold)', fontSize: '22px', fontWeight: 'bold' }}>DESARROLLO DE TALENTO</h3>
                </div>
                <div className="future-card">
                  <h3 style={{ color: 'var(--unam-gold)', fontSize: '22px', fontWeight: 'bold' }}>CRIPTOUNAM DAO</h3>
                </div>
              </div>
            </div>
          </div>

          {/* SLIDE 17: RECONOCIMIENTO ESPECIAL */}
          <div className={`slide ${currentSlide === 16 ? 'active' : ''}`}>
            <h2 className="slide-title">
              RECONOCIMIENTO <span style={{ color: 'var(--unam-gold)' }}>ESPECIAL</span>
            </h2>
            <p className="slide-subtitle">Nuevos Líderes de CriptoUNAM</p>
            <div className="ambassador-grid">
              <div className="ambassador-card">
                <div className="ambassador-badge">Líder</div>
                <img 
                  src="/images/Equipo/AndresRodriguez.jpg" 
                  alt="Andrés Rodríguez"
                  className="ambassador-photo"
                />
                <h3 className="ambassador-name">Andrés Rodríguez</h3>
                <p className="ambassador-title">Ingeniero en Computación | Desarrollador Full-Stack | Founder</p>
                <p className="ambassador-description">
                  Ingeniero en Computación y desarrollador de software especializado en tecnologías descentralizadas y blockchain. 
                  Actualmente estudiante en la Universidad Nacional Autónoma de México (UNAM), se desempeña como embajador de CriptoUNAM, 
                  donde ha apoyado iniciativas educativas y programas de mentoría orientados a impulsar la adopción tecnológica en América Latina.
                  <br /><br />
                  Su experiencia técnica abarca el desarrollo de contratos inteligentes sobre Ethereum y sus soluciones de escalabilidad. 
                  Participa activamente en hackathones como competidor y mentor, impulsando el desarrollo de aplicaciones descentralizadas 
                  con la misión de democratizar el acceso a herramientas financieras avanzadas.
                </p>
              </div>
              <div className="ambassador-card">
                <div className="ambassador-badge">Líder</div>
                <img 
                  src="/images/Equipo/IanHernandes.jpg" 
                  alt="Ian Hernández"
                  className="ambassador-photo"
                />
                <h3 className="ambassador-name">Ian Hernández</h3>
                <p className="ambassador-title">IanClavely | Embajador Arbitrum</p>
                <p className="ambassador-description">
                  Joven desarrollador blockchain mexicano, es estudiante de Infraestructura de Redes Digitales con enfoque en blockchain, 
                  redes y ciberseguridad. Embajador de CriptoUNAM y Arbitrum, destaca en Web3 LATAM educando y construyendo.
                  <br /><br />
                  Colaborativo y apasionado por trading y las tecnologías emergentes y disruptivas. Su compromiso con la educación 
                  y el desarrollo de la comunidad blockchain lo ha posicionado como una figura clave en el ecosistema Web3 latinoamericano.
                </p>
              </div>
              <div className="ambassador-card">
                <div className="ambassador-badge">Líder</div>
                <img 
                  src="/images/Equipo/AdrianMartinez.png" 
                  alt="Adrián Martínez"
                  className="ambassador-photo"
                />
                <h3 className="ambassador-name">Adrián Martínez</h3>
                <p className="ambassador-title">Economista | Trader | Entusiasta Web3</p>
                <p className="ambassador-description">
                  Estudiante de economía con gran interés en el mundo financiero y el trading. Entusiasta del ecosistema Web3, 
                  siempre dispuesto a conectar y colaborar con la comunidad.
                  <br /><br />
                  Su perspectiva única combina conocimientos económicos tradicionales con la innovación de las tecnologías descentralizadas, 
                  aportando una visión integral al desarrollo de CriptoUNAM y al crecimiento del ecosistema blockchain en México.
                </p>
              </div>
            </div>
          </div>

          {/* SLIDE 18: GRACIAS */}
          <div className={`slide ${currentSlide === 17 ? 'active' : ''}`}>
            <h1 className="slide-title" style={{ fontSize: '100px' }}>GRACIAS</h1>
            <p className="slide-subtitle" style={{ color: 'white', fontSize: '24px' }}>
              ¡NOS VEMOS EN EL CÓDIGO!
            </p>
            <div style={{ display: 'flex', gap: '40px', marginTop: '50px', opacity: 0.5, flexWrap: 'wrap', justifyContent: 'center' }}>
              <span>Arbitrum</span> • <span>Scroll</span> • <span>ENS</span> • <span>Eth 5 de Mayo</span> • <span>Frutero Club</span>
            </div>
          </div>

          {/* CONTROLES */}
          <div className="controls">
            <button className="nav-btn" onClick={prevSlide}>
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <button className="nav-btn" onClick={nextSlide}>
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default YearInReview

